import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useStore } from '../store'
import { v4 as uuidv4 } from 'uuid'

const MediaPage = () => {
  const { mediaProjects, addMediaProject } = useStore()
  const [activeTab, setActiveTab] = useState('image')
  const [prompt, setPrompt] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedUrl, setGeneratedUrl] = useState('')

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return
    
    setIsGenerating(true)
    setGeneratedUrl('')
    
    try {
      // Simulate generation
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Create a project record
      const project = {
        id: uuidv4(),
        name: `Media ${mediaProjects.length + 1}`,
        type: activeTab,
        prompt,
        url: getMockUrl(activeTab, prompt),
        createdAt: new Date().toISOString()
      }
      
      addMediaProject(project)
      setGeneratedUrl(project.url)
    } catch (error) {
      console.error('Generation error:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getMockUrl = (type, prompt) => {
    switch (type) {
      case 'image':
        return `https://picsum.photos/seed/${prompt}/512/512`
      case 'video':
        return 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4'
      case 'audio':
        return 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3'
      default:
        return ''
    }
  }

  const templates = {
    image: [
      'A beautiful landscape with mountains and rivers',
      'A futuristic city at night with neon lights',
      'A quantum wave function visualization',
      'The structure of a DNA molecule'
    ],
    video: [
      'A 10-second animation of particles moving',
      'A slow-motion explosion of a supernova',
      'A rotating 3D model of a molecule',
      'A time-lapse of a physics experiment'
    ],
    audio: [
      'A professional male voice explaining quantum mechanics',
      'A calm female voice narrating a physics theory',
      'An enthusiastic voice describing a scientific discovery'
    ]
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>🎨</span>
          Media Studio
        </h1>
        <p className="page-subtitle">
          Media generation interface - <span className="badge badge-secondary">Simulated</span>
        </p>
      </div>

      <div className="page-content">
        <div className="tabs" style={{ display: 'flex', gap: '4px', borderBottom: '1px solid var(--vault-light)', marginBottom: '20px' }}>
          <button 
            className={`tab ${activeTab === 'image' ? 'active' : ''}`}
            onClick={() => setActiveTab('image')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'image' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 'image' ? '2px solid var(--gold)' : 'none'
            }}
          >
            🖼️ Image
          </button>
          <button 
            className={`tab ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'video' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 'video' ? '2px solid var(--gold)' : 'none'
            }}
          >
            🎬 Video
          </button>
          <button 
            className={`tab ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
            style={{
              padding: '12px 20px',
              background: 'transparent',
              border: 'none',
              color: activeTab === 'audio' ? 'var(--gold)' : 'var(--steel)',
              fontSize: '0.9rem',
              fontWeight: 500,
              cursor: 'pointer',
              borderBottom: activeTab === 'audio' ? '2px solid var(--gold)' : 'none'
            }}
          >
            🎤 Audio
          </button>
        </div>

        <div className="grid grid-2" style={{ gap: '20px' }}>
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Generation Parameters</h3>
            </div>
            <div className="form-group">
              <label className="form-label">Prompt</label>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder={`Describe the ${activeTab} you want to generate...`}
                className="form-textarea"
                rows={5}
              />
            </div>
            <button
              onClick={handleGenerate}
              disabled={!prompt.trim() || isGenerating}
              className="btn btn-primary"
            >
              {isGenerating ? (
                <>
                  <span className="spinner" />
                  Generating...
                </>
              ) : (
                `Generate ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`
              )}
            </button>
            
            <div style={{ marginTop: '16px' }}>
              <h4 style={{ marginBottom: '8px', color: 'var(--paper)' }}>Quick Prompts</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {templates[activeTab]?.map((template, index) => (
                  <button
                    key={index}
                    onClick={() => setPrompt(template)}
                    className="btn btn-secondary btn-sm"
                  >
                    {template.slice(0, 40)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Preview</h3>
            </div>
            <div style={{ 
              height: '300px', 
              background: 'var(--vault-deep)', 
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden'
            }}>
              {generatedUrl ? (
                <>
                  {activeTab === 'image' && (
                    <img src={generatedUrl} alt={prompt} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
                  )}
                  {activeTab === 'video' && (
                    <video controls src={generatedUrl} style={{ maxWidth: '100%', maxHeight: '100%' }} />
                  )}
                  {activeTab === 'audio' && (
                    <audio controls src={generatedUrl} style={{ width: '100%' }} />
                  )}
                </>
              ) : (
                <div className="empty-state" style={{ padding: '20px' }}>
                  <span style={{ fontSize: '2rem' }}>
                    {activeTab === 'image' ? '🖼️' : activeTab === 'video' ? '🎬' : '🎤'}
                  </span>
                  <p>No {activeTab} generated yet</p>
                </div>
              )}
            </div>
            {generatedUrl && (
              <button
                onClick={() => setGeneratedUrl('')}
                className="btn btn-secondary btn-sm"
                style={{ marginTop: '12px' }}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Media Projects List */}
        {mediaProjects.length > 0 && (
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">My Media Projects</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {mediaProjects.map((project) => (
                <div
                  key={project.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    background: 'var(--vault-light)',
                    borderRadius: 'var(--radius-md)'
                  }}
                >
                  <span style={{ fontSize: '1.5rem' }}>
                    {project.type === 'image' ? '🖼️' : project.type === 'video' ? '🎬' : '🎤'}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 500, color: 'var(--paper)' }}>
                      {project.name}
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--steel-dim)' }}>
                      {project.prompt.slice(0, 50)}...
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="card">
          <div className="card-header">
            <h3 className="card-title">ℹ️ About Media Studio</h3>
          </div>
          <p style={{ color: 'var(--steel)' }}>
            This is a media generation interface. In a full implementation, this would connect to:
          </p>
          <ul style={{ color: 'var(--steel-dim)', marginTop: '12px', paddingLeft: '20px' }}>
            <li><strong>Image:</strong> DALL-E 3, MidJourney, Stable Diffusion, FLUX</li>
            <li><strong>Video:</strong> Sora, Pika Labs, Runway ML, Stable Video</li>
            <li><strong>Audio:</strong> TTS-1, ElevenLabs, Coqui TTS</li>
          </ul>
          <p style={{ color: 'var(--steel)', marginTop: '12px' }}>
            <strong>Status:</strong> <span className="badge badge-secondary">Simulated</span>
          </p>
          <p style={{ color: 'var(--steel-dim)', fontSize: '0.85rem', marginTop: '8px' }}>
            Currently uses mock data for demonstration. Projects are saved to browser storage.
          </p>
        </div>
      </div>
    </div>
  )
}

export default MediaPage
