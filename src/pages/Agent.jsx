import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'
import logoImg from '../assets/haoleng_logo_vector.svg'

const BACKEND_URL = 'http://127.0.0.1:8080/api/agent/chat'

const MODELS = {
  fast: 'deepseek-v4-flash',
  pro: 'deepseek-v4-pro',
}

const SUGGESTIONS = [
  { label: '分析我的简历', desc: '上传简历，获取优化建议' },
  { label: '润色工作经历', desc: '让描述更加专业有吸引力' },
  { label: '匹配岗位要求', desc: '对比 JD，突出相关经验' },
  { label: '模拟面试问题', desc: '基于简历生成可能的面试题' },
]

function createConversation(title) {
  return { id: Date.now(), title, messages: [], time: new Date().toLocaleString('zh-CN') }
}

function Agent() {
  const [conversations, setConversations] = useState([createConversation('新对话')])
  const [activeId, setActiveId] = useState(conversations[0].id)
  const [input, setInput] = useState('')
  const [files, setFiles] = useState([])
  const [model, setModel] = useState('fast')
  const [loading, setLoading] = useState(false)
  const [modelOpen, setModelOpen] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)
  const modelMenuRef = useRef(null)

  const activeConv = conversations.find(c => c.id === activeId) || conversations[0]
  const hasStarted = activeConv.messages.length > 0

  const lastMsg = activeConv.messages[activeConv.messages.length - 1]

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [lastMsg?.content, activeConv.messages.length])

  useEffect(() => {
    if (!modelOpen) return
    function close(e) {
      if (modelMenuRef.current && !modelMenuRef.current.contains(e.target)) setModelOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [modelOpen])

  function updateConversation(id, updater) {
    setConversations(prev => prev.map(c => (c.id === id ? updater(c) : c)))
  }

  const readFilesAsText = useCallback(async (fileList) => {
    const readable = fileList.filter(f => {
      const ext = f.name.split('.').pop().toLowerCase()
      return ['txt', 'pdf'].includes(ext)
    })
    const results = await Promise.all(
      readable.map(f => f.text().then(t => `[${f.name}]\n${t}`))
    )
    return results.join('\n\n')
  }, [])

  const callBackend = useCallback(async (messages, selectedModel) => {
    const res = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, model: MODELS[selectedModel] }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`请求失败 (${res.status}): ${err}`)
    }

    return res.body
  }, [])

  async function handleSend(suggestionText) {
    const text = (suggestionText || input).trim()
    if (!text && files.length === 0) return
    if (loading) return

    const fileText = await readFilesAsText(files)
    const fileNames = files.map(f => `📎 ${f.name}`).join('  ')
    let userContent = ''
    if (text) userContent += text
    if (fileNames) userContent += (userContent ? '\n' : '') + fileNames
    if (fileText) userContent += (userContent ? '\n\n' : '') + fileText

    const convId = activeId
    const currentModel = model

    setInput('')
    setFiles([])
    setLoading(true)

    updateConversation(convId, c => ({
      ...c,
      messages: [...c.messages, { role: 'user', content: userContent }, { role: 'assistant', content: '' }],
      title: text ? text.slice(0, 25) + (text.length > 25 ? '...' : '') : c.title,
    }))

    try {
      const historyMessages = activeConv.messages
        .filter(m => m.role !== 'assistant' || m.content)
        .map(m => ({ role: m.role, content: m.content }))
      historyMessages.push({ role: 'user', content: userContent })

      const stream = await callBackend(historyMessages, currentModel)
      const reader = stream.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed = JSON.parse(data)
            const delta = parsed.choices?.[0]?.delta?.content
            if (delta) {
              accumulated += delta
              const current = accumulated
              updateConversation(convId, c => {
                const msgs = [...c.messages]
                msgs[msgs.length - 1] = { role: 'assistant', content: current }
                return { ...c, messages: msgs }
              })
            }
          } catch { /* skip malformed chunks */ }
        }
      }

      if (!accumulated) {
        updateConversation(convId, c => {
          const msgs = [...c.messages]
          msgs[msgs.length - 1] = { role: 'assistant', content: '抱歉，未收到有效回复，请重试。' }
          return { ...c, messages: msgs }
        })
      }
    } catch (err) {
      updateConversation(convId, c => {
        const msgs = [...c.messages]
        msgs[msgs.length - 1] = { role: 'assistant', content: `请求出错：${err.message}` }
        return { ...c, messages: msgs }
      })
    } finally {
      setLoading(false)
    }
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
          <span>Recents</span>
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
        {!hasStarted ? (
          /* Welcome screen — ChatGPT style */
          <div className="agent-welcome">
            <div className="agent-welcome-inner">
              <img src={logoImg} alt="logo" className="agent-welcome-logo" />
              <h1 className="agent-welcome-title">有什么可以帮你的？</h1>
              <div className="agent-welcome-suggestions">
                {SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    className="agent-suggestion-card"
                    onClick={() => handleSend(s.label)}
                    disabled={loading}
                  >
                    <span className="agent-suggestion-label">{s.label}</span>
                    <span className="agent-suggestion-desc">{s.desc}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Normal chat messages */
          <div className="agent-messages">
            {activeConv.messages.map((msg, i) => (
              <div key={i} className={`agent-bubble agent-bubble--${msg.role}`}>
                <div className="agent-bubble-content">
                  {msg.role === 'assistant' ? (
                    msg.content ? (
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    ) : (
                      <span className="agent-thinking">
                        <span className="agent-thinking-dot"></span>
                        <span className="agent-thinking-dot"></span>
                        <span className="agent-thinking-dot"></span>
                      </span>
                    )
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}

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
          <div className="agent-input-box">
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.txt,.png,.jpg,.jpeg,.gif,.webp"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <div className="agent-input-top">
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
                placeholder="给 DeepSeek 发送消息…"
                rows={1}
              />
            </div>
            <div className="agent-input-bottom">
              <div className="agent-model-dropdown" ref={modelMenuRef}>
                <button
                  type="button"
                  className="agent-model-trigger"
                  onClick={() => setModelOpen(o => !o)}
                >
                  {model === 'fast' ? 'Flash' : 'Pro'}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                </button>
                {modelOpen && (
                  <div className="agent-model-menu">
                    <button type="button" className="agent-model-option" onClick={() => { setModel(model === 'fast' ? 'pro' : 'fast'); setModelOpen(false) }}>
                      {model === 'fast' ? 'Pro' : 'Flash'}
                    </button>
                  </div>
                )}
              </div>
              <button className="agent-send-btn" type="button" onClick={() => handleSend()} disabled={loading} aria-label="发送">
                {loading ? (
                  <span className="agent-loading-dot">●</span>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3.478 2.404a.75.75 0 00-.926.941l2.432 7.905H13.5a.75.75 0 010 1.5H4.984l-2.432 7.905a.75.75 0 00.926.94 60.519 60.519 0 0018.445-8.986.75.75 0 000-1.218A60.517 60.517 0 003.478 2.404z" /></svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Agent
