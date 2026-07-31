import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useStore } from '../store'
import { v4 as uuidv4 } from 'uuid'

const ChatPage = () => {
  const { 
    chatSessions, 
    activeChatId, 
    addChatSession, 
    updateChatSession,
    setActiveChat,
    apiConfig 
  } = useStore()
  
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState('gpt-4')
  const messagesEndRef = useRef(null)

  const activeSession = chatSessions.find(s => s.id === activeChatId)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeSession?.messages])

  useEffect(() => {
    if (!activeChatId && chatSessions.length > 0) {
      setActiveChat(chatSessions[0].id)
    }
  }, [activeChatId, chatSessions])

  const handleSend = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = { 
      id: uuidv4(), 
      role: 'user', 
      content: message,
      timestamp: new Date().toISOString(),
      model: selectedModel
    }

    const sessionId = activeChatId || uuidv4()
    const newMessages = [...(activeSession?.messages || []), userMessage]
    
    if (!activeChatId) {
      addChatSession({
        id: sessionId,
        name: `Chat ${chatSessions.length + 1}`,
        model: selectedModel,
        messages: newMessages,
        createdAt: new Date().toISOString()
      })
    } else {
      updateChatSession(activeChatId, { messages: newMessages })
    }

    setMessage('')
    setIsLoading(true)

    try {
      // Simulate API response
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: `This is a simulated response from ${selectedModel}. In a real implementation, this would connect to the actual API.`,
        timestamp: new Date().toISOString(),
        model: selectedModel
      }

      updateChatSession(sessionId, {
        messages: [...newMessages, assistantMessage]
      })
    } catch (error) {
      const errorMessage = {
        id: uuidv4(),
        role: 'system',
        content: `Error: ${error.message}`,
        timestamp: new Date().toISOString(),
        model: selectedModel
      }
      updateChatSession(sessionId, {
        messages: [...newMessages, errorMessage]
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewChat = () => {
    setActiveChat(null)
    setMessage('')
  }

  const availableModels = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5', name: 'GPT-3.5' },
    { id: 'claude-3', name: 'Claude 3' },
    { id: 'gemini', name: 'Gemini' },
    { id: 'qwen', name: 'Qwen (Local)' },
    { id: 'ruflo', name: 'Ruflo (Local)' }
  ]

  const renderMessage = (msg) => {
    const isUser = msg.role === 'user'
    const isAssistant = msg.role === 'assistant'
    const isSystem = msg.role === 'system'

    return (
      <motion.div
        key={msg.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`message ${msg.role}`}
        style={{
          padding: '16px',
          borderRadius: 'var(--radius-md)',
          marginBottom: '12px',
          background: isUser ? 'var(--vault-light)' : 'var(--vault-deep)',
          borderLeft: `4px solid ${isUser ? 'var(--gold)' : 'var(--steel-dim)'}`
        }}
      >
        <div className="message-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontWeight: 500, color: isSystem ? 'var(--error)' : 'var(--paper)' }}>
            {isUser ? 'You' : isAssistant ? 'Assistant' : 'System'}
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--steel-dim)' }}>
            {new Date(msg.timestamp).toLocaleTimeString()}
          </span>
        </div>
        <div className="message-content" style={{ color: isSystem ? 'var(--error)' : 'var(--steel)' }}>
          {msg.content}
        </div>
      </motion.div>
    )
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">
          <span>💬</span>
          Chat
        </h1>
        <p className="page-subtitle">
          Multi-API Chat Interface
        </p>
      </div>

      <div className="page-content">
        <div className="chat-container" style={{ display: 'flex', gap: '20px', height: '100%' }}>
          {/* Sidebar */}
          <div className="chat-sidebar" style={{ width: '250px', minWidth: '250px', display: 'flex', flexDirection: 'column' }}>
            <button onClick={handleNewChat} className="btn btn-primary btn-sm" style={{ marginBottom: '12px' }}>
              + New Chat
            </button>
            <div className="chat-sessions" style={{ flex: 1, overflowY: 'auto' }}>
              {chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`chat-session ${activeChatId === session.id ? 'active' : ''}`}
                  onClick={() => setActiveChat(session.id)}
                  style={{
                    padding: '12px',
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    background: activeChatId === session.id ? 'var(--vault-light)' : 'transparent',
                    border: activeChatId === session.id ? '1px solid var(--gold)' : '1px solid var(--vault-light)'
                  }}
                >
                  <div style={{ fontWeight: 500, color: 'var(--paper)' }}>
                    {session.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--steel-dim)' }}>
                    {session.messages?.length || 0} messages
                  </div>
                </div>
              ))}
              {chatSessions.length === 0 && (
                <div className="empty-state" style={{ padding: '20px' }}>
                  <p>No chats yet. Start a new conversation!</p>
                </div>
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="chat-main" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            {/* Model Selector */}
            <div className="chat-toolbar" style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="form-select"
                style={{ flex: 1 }}
              >
                {availableModels.map((model) => (
                  <option key={model.id} value={model.id}>
                    {model.name}
                  </option>
                ))}
              </select>
              {!apiConfig.openai?.key && (
                <span className="status status-offline" style={{ fontSize: '0.75rem' }}>
                  <span className="status-dot" />
                  API Not Configured
                </span>
              )}
            </div>

            {/* Messages */}
            <div className="messages-container" style={{ flex: 1, overflowY: 'auto', padding: '16px', background: 'var(--vault-deep)', borderRadius: 'var(--radius-md)', marginBottom: '16px' }}>
              <AnimatePresence>
                {activeSession?.messages?.length > 0 ? (
                  activeSession.messages.map(renderMessage)
                ) : (
                  <div className="empty-state">
                    <span style={{ fontSize: '3rem' }}>👋</span>
                    <h3>Hello! How can I help you today?</h3>
                    <p>Select a model and start chatting</p>
                  </div>
                )}
              </AnimatePresence>
              {isLoading && (
                <div className="message assistant" style={{ padding: '16px', borderRadius: 'var(--radius-md)', background: 'var(--vault-deep)' }}>
                  <div className="typing-indicator" style={{ display: 'flex', gap: '4px' }}>
                    <span style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate' }} />
                    <span style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate 0.2s' }} />
                    <span style={{ width: '8px', height: '8px', background: 'var(--gold)', borderRadius: '50%', animation: 'bounce 0.6s infinite alternate 0.4s' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="chat-input-container" style={{ display: 'flex', gap: '12px' }}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault()
                    handleSend()
                  }
                }}
                placeholder={`Message ${selectedModel}... (Shift+Enter for new line)`}
                className="form-textarea"
                disabled={isLoading}
                style={{ flex: 1 }}
              />
              <button
                onClick={handleSend}
                disabled={!message.trim() || isLoading}
                className="btn btn-primary"
                style={{ minWidth: '50px' }}
              >
                ✈️
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatPage
