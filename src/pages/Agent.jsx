import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useCallback } from 'react'

const API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY
const MODEL = import.meta.env.VITE_DEEPSEEK_MODEL || 'deepseek-v4-flash'
const API_URL = 'https://api.deepseek.com/chat/completions'

const SYSTEM_PROMPT = '你是一位专业的简历分析助手。你的任务是：\n1. 分析用户提交的简历内容\n2. 指出简历中的优点和不足\n3. 提出具体的改进建议\n4. 帮助优化简历的措辞和结构\n5. 根据目标岗位给出针对性的修改建议\n请用中文回复，语气专业但友好。'

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

  const [loading, setLoading] = useState(false)

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

  const callDeepSeek = useCallback(async (messages) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages],
        stream: true,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`API 请求失败 (${res.status}): ${err}`)
    }

    return res.body
  }, [])

  async function handleSend() {
    const text = input.trim()
    if (!text && files.length === 0) return
    if (loading) return

    const fileText = await readFilesAsText(files)
    const fileNames = files.map(f => `📎 ${f.name}`).join('  ')
    let userContent = ''
    if (text) userContent += text
    if (fileNames) userContent += (userContent ? '\n' : '') + fileNames
    if (fileText) userContent += (userContent ? '\n\n' : '') + fileText

    const convId = activeId

    setInput('')
    setFiles([])
    setLoading(true)

    // Add user message + empty assistant placeholder in one update
    updateConversation(convId, c => ({
      ...c,
      messages: [...c.messages, { role: 'user', content: userContent }, { role: 'assistant', content: '' }],
      title: c.messages.length <= 1 && text ? text.slice(0, 20) + (text.length > 20 ? '...' : '') : c.title,
    }))

    try {
      const historyMessages = activeConv.messages
        .filter(m => m.role !== 'assistant' || m.content)
        .map(m => ({ role: m.role, content: m.content }))
      historyMessages.push({ role: 'user', content: userContent })

      const stream = await callDeepSeek(historyMessages)
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
          <button className="agent-send-btn" type="button" onClick={handleSend} disabled={loading} aria-label="发送">
            {loading ? (
              <span className="agent-loading-dot">●</span>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Agent
