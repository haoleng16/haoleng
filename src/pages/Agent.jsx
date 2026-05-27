import { useState, useRef, useEffect } from 'react'

const WELCOME = '你好！我是简历分析助手，请上传你的简历（PDF / 图片 / TXT），或直接粘贴内容，我来帮你分析优化。'

function createConversation(title) {
  return { id: Date.now(), title, messages: [{ role: 'assistant', content: WELCOME }], time: new Date().toLocaleString('zh-CN') }
}

function Agent() {
  const [conversations, setConversations] = useState([createConversation('新对话')])
  const [activeId, setActiveId] = useState(conversations[0].id)
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  const activeConv = conversations.find(c => c.id === activeId) || conversations[0]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConv.messages.length])

  function updateConversation(id, updater) {
    setConversations(prev => prev.map(c => (c.id === id ? updater(c) : c)))
  }

  function handleSend() {
    const text = input.trim()
    if (!text && files.length === 0) return

    const fileNames = files.map(f => `📎 ${f.name}`).join('  ')
    const userContent = fileNames ? (text ? `${text}\n${fileNames}` : fileNames) : text

    updateConversation(activeId, c => ({
      ...c,
      messages: [...c.messages, { role: 'user', content: userContent }],
      title: c.messages.length <= 1 && text ? text.slice(0, 20) + (text.length > 20 ? '...' : '') : c.title,
    }))

    // TODO: call DeepSeek API
    setTimeout(() => {
      updateConversation(activeId, c => ({
        ...c,
        messages: [...c.messages, { role: 'assistant', content: '（DeepSeek API 尚未接入，这是占位回复）\n\n我已经收到你的内容，稍后接入 API 后将返回真实的简历分析结果。' }],
      }))
    }, 600)

    setInput('')
    setFiles([])
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  function handleFileChange(e) {
    const selected = Array.from(e.target.files || [])
    const filtered = selected.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase()
      return ['pdf', 'txt', 'png', 'jpg', 'jpeg', 'gif', 'webp'].includes(ext)
    })
    setFiles(prev => [...prev, ...filtered])
    e.target.value = ''
  }

  function removeFile(index) {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  function newConversation() {
    const conv = createConversation('新对话')
    setConversations(prev => [conv, ...prev])
    setActiveId(conv.id)
    setInput('')
    setFiles([])
  }

  function deleteConversation(id) {
    setConversations(prev => {
      const next = prev.filter(c => c.id !== id)
      if (next.length === 0) {
        const fresh = createConversation('新对话')
        setActiveId(fresh.id)
        return [fresh]
      }
      if (id === activeId) setActiveId(next[0].id)
      return next
    })
  }

  return (
    <div className="agent-page">
      {/* Right sidebar — history */}
      <aside className="agent-history">
        <div className="agent-history-header">
          <span>对话记录</span>
          <button className="agent-new-btn" type="button" onClick={newConversation} aria-label="新建对话">+</button>
        </div>
        <div className="agent-history-list">
          {conversations.map(conv => (
            <button
              key={conv.id}
              className={`agent-history-item ${conv.id === activeId ? 'active' : ''}`}
              onClick={() => { setActiveId(conv.id); setInput(''); setFiles([]) }}
            >
              <span className="agent-history-title">{conv.title}</span>
              <span className="agent-history-time">{conv.time}</span>
              <span className="agent-history-delete" role="button" tabIndex={0} onClick={e => { e.stopPropagation(); deleteConversation(conv.id) }}>✕</span>
            </button>
          ))}
        </div>
      </aside>

      {/* Left — chat area */}
      <div className="agent-chat">
        <div className="agent-messages">
          {activeConv.messages.map((msg, i) => (
            <div key={i} className={`agent-bubble agent-bubble--${msg.role}`}>
              {msg.role === 'assistant' && <span className="agent-avatar">AI</span>}
              <div className="agent-bubble-content">
                {msg.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* File preview chips */}
        {files.length > 0 && (
          <div className="agent-file-preview">
            {files.map((f, i) => (
              <span key={i} className="agent-file-chip">
                📎 {f.name}
                <button type="button" className="agent-file-remove" onClick={() => removeFile(i)}>✕</button>
              </span>
            ))}
          </div>
        )}

        {/* Input area */}
        <div className="agent-input-area">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".pdf,.txt,.png,.jpg,.jpeg,.gif,.webp"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button className="agent-attach-btn" type="button" onClick={() => fileInputRef.current?.click()} aria-label="上传文件">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <textarea
            className="agent-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="输入消息或粘贴简历内容…"
            rows={1}
          />
          <button className="agent-send-btn" type="button" onClick={handleSend} aria-label="发送">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Agent
