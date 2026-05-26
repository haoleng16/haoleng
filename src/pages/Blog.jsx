import ReactMarkdown from 'react-markdown'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import { fetchPostList } from '../services/githubApi'

function extractHeadings(content) {
  const lines = content.split('\n')
  const headings = []
  for (const line of lines) {
    const match = line.match(/^(#{1,3})\s+(.+)/)
    if (match) {
      const level = match[1].length
      const text = match[2].replace(/[*_`~]/g, '').trim()
      const id = text
        .toLowerCase()
        .replace(/[^\w\u4e00-\u9fff]+/g, '-')
        .replace(/^-|-$/g, '')
      headings.push({ level, text, id })
    }
  }
  return headings
}

function Blog() {
  const [blogCategories, setBlogCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedPost, setSelectedPost] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [showList, setShowList] = useState(false)
  const contentRef = useRef(null)
  const articleRef = useRef(null)
  const [activeHeading, setActiveHeading] = useState('')

  const allPosts = useMemo(
    () => blogCategories.flatMap(cat => cat.posts.map(p => ({ post: p, category: cat }))),
    [blogCategories],
  )

  const loadPosts = useCallback(() => {
    setLoading(true)
    setError(null)
    fetchPostList()
      .then(categories => {
        setBlogCategories(categories)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    loadPosts()
  }, [loadPosts])

  useEffect(() => {
    if (allPosts.length > 0 && !selectedPost) {
      setSelectedPost(allPosts[0].post)
      setSelectedCategory(allPosts[0].category)
    }
  }, [allPosts, selectedPost])

  const headings = useMemo(
    () => (selectedPost ? extractHeadings(selectedPost.content) : []),
    [selectedPost],
  )

  useEffect(() => {
    if (!articleRef.current) return
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveHeading(entry.target.id)
          }
        }
      },
      { rootMargin: '-80px 0px -60% 0px', root: contentRef.current },
    )
    const elements = articleRef.current.querySelectorAll('h1[id], h2[id], h3[id]')
    elements.forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [selectedPost])

  function selectPost(post, category) {
    setSelectedPost(post)
    setSelectedCategory(category)
    setShowList(false)
    setActiveHeading('')
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function scrollToHeading(id) {
    const el = document.getElementById(id)
    if (el && contentRef.current) {
      contentRef.current.scrollTo({
        top: el.offsetTop - 80,
        behavior: 'smooth',
      })
    }
  }

  function getPrevPost() {
    if (!selectedPost) return null
    const idx = allPosts.findIndex(item => item.post.id === selectedPost.id)
    return idx > 0 ? allPosts[idx - 1] : null
  }

  function getNextPost() {
    if (!selectedPost) return null
    const idx = allPosts.findIndex(item => item.post.id === selectedPost.id)
    return idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  }

  if (loading) {
    return (
      <div className="blog-layout">
        <div className="blog-loading">
          <div className="blog-loading-spinner"></div>
          <p>加载中...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="blog-layout">
        <div className="blog-error">
          <span className="empty-icon">⚠️</span>
          <p>博客加载失败: {error}</p>
          <button className="blog-retry-btn" onClick={loadPosts}>重试</button>
        </div>
      </div>
    )
  }

  return (
    <div className="blog-layout">
      {/* Back link / List toggle */}
      <button className="blog-back-btn" onClick={() => setShowList(!showList)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        {showList ? '返回文章' : '博文列表'}
      </button>

      {/* Article list overlay */}
      {showList && (
        <div className="blog-list-panel">
          {blogCategories.map(category => (
            <div key={category.name} className="blog-list-category">
              <div className="blog-list-category-header">
                <span>{category.icon}</span>
                <span>{category.name}</span>
              </div>
              {category.posts.map(post => (
                <button
                  key={post.id}
                  className={`blog-list-item ${selectedPost?.id === post.id ? 'active' : ''}`}
                  onClick={() => selectPost(post, category)}
                >
                  {post.title}
                </button>
              ))}
            </div>
          ))}
        </div>
      )}

      <div className="blog-content-wrapper">
        {/* Main content */}
        <main className="blog-main" ref={contentRef}>
          {selectedPost ? (
            <>
              {/* Article header */}
              <header className="blog-article-header">
                <div className="blog-article-meta">
                  <span className="blog-meta-category">{selectedCategory?.icon} {selectedCategory?.name}</span>
                </div>
                <h1 className="blog-article-title">{selectedPost.title}</h1>
              </header>

              {/* Article */}
              <article className="blog-article" ref={articleRef}>
                <ReactMarkdown
                  components={{
                    h1: ({ children }) => {
                      const text = String(children)
                      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
                      return <h1 className="article-h1" id={id}>{children}</h1>
                    },
                    h2: ({ children }) => {
                      const text = String(children)
                      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
                      return <h2 className="article-h2" id={id}>{children}</h2>
                    },
                    h3: ({ children }) => {
                      const text = String(children)
                      const id = text.toLowerCase().replace(/[^\w\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '')
                      return <h3 className="article-h3" id={id}>{children}</h3>
                    },
                    hr: () => <hr className="article-divider" />,
                    code: ({ inline, className, children, ...props }) => {
                      if (inline) {
                        return <code className="inline-code" {...props}>{children}</code>
                      }
                      return (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    },
                    pre: ({ children }) => (
                      <pre className="code-block">{children}</pre>
                    ),
                    blockquote: ({ children }) => (
                      <blockquote className="article-blockquote">{children}</blockquote>
                    ),
                    ul: ({ children }) => (
                      <ul className="article-list">{children}</ul>
                    ),
                    li: ({ children }) => (
                      <li className="article-list-item">{children}</li>
                    ),
                    table: ({ children }) => (
                      <div className="table-wrapper">
                        <table className="article-table">{children}</table>
                      </div>
                    ),
                  }}
                >
                  {selectedPost.content}
                </ReactMarkdown>
              </article>

              {/* Prev/Next navigation */}
              <nav className="blog-pagination">
                {getPrevPost() && (
                  <button
                    className="pagination-btn pagination-prev"
                    onClick={() => selectPost(getPrevPost().post, getPrevPost().category)}
                  >
                    <span className="pagination-label">← 上一篇</span>
                    <span className="pagination-title">{getPrevPost().post.title}</span>
                  </button>
                )}
                {getNextPost() && (
                  <button
                    className="pagination-btn pagination-next"
                    onClick={() => selectPost(getNextPost().post, getNextPost().category)}
                  >
                    <span className="pagination-label">下一篇 →</span>
                    <span className="pagination-title">{getNextPost().post.title}</span>
                  </button>
                )}
              </nav>
            </>
          ) : (
            <div className="blog-empty">
              <span className="empty-icon">📖</span>
              <p>暂无文章</p>
            </div>
          )}
        </main>

        {/* Right-side TOC */}
        {selectedPost && headings.length > 0 && (
          <aside className="blog-toc">
            <div className="blog-toc-title">目录</div>
            <nav className="blog-toc-nav">
              {headings.map(h => (
                <button
                  key={h.id}
                  className={`blog-toc-item blog-toc-level-${h.level} ${activeHeading === h.id ? 'active' : ''}`}
                  onClick={() => scrollToHeading(h.id)}
                >
                  {h.text}
                </button>
              ))}
            </nav>
          </aside>
        )}
      </div>
    </div>
  )
}

export default Blog
