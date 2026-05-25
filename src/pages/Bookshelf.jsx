function Bookshelf() {
  const assetBase = import.meta.env.BASE_URL
  const pdfPath = `${assetBase}bookshelf/copywriting-training-handbook.pdf`

  return (
    <section className="bookshelf-page">
      <div className="bookshelf-panel">
        <p className="eyebrow">Bookshelf</p>
        <h1>书架</h1>
        <p>
          这里会收纳 HaoLeng 的阅读记录、学习资料和长期想反复翻看的内容。
        </p>
      </div>

      <article className="book-detail-card">
        <div className="book-detail-info">
          <div>
            <p className="eyebrow">PDF Manual</p>
            <h2>文案训练手册</h2>
            <p>
              一份适合放进书架长期阅读的文案训练资料，支持跳转在线阅读，也可以下载 PDF。
            </p>
          </div>

          <div className="book-meta">
            <span>PDF</span>
            <span>4.3 MB</span>
            <span>在线阅读</span>
          </div>

          <div className="book-actions">
            <a className="primary-pill" href={pdfPath} target="_blank" rel="noreferrer">
              在线阅读
            </a>
            <a className="secondary-pill" href={pdfPath} download>
              下载 PDF
            </a>
          </div>
        </div>

        <div className="pdf-reader" aria-label="文案训练手册在线预览">
          <iframe title="文案训练手册 PDF 预览" src={pdfPath}></iframe>
        </div>
      </article>
    </section>
  )
}

export default Bookshelf
