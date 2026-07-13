import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import CircularGallery from '../components/CircularGallery'
import PortfolioChrome from '../components/PortfolioChrome'

function GithubIcon({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .5C5.37.5 0 5.78 0 12.29c0 5.21 3.44 9.63 8.21 11.19.6.11.82-.25.82-.56 0-.28-.01-1.02-.02-2-3.34.71-4.04-1.58-4.04-1.58-.55-1.37-1.34-1.74-1.34-1.74-1.09-.74.08-.72.08-.72 1.2.08 1.84 1.21 1.84 1.21 1.07 1.8 2.81 1.28 3.5.98.11-.76.42-1.28.76-1.57-2.67-.3-5.47-1.31-5.47-5.84 0-1.29.47-2.34 1.24-3.17-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.21a11.6 11.6 0 0 1 3-.4c1.02 0 2.05.14 3 .4 2.29-1.53 3.3-1.21 3.3-1.21.66 1.66.24 2.88.12 3.18.77.83 1.24 1.88 1.24 3.17 0 4.54-2.81 5.54-5.49 5.83.43.36.81 1.09.81 2.2 0 1.59-.01 2.87-.01 3.26 0 .31.22.68.83.56A12.01 12.01 0 0 0 24 12.29C24 5.78 18.63.5 12 .5z" />
    </svg>
  )
}

const CONTACT_EMAIL = 'linhe8798@gmail.com'

// Project card images — drop real files into src/assets/projects/ and import them.
import geekImg from '../assets/projects/geek.webp'
import enterpriseRagImg from '../assets/projects/enterprise-rag.webp'
import labelServerImg from '../assets/projects/label-server.webp'
import portraitImg from '../assets/projects/portrait.webp'

const PHONE = '13724573756'
const BIRTH_DATE = new Date(2004, 7, 16) // 2004-08-16 (months are 0-indexed)

function calcAge(birth) {
  const now = new Date()
  let age = now.getFullYear() - birth.getFullYear()
  const m = now.getMonth() - birth.getMonth()
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) {
    age--
  }
  return age
}

const projects = [
  {
    name: 'geek',
    href: 'https://github.com/haoleng16/geek',
    image: geekImg,
  },
  {
    name: 'Enterprise_RAG',
    href: 'https://github.com/haoleng16/Enterprise_RAG',
    image: enterpriseRagImg,
  },
  {
    name: 'label_server',
    href: 'https://github.com/haoleng16/label_server',
    image: labelServerImg,
  },
]

const experiences = [
  {
    period: '2022.09 - 2026.06',
    org: '广州城市理工学院',
    role: '本科',
  },
  {
    period: '2025.07 - 2026.01',
    org: '广州经元科技有限公司',
    role: 'AI应用开发工程师',
  },
  {
    period: '2026.01 - 2026.07',
    org: '深圳巨石峰科技有限公司',
    role: 'AI应用开发工程师',
  },
]

const aboutTabs = [
  { id: 'about', label: 'ABOUT ME' },
  { id: 'stack', label: '技术栈' },
  { id: 'strengths', label: '个人优势' },
]

const techStack = [
  { name: 'LangChain', href: 'https://www.langchain.com/' },
  { name: 'LangGraph', href: 'https://www.langchain.com/langgraph' },
  { name: 'React', href: 'https://react.dev/' },
  { name: 'RAG', href: 'https://python.langchain.com/docs/tutorials/rag/' },
  { name: 'Electron', href: 'https://www.electronjs.org/' },
  { name: 'FastAPI', href: 'https://fastapi.tiangolo.com/' },
  { name: 'LoRA', href: 'https://github.com/microsoft/LoRA' },
  { name: 'Docker', href: 'https://www.docker.com/' },
]

const strengths = [
  '熟悉使用 LangChain、LangGraph、CrewAI构建多节点 Agent、状态流转及复杂业务流程。',
  '熟悉 RAG 检索增强生成技术，具备文档解析、文本切块、Embedding、向量检索、关键词检索、召回及重排序等相关开发经验。',
  '熟悉大模型 Function Calling、Prompt Engineering 等应用开发方式，能够结合业务场景完成模型调用、工具编排及结构化输出。',
  '熟悉 MCP、Skills、Plugin 等 AI 工具扩展方式，具备相关工具封装、接入及实际使用经验。',
  '熟悉FastAPI后端开发，能够完成 RESTful API、异步接口及大模型应用后端服务的开发与集成。',
  '熟悉 Requests、Playwright、Puppeteer等爬虫工具，具备浏览器自动化、网页数据采集及自动化流程开发经验',
]

