import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  fetchPostList,
  fetchPostContent,
  savePost,
  deletePost,
  isTokenPresent,
} from '../services/githubApi'
import './Admin.css'

function Admin() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [view, setView] = useState('list')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState(null)

  const [editForm, setEditForm] = useState({
    filename: '',
    category: '',
    title: '',
    content: '',
    sha: '',
  })

  const loadPosts = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchPostList()
      .then(categories => {
        const allPosts = categories.flatMap(cat =>
          cat.posts.map(p => ({ ...p, category: cat.name, icon: cat.icon })),
        )
        setPosts(allPosts)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    if (isTokenPresent()) {
      loadPosts()
    } else {
      setLoading(false)
    }
  }, [loadPosts])

  function handleEdit(post) {
    setSaving(true)
    setSaveError(null)
    fetchPostContent(post.filename)
      .then(({ content, sha }) => {
        const category = content.match(/^<!--\s*category:\s*(.+?)\s*-->$/m)
        const title = content.match(/^#\s+(.+)/m)
        setEditForm({
          filename: post.filename,
          category: category ? category[1].trim() : '',
          title: title ? title[1].replace(/[*_`~]/g, '').trim() : '',
          content,
          sha,
        })
        setView('edit')
        setSaving(false)
      })
      .catch(err => {
        setSaveError(err.message)
        setSaving(false)
      })
  }

  function handleNew() {
    setEditForm({
      filename: '',
      category: '',
      title: '',
      content: '',
      sha: '',
    })
    setSaveError(null)
    setView('new')
  }

  function buildContent() {
    const lines = []
    if (editForm.category) {
      lines.push(`<!-- category: ${editForm.category} -->`)
    }
    if (editForm.title) {
      lines.push(`# ${editForm.title}`)
      lines.push('')
    }
    lines.push(editForm.content)
    return lines.join('\n')
  }

  function handleSave() {
    const filename = editForm.filename.endsWith('.md')
      ? editForm.filename
      : `${editForm.filename}.md`
    if (!filename || filename === '.md') {
      setSaveError('请输入文件名')
      return
    }

    setSaving(true)
    setSaveError(null)
    savePost(filename, buildContent(), editForm.sha)
      .then(() => {
        setSaving(false)
        setView('list')
        loadPosts()
      })
      .catch(err => {
        setSaveError(err.message)
        setSaving(false)
      })
  }

  function handleDelete(post) {
    if (!window.confirm(`确定删除「${post.title}」？此操作不可撤销。`)) return

    setSaving(true)
    setSaveError(null)
    deletePost(post.filename, post.sha)
      .then(() => {
        setSaving(false)
        loadPosts()
      })
      .catch(err => {
        setSaveError(err.message)
        setSaving(false)
      })
  }

  if (!isTokenPresent()) {
    return (
      <div className="admin-page">
        <div className="admin-token-notice">
          <h2>未配置 GitHub Token</h2>
          <p>请在项目根目录创建 <code>.env</code> 文件并添加：</p>
          <pre className="admin-token-example">VITE_GITHUB_TOKEN=ghp_你的token</pre>
          <p>重启 dev server 后刷新此页面。</p>
          <p>Token 需要具有 <code>Contents: read/write</code> 权限。</p>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>博文管理</h1>
        <div className="admin-header-actions">
          <Link to="/blog" className="admin-link">查看博客</Link>
          {view === 'list' && (
            <button className="admin-btn-primary" onClick={handleNew}>
              + 新建博文
            </button>
          )}
        </div>
      </header>

      {saveError && (
        <div className="admin-error-bar">
          {saveError}
          <button onClick={() => setSaveError(null)}>✕</button>
        </div>
      )}

      {view === 'list' && (
        <>
          {loading ? (
            <div className="admin-loading">加载中...</div>
          ) : error ? (
            <div className="admin-error">
              <p>加载失败: {error}</p>
              <button className="admin-btn-secondary" onClick={loadPosts}>重试</button>
            </div>
          ) : (
            <div className="admin-post-list">
              {posts.map(post => (
                <div key={post.id} className="admin-post-card">
                  <div className="admin-post-info">
                    <span className="admin-post-icon">{post.icon}</span>
                    <div>
                      <div className="admin-post-title">{post.title}</div>
                      <div className="admin-post-meta">
                        {post.category} · {post.filename}
                      </div>
                    </div>
                  </div>
                  <div className="admin-post-actions">
                    <button
                      className="admin-btn-secondary"
                      onClick={() => handleEdit(post)}
                    >
                      编辑
                    </button>
                    <button
                      className="admin-btn-danger"
                      onClick={() => handleDelete(post)}
                    >
                      删除
                    </button>
                  </div>
                </div>
              ))}
              {posts.length === 0 && (
                <div className="admin-empty">暂无博文，点击上方按钮创建第一篇</div>
              )}
            </div>
          )}
        </>
      )}

      {(view === 'edit' || view === 'new') && (
        <div className="admin-editor">
          <button
            className="admin-btn-back"
            onClick={() => { setView('list'); setSaveError(null); }}
          >
            ← 返回列表
          </button>

          <div className="admin-field-group">
            <label>文件名</label>
            <input
              type="text"
              value={editForm.filename}
              onChange={e => setEditForm(prev => ({ ...prev, filename: e.target.value }))}
              placeholder="example_post.md"
              disabled={view === 'edit'}
              className="admin-input"
            />
          </div>

          <div className="admin-field-row">
            <div className="admin-field-group">
              <label>分类</label>
              <input
                type="text"
                value={editForm.category}
                onChange={e => setEditForm(prev => ({ ...prev, category: e.target.value }))}
                placeholder="例如: 前端技巧"
                className="admin-input"
              />
            </div>
            <div className="admin-field-group">
              <label>标题</label>
              <input
                type="text"
                value={editForm.title}
                onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="文章标题"
                className="admin-input"
              />
            </div>
          </div>

          <div className="admin-field-group">
            <label>内容 (Markdown)</label>
            <textarea
              value={editForm.content}
              onChange={e => setEditForm(prev => ({ ...prev, content: e.target.value }))}
              className="admin-textarea"
              placeholder="在这里写 Markdown 内容..."
            />
          </div>

          <div className="admin-editor-actions">
            <button
              className="admin-btn-secondary"
              onClick={() => { setView('list'); setSaveError(null); }}
            >
              取消
            </button>
            <button
              className="admin-btn-primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? '保存中...' : (view === 'new' ? '创建' : '保存')}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Admin
