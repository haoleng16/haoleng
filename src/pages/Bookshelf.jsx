import { useState, Suspense } from 'react'
import { shelfBooks } from '../data/books'
import BookShelf3D from '../components/BookShelf3D'
import BookReader from '../components/BookReader'
import PortfolioChrome from '../components/PortfolioChrome'

function Bookshelf() {
  const [activeBook, setActiveBook] = useState(null)

  return (
    <div className="bookshelf-3d-page">
      <PortfolioChrome />
      {!activeBook ? (
        <>
          <header className="bookshelf-head">
            <p className="bookshelf-eyebrow">Library</p>
            <h1 className="bookshelf-title">书架</h1>
            <p className="bookshelf-sub">
              记录阅读历程。把值得反复翻看的内容留在书架上。
            </p>
          </header>

          <Suspense fallback={<div className="bookshelf-loading">加载中…</div>}>
            <BookShelf3D books={shelfBooks} onOpenBook={setActiveBook} />
          </Suspense>

          <footer className="bookshelf-foot">
            拖拽滑动 · 悬停查看 · 点击翻开
          </footer>
        </>
      ) : (
        <Suspense fallback={<div className="bookshelf-loading">加载中…</div>}>
          <BookReader book={activeBook} onClose={() => setActiveBook(null)} />
        </Suspense>
      )}
    </div>
  )
}

export default Bookshelf
