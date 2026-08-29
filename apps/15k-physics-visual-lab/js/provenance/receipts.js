function canonicalize(value) {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonicalize(value[key])]));
  }
  if (typeof value === 'number' && !Number.isFinite(value)) return String(value);
  return value;
}

export function canonicalJSON(value) { return JSON.stringify(canonicalize(value)); }

export async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(typeof value === 'string' ? value : canonicalJSON(value));
  const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, '0')).join('');
}

export async function computeRuntimeCodeHash(parts) {
  return sha256Hex(parts.join('\n---15K-CODE-HASH---\n'));
}

export class ReceiptLedger {
  constructor({ storage = globalThis.localStorage ?? null, storageKey = '15k_lab_receipts_v1' } = {}) {
    this.storage = storage;
    this.storageKey = storageKey;
    this.receipts = [];
    if (storage) {
      try {
        const parsed = JSON.parse(storage.getItem(storageKey) || '[]');
        if (Array.isArray(parsed)) this.receipts = parsed;
      } catch { this.receipts = []; }
    }
  }
  async append(payload) {
    const prev = this.receipts.at(-1)?.receipt_hash || 'GENESIS';
    const body = { ...structuredCloneSafe(payload), prev_receipt_hash: prev };
    const receipt_hash = await sha256Hex(body);
    const receipt = { ...body, receipt_hash };
    this.receipts.push(receipt);
    this.#persist();
    return receipt;
  }
  async verifyChain() {
    let expectedPrev = 'GENESIS';
    for (let i = 0; i < this.receipts.length; i += 1) {
      const receipt = this.receipts[i];
      if (receipt.prev_receipt_hash !== expectedPrev) return { ok: false, index: i, reason: 'PREV_HASH_MISMATCH' };
      const { receipt_hash, ...body } = receipt;
      const actual = await sha256Hex(body);
      if (actual !== receipt_hash) return { ok: false, index: i, reason: 'RECEIPT_HASH_MISMATCH' };
      expectedPrev = receipt_hash;
    }
    return { ok: true };
  }
  clear() { this.receipts.length = 0; this.#persist(); }
  #persist() {
    if (!this.storage) return;
    try { this.storage.setItem(this.storageKey, JSON.stringify(this.receipts)); } catch {}
  }
}

function structuredCloneSafe(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}