function Home() {
  const [activeAboutTab, setActiveAboutTab] = useState('about')

  return (
    <div className="relative w-full bg-black font-inter text-white">
      <PortfolioChrome />

      {/* ===== Hero main content (vertically centered, left-aligned) ===== */}
      <main
        id="top"
        className="relative z-10 flex min-h-[100svh] flex-col justify-center px-6 sm:px-10 lg:px-16"
      >
        <div className="max-w-3xl">
          {/* Main heading — three lines with size/weight hierarchy */}
          <h1
            className="animate-fade-up font-podium text-white"
            style={{ animationDelay: '0.2s', lineHeight: 0.95 }}
          >
            <span
              className="block font-light tracking-[0.04em] text-white/55"
              style={{ fontSize: 'clamp(1.4rem, 3.2vw, 2.4rem)', marginBottom: '0.35em' }}
            >
              This is
            </span>
            <span
              className="block font-extrabold tracking-[-0.02em]"
              style={{ fontSize: 'clamp(4rem, 12vw, 9.5rem)', lineHeight: 0.88 }}
            >
              HELIN
            </span>
            <span
              className="block font-medium italic tracking-wide text-white/90"
              style={{ fontSize: 'clamp(1.8rem, 4.5vw, 3.2rem)', marginTop: '0.25em' }}
            >
              vite
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="animate-fade-up mt-8 max-w-md font-inter text-base leading-relaxed text-white/70 lg:mt-12"
            style={{ animationDelay: '0.4s' }}
          >
            Progress, not perfection.
          </p>

          {/* CTA row */}
          <div
            className="animate-fade-up mt-8 flex flex-wrap items-center gap-4 sm:gap-6 lg:mt-10"
            style={{ animationDelay: '0.6s' }}
          >
            <a
              href="#about"
              className="btn-glow group inline-flex items-center gap-2 rounded-full bg-black px-5 py-3 text-xs uppercase tracking-widest text-white transition-colors duration-200 hover:bg-neutral-900 sm:px-7 sm:py-4"
            >
              ABOUT ME
              <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href="https://github.com/haoleng16"
              target="_blank"
              rel="noreferrer"
              className="btn-glow hidden items-center gap-2 rounded-full border border-white/10 px-4 py-2 sm:flex"
            >
              <GithubIcon className="h-6 w-6 text-white/50" />
              <span className="font-inter text-xs uppercase tracking-wide text-white/60">
                More on GitHub
              </span>
            </a>
          </div>

          {/* Work link — below the CTA row, left-aligned */}
          <a
            href="#projects"
            className="btn-glow animate-fade-up mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2"
            style={{ animationDelay: '0.8s' }}
          >
            <ArrowUpRight className="h-6 w-6 text-white/50" />
            <span className="font-inter text-xs uppercase tracking-wide text-white/60">
              SEE MY WORK
            </span>
          </a>
        </div>
      </main>

      {/* ===== About Me — above the project showcase ===== */}
      <section
        id="about"
        className="relative z-10 px-6 pt-10 pb-16 sm:px-10 lg:px-16"
      >
        <div className="w-full max-w-4xl">
          <div className="flex flex-col items-center gap-12 p-8 sm:p-10 md:flex-row md:items-start md:gap-16">
          {/* Left — portrait */}
          <div className="flex shrink-0 flex-col items-center gap-5">
            <div className="h-56 w-56 overflow-hidden rounded-full ring-2 ring-white/15 sm:h-64 sm:w-64">
              <img
                src={portraitImg}
                alt="何林 证件照"
                loading="lazy"
                decoding="async"
                className="h-full w-full object-cover"
              />
            </div>
            <h2 className="font-podium text-3xl uppercase tracking-wide text-white sm:text-4xl">
              He Lin
            </h2>
            <span className="font-inter text-xs uppercase tracking-widest text-white/50">
              何林
            </span>
          </div>

          {/* Right — info card */}
          <div className="w-full rounded-[28px] border border-white/15 bg-transparent p-5 sm:p-7 md:mt-2">
            <nav className="grid grid-cols-3 gap-2 border-b border-white/10 pb-3" aria-label="About sections">
              {aboutTabs.map((tab) => {
                const isActive = activeAboutTab === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveAboutTab(tab.id)}
                    className={[
                      'rounded-full px-3 py-2 text-center font-inter text-[11px] uppercase tracking-widest transition-colors',
                      isActive
                        ? 'bg-white text-black'
                        : 'text-white/45 hover:bg-white/10 hover:text-white',
                    ].join(' ')}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </nav>

            <div className="min-h-[285px] pt-6">
              {activeAboutTab === 'about' && (
                <>
                  <p className="max-w-md font-inter text-base leading-relaxed text-white/75">
                    Developer & builder. Recording the journey of learning, projects,
                    and ongoing experiments.
                  </p>

                  {(() => {
                    const fields = [
                      { label: 'Age', value: String(calcAge(BIRTH_DATE)) },
                      { label: 'Phone', value: PHONE, href: `tel:${PHONE}` },
                      { label: 'Email', value: CONTACT_EMAIL, href: `mailto:${CONTACT_EMAIL}` },
                    ]
                    return (
                      <div className="mt-10 divide-y divide-white/10 border-t border-white/10">
                        {fields.map((field) => {
                          const content = (
                            <div className="group flex items-baseline justify-between gap-4 py-5 transition-colors hover:text-white">
                              <span className="font-inter text-xs uppercase tracking-widest text-white/40">
                                {field.label}
                              </span>
                              <span className="font-inter text-base text-white/85 transition-colors group-hover:text-white sm:text-lg">
                                {field.value}
                              </span>
                            </div>
                          )
                          return field.href ? (
                            <a key={field.label} href={field.href} className="block">
                              {content}
                            </a>
                          ) : (
                            <div key={field.label}>{content}</div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </>
              )}

              {activeAboutTab === 'stack' && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {techStack.map((tech) => (
                    <a
                      key={tech.name}
                      href={tech.href}
                      target="_blank"
                      rel="noreferrer"
                      className="group flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 font-inter transition-colors hover:border-white/25 hover:bg-white/[0.08]"
                    >
                      <span className="text-sm font-medium text-white/85 transition-colors group-hover:text-white">
                        {tech.name}
                      </span>
                      <ArrowUpRight className="h-4 w-4 text-white/35 transition-colors group-hover:text-white/70" />
                    </a>
                  ))}
                </div>
              )}

              {activeAboutTab === 'strengths' && (
                <ul className="space-y-3">
                  {strengths.map((item) => (
                    <li
                      key={item}
                      className="rounded-2xl border border-white/10 bg-white/[0.035] px-4 py-3 font-inter text-sm leading-relaxed text-white/72"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            </div>
          </div>
        </div>

        {/* Experience — full-width, below the portrait + info row */}
        <div className="mt-10 w-full max-w-4xl">
          <p className="font-inter text-xs uppercase tracking-widest text-white/40">
            经历
          </p>
          <ol className="mt-4 flex flex-wrap gap-x-8 gap-y-5 border-t border-white/10 pt-5">
            {experiences.map((exp) => (
              <li key={exp.org} className="min-w-[150px] flex-1">
                <time className="font-inter text-[11px] tracking-wide text-white/45">
                  {exp.period}
                </time>
                <h3 className="mt-1 font-inter text-sm font-semibold text-white">
                  {exp.org}
                </h3>
                <p className="mt-0.5 font-inter text-xs text-white/60">
                  {exp.role}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ===== Project showcase — below the fold, video shows through ===== */}
      <ProjectShowcase />
    </div>
  )
}

function ProjectShowcase() {
  // Map projects into the { image, text } shape CircularGallery expects.
  const galleryItems = projects.map((p) => ({
    image: p.image,
    text: p.name,
  }))

  return (
    <section
      id="projects"
      className="relative z-10 px-0 py-24 sm:px-0 lg:px-0"
    >
      <div className="px-6 sm:px-10 lg:px-16">
        <h2
          className="animate-fade-up font-podium text-white"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)', lineHeight: 0.95 }}
        >
          Project
        </h2>
      </div>

      {/* CircularGallery needs an explicit-height container */}
      <div
        className="animate-fade-up relative mt-10 h-[600px] w-full lg:mt-14"
        style={{ animationDelay: '0.2s' }}
      >
        <CircularGallery
          items={galleryItems}
          bend={3}
          textColor="#ffffff"
          borderRadius={0.05}
          scrollEase={0.05}
          autoScroll={true}
          autoSpeed={0.5}
        />
      </div>

      {/* Clickable project links — the 3D gallery is a canvas (no real <a>
          elements), so real navigation lives here. */}
      <div className="px-6 sm:px-10 lg:px-16 mt-10 flex flex-wrap gap-3">
        {projects.map((p) => (
          <a
            key={p.name}
            href={p.href}
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-white/15 bg-transparent px-5 py-2.5 font-inter text-xs uppercase tracking-widest text-white/70 transition-all duration-200 hover:border-white/40 hover:text-white"
          >
            {p.name}
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        ))}
      </div>
    </section>
  )
}

export default Home
