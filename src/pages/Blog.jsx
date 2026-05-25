import ReactMarkdown from 'react-markdown'
import { useState, useRef } from 'react'
import { blogCategories } from '../posts/blogData'

const initialCategory = blogCategories[0] ?? null
const initialPost = initialCategory?.posts[0] ?? null

function Blog() {
  const [selectedPost, setSelectedPost] = useState(initialPost)
  const [selectedCategory, setSelectedCategory] = useState(
    initialPost ? initialCategory : null,
  )
  const [expandedCategories, setExpandedCategories] = useState(() =>
    initialCategory ? { [initialCategory.name]: true } : {},
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const contentRef = useRef(null)

  function toggleCategory(categoryName) {
    setExpandedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }))
  }

  function selectPost(post, category) {
    setSelectedPost(post)
    setSelectedCategory(category)
    setSidebarOpen(false)
    if (contentRef.current) {
      contentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="blog-layout">
      {/* Mobile toggle button */}
      <button
        className="blog-mobile-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <span className={`hamburger ${sidebarOpen ? 'open' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </span>
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="blog-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`blog-sidebar ${sidebarOpen ? 'blog-sidebar--open' : ''}`}>
        <div className="blog-sidebar-header">
          <span className="blog-sidebar-title">📚 文档目录</span>
        </div>
        <nav className="blog-sidebar-nav">
          {blogCategories.map((category) => (
            <div key={category.name} className="blog-sidebar-category">
              <button
                className={`blog-sidebar-category-btn ${
                  selectedCategory?.name === category.name ? 'active' : ''
                }`}
                onClick={() => toggleCategory(category.name)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span
                  className={`category-arrow ${
                    expandedCategories[category.name] ? 'expanded' : ''
                  }`}
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M4.5 2.5L8 6L4.5 9.5"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </button>
              <div
                className={`blog-sidebar-posts ${
                  expandedCategories[category.name] ? 'expanded' : ''
                }`}
              >
                {category.posts.map((post) => (
                  <button
                    key={post.id}
                    className={`blog-sidebar-item ${
                      selectedPost?.id === post.id ? 'active' : ''
                    }`}
                    onClick={() => selectPost(post, category)}
                  >
                    <span className="item-indicator"></span>
                    <span className="item-title">{post.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="blog-main" ref={contentRef}>
        {selectedPost ? (
          <>
            {/* Breadcrumb */}
            <div className="blog-breadcrumb">
              <span className="breadcrumb-home">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 19v-5h4v5c0 .55.45 1 1 1h3c.55 0 1-.45 1-1v-7h1.7c.46 0 .68-.57.33-.87L12.67 3.6c-.38-.34-.96-.34-1.34 0l-8.36 7.53c-.34.3-.13.87.33.87H5v7c0 .55.45 1 1 1h3c.55 0 1-.45 1-1z" />
                </svg>
              </span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-category">{selectedCategory?.name}</span>
              <span className="breadcrumb-sep">/</span>
              <span className="breadcrumb-current">{selectedPost.title}</span>
            </div>

            {/* Article */}
            <article className="blog-article">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => <h1 className="article-h1">{children}</h1>,
                  h2: ({ children }) => <h2 className="article-h2">{children}</h2>,
                  h3: ({ children }) => <h3 className="article-h3">{children}</h3>,
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

            {/* Pagination */}
            <nav className="blog-pagination">
              {getPrevPost() && (
                <button
                  className="pagination-btn pagination-prev"
                  onClick={() => selectPost(getPrevPost().post, getPrevPost().category)}
                >
                  <span className="pagination-label">上一篇</span>
                  <span className="pagination-title">{getPrevPost().post.title}</span>
                </button>
              )}
              {getNextPost() && (
                <button
                  className="pagination-btn pagination-next"
                  onClick={() => selectPost(getNextPost().post, getNextPost().category)}
                >
                  <span className="pagination-label">下一篇</span>
                  <span className="pagination-title">{getNextPost().post.title}</span>
                </button>
              )}
            </nav>
          </>
        ) : (
          <div className="blog-empty">
            <span className="empty-icon">📖</span>
            <p>请从左侧目录选择一篇文章</p>
          </div>
        )}
      </main>
    </div>
  )

  function getPrevPost() {
    if (!selectedPost) return null
    const allPosts = blogCategories.flatMap(cat =>
      cat.posts.map(p => ({ post: p, category: cat }))
    )
    const idx = allPosts.findIndex(item => item.post.id === selectedPost.id)
    return idx > 0 ? allPosts[idx - 1] : null
  }

  function getNextPost() {
    if (!selectedPost) return null
    const allPosts = blogCategories.flatMap(cat =>
      cat.posts.map(p => ({ post: p, category: cat }))
    )
    const idx = allPosts.findIndex(item => item.post.id === selectedPost.id)
    return idx < allPosts.length - 1 ? allPosts[idx + 1] : null
  }
}

export default Blog
