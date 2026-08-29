const clone = (value) => {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
};

export class ControlGraph {
  constructor(definitions, initialState = {}) {
    this.definitions = new Map(definitions.map((d) => [d.id, { ...d }]));
    if (this.definitions.size !== definitions.length) throw new Error('DUPLICATE_CONTROL_ID');
    this.state = {};
    for (const def of definitions) {
      const seed = Object.prototype.hasOwnProperty.call(initialState, def.id)
        ? initialState[def.id]
        : def.defaultValue;
      this.state[def.id] = this.#coerce(def, seed, { internal: true });
    }
  }

  get(id) {
    this.#require(id);
    return this.state[id];
  }

  definition(id) {
    return this.#require(id);
  }

  setControl(id, value, { allowDerivedOverride = false } = {}) {
    const def = this.#require(id);
    if (def.type === 'derived' && !allowDerivedOverride) {
      throw new Error(`DERIVED_CONTROL:${id}`);
    }
    if (!def.mutable && def.type !== 'derived' && !allowDerivedOverride) {
      throw new Error(`IMMUTABLE_CONTROL:${id}`);
    }
    const before = this.state[id];
    const after = this.#coerce(def, value, { internal: allowDerivedOverride });
    this.state[id] = after;
    return {
      id,
      before,
      after,
      authorityViolation: def.type === 'derived' && allowDerivedOverride,
      changed: !Object.is(before, after)
    };
  }

  applyDerived(values) {
    for (const [id, value] of Object.entries(values || {})) {
      const def = this.#require(id);
      if (def.type !== 'derived') throw new Error(`NOT_DERIVED_CONTROL:${id}`);
      this.state[id] = this.#coerce(def, value, { internal: true });
    }
  }

  restore(snapshot) {
    for (const id of Object.keys(snapshot)) this.#require(id);
    for (const [id, def] of this.definitions.entries()) {
      if (Object.prototype.hasOwnProperty.call(snapshot, id)) {
        this.state[id] = this.#coerce(def, snapshot[id], { internal: true });
      }
    }
  }

  snapshot() {
    return clone(this.state);
  }

  dependencySnapshot() {
    const out = {};
    for (const [id, def] of this.definitions.entries()) {
      out[id] = {
        type: def.type,
        protected: Boolean(def.protected),
        dependencies: [...(def.dependencies || [])]
      };
    }
    return out;
  }

  #require(id) {
    const def = this.definitions.get(id);
    if (!def) throw new Error(`UNKNOWN_CONTROL:${id}`);
    return def;
  }

  #coerce(def, value, { internal = false } = {}) {
    if (value === null && (def.type === 'derived' || internal)) return null;

    if (def.type === 'categorical') {
      if (!def.options?.some((v) => Object.is(v, value))) {
        throw new Error(`INVALID_OPTION:${def.id}`);
      }
      return value;
    }

    if (['independent', 'visualization', 'derived'].includes(def.type)) {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) {
        if (def.type === 'derived' && internal && value === null) return null;
        throw new Error(`NON_FINITE_CONTROL:${def.id}`);
      }
      if (Number.isFinite(def.min) && numeric < def.min) return def.min;
      if (Number.isFinite(def.max) && numeric > def.max) return def.max;
      return numeric;
    }

    return value;
  }
}
