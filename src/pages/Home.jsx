import { Link } from 'react-router-dom'

const featureCards = [
  {
    title: '最新博文',
    text: '整理 React、CSS、效率工具和学习过程中的关键笔记。',
    href: '/blog',
    action: '进入博客',
  },
  {
    title: '书架',
    text: '记录值得长期保存的书、课程和参考资料。',
    href: '/bookshelf',
    action: '查看书架',
  },
  {
    title: '学习记录',
    text: '把零散的练习沉淀成可以复盘的成长轨迹。',
    href: null,
    action: '持续更新',
  },
]

function Home() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <p className="eyebrow">Personal Study Space</p>
        <h1>
          你好，我是 <span>HaoLeng</span>
        </h1>
        <p className="hero-copy">
          记录学习历程、阅读书架与技术思考，把每天的小进步整理成清爽、耐看的知识空间。
        </p>
        <div className="hero-actions">
          <Link className="primary-pill" to="/blog">
            阅读博文
          </Link>
          <Link className="secondary-pill" to="/bookshelf">
            查看书架
          </Link>
        </div>
      </div>

      <div className="home-cards" aria-label="首页入口">
        {featureCards.map((card) => {
          const content = (
            <>
              <div>
                <h2>{card.title}</h2>
                <p>{card.text}</p>
              </div>
              <span>{card.action}</span>
            </>
          )

          if (card.href) {
            return (
              <Link className="home-card" to={card.href} key={card.title}>
                {content}
              </Link>
            )
          }

          return (
            <article className="home-card home-card--static" key={card.title}>
              {content}
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default Home
