import { useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789アイウエオカキクケコサシスセソタチツテト'

function CodeRain() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let frameId

    function resize() {
      canvas.width = canvas.parentElement.offsetWidth
      canvas.height = canvas.parentElement.offsetHeight
    }

    resize()
    window.addEventListener('resize', resize)

    const fontSize = 15
    const columns = Math.floor(canvas.width / fontSize)
    const drops = Array.from({ length: columns }, () => Math.random() * -40)

    function getThemeColors() {
      const theme = document.documentElement.getAttribute('data-theme') || 'light'
      if (theme === 'dark') return { char: 'rgba(41,151,255,0.28)', trail: 'rgba(11,11,15,0.06)' }
      if (theme === 'warm') return { char: 'rgba(196,122,42,0.22)', trail: 'rgba(250,246,241,0.06)' }
      return { char: 'rgba(0,113,227,0.2)', trail: 'rgba(245,245,247,0.06)' }
    }

    function draw() {
      const { char, trail } = getThemeColors()
      ctx.fillStyle = trail
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.font = `${fontSize}px ui-monospace, monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = CHARS[Math.floor(Math.random() * CHARS.length)]
        ctx.fillStyle = char
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i] += 0.4 + Math.random() * 0.4
      }

      frameId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(frameId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return <canvas ref={canvasRef} className="code-rain-canvas" aria-hidden="true" />
}

const techStack = [
  { name: 'React', icon: '⚛️', level: 85, desc: '核心前端框架，熟练掌握 Hooks 和路由' },
  { name: 'TypeScript', icon: '🔷', level: 75, desc: '类型安全的 JavaScript 超集' },
  { name: 'Python', icon: '🐍', level: 80, desc: '后端开发与数据处理' },
  { name: 'Next.js', icon: '▲', level: 70, desc: 'React 全栈框架，SSR/SSG' },
  { name: 'Tailwind', icon: '🎨', level: 78, desc: '实用优先的 CSS 框架' },
  { name: 'Three.js', icon: '🧊', level: 55, desc: 'WebGL 3D 图形库' },
  { name: 'Docker', icon: '🐳', level: 72, desc: '容器化部署与微服务' },
  { name: 'PostgreSQL', icon: '🐘', level: 68, desc: '关系型数据库' },
  { name: 'Redis', icon: '🔴', level: 62, desc: '内存缓存与消息队列' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
}

function Home() {
  return (
    <section className="home-page">
      <div className="home-hero">
        <CodeRain />
        <div className="hero-content">
          <motion.p className="eyebrow" initial="hidden" animate="visible" variants={fadeUp}>
            Personal Study Space
          </motion.p>
          <motion.h1
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
          >
            你好，我是 <span className="neon-name">HaoLeng</span>
          </motion.h1>
          <motion.p
            className="hero-copy"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={2}
          >
            记录学习历程、阅读书架与技术思考，把每天的小进步整理成清爽、耐看的知识空间。
          </motion.p>
          <motion.div
            className="hero-actions"
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={3}
          >
            <Link className="primary-pill" to="/blog">
              阅读博文
            </Link>
            <Link className="secondary-pill" to="/bookshelf">
              查看书架
            </Link>
          </motion.div>
        </div>
      </div>

      <motion.section
        className="tech-stack-section"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.h2 className="tech-stack-title" variants={fadeUp}>
          技术栈
        </motion.h2>
        <div className="tech-stack-wall">
          {techStack.map((tech, i) => (
            <motion.div
              key={tech.name}
              className="tech-badge"
              variants={fadeUp}
              custom={i}
              whileHover={{ scale: 1.12 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <span className="tech-badge-icon">{tech.icon}</span>
              <span className="tech-badge-name">{tech.name}</span>
              <div className="tech-tooltip">
                <strong>{tech.name}</strong>
                <div className="tech-level-bar">
                  <div className="tech-level-fill" style={{ width: `${tech.level}%` }} />
                </div>
                <span className="tech-level-text">掌握程度 {tech.level}%</span>
                <p>{tech.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.section>
    </section>
  )
}

export default Home
