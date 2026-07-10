import { readFileSync } from 'node:fs'

const source = readFileSync(new URL('../src/pages/Home.jsx', import.meta.url), 'utf8')
const requiredContent = [
  'https://github.com/haoleng16',
  'https://github.com/haoleng16/label_server',
  'https://github.com/haoleng16/geek',
  'https://github.com/haoleng16/Enterprise_RAG',
  'id="about"',
  'id="projects"',
]

const missing = requiredContent.filter((item) => !source.includes(item))
const aboutIsPrimary = /<a[\s\S]*?href="#about"[\s\S]*?>\s*ABOUT ME[\s\S]*?<\/a>/.test(source)
const workIsSecondary = /<a[\s\S]*?href="#projects"[\s\S]*?>[\s\S]*?SEE MY WORK[\s\S]*?<\/a>/.test(source)
const aboutCardTabs = [
  "label: 'ABOUT ME'",
  "label: '技术栈'",
  "label: '个人优势'",
].every((item) => source.includes(item))
const aboutCardHasNavigation = source.includes('const aboutTabs = [') && source.includes('activeAboutTab')
const techStackContent = [
  'LangChain',
  'LangGraph',
  'React',
  'RAG',
  'Electron',
  'FastAPI',
  'LoRA',
  'Docker',
  'https://www.langchain.com/',
  'https://www.langchain.com/langgraph',
  'https://react.dev/',
  'https://python.langchain.com/docs/tutorials/rag/',
  'https://www.electronjs.org/',
  'https://fastapi.tiangolo.com/',
  'https://github.com/microsoft/LoRA',
  'https://www.docker.com/',
].every((item) => source.includes(item))
const playwrightRemovedFromTechStack =
  !source.includes("{ name: 'Playwright'") && !source.includes('https://playwright.dev/')
const strengthsContent = [
  '熟悉使用 LangChain、LangGraph、CrewAI构建多节点 Agent、状态流转及复杂业务流程。',
  '熟悉 RAG 检索增强生成技术',
  '熟悉大模型 Function Calling、Prompt Engineering 等应用开发方式',
  '熟悉 MCP、Skills、Plugin 等 AI 工具扩展方式',
  '熟悉FastAPI后端开发',
  '熟悉 Requests、Playwright、Puppeteer等爬虫工具',
].every((item) => source.includes(item))

if (
  missing.length > 0 ||
  !aboutIsPrimary ||
  !workIsSecondary ||
  !aboutCardTabs ||
  !aboutCardHasNavigation ||
  !techStackContent ||
  !playwrightRemovedFromTechStack ||
  !strengthsContent
) {
  console.error(`Homepage content contract failed:\n${missing.join('\n')}`)
  if (!aboutIsPrimary) console.error('Expected ABOUT ME to be the primary Hero CTA.')
  if (!workIsSecondary) console.error('Expected SEE MY WORK to be the lower secondary CTA.')
  if (!aboutCardTabs) console.error('Expected ABOUT ME, 技术栈, and 个人优势 in the About card navigation.')
  if (!aboutCardHasNavigation) console.error('Expected the About section to expose card navigation state.')
  if (!techStackContent) console.error('Expected the technical stack tab to include all requested linked technologies.')
  if (!playwrightRemovedFromTechStack) console.error('Expected Playwright to be removed from the technical stack tab.')
  if (!strengthsContent) console.error('Expected the strengths tab to include the requested strengths.')
  process.exit(1)
}

console.log('Homepage content contract passed.')
