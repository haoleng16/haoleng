const OWNER = 'haoleng16'
const REPO = 'haoleng'
const BRANCH = 'main'
const POSTS_PATH = 'src/posts'
const API_BASE = 'https://api.github.com'

function getToken() {
  return import.meta.env.VITE_GITHUB_TOKEN || ''
}

export function isTokenPresent() {
  return !!getToken()
}

async function apiRequest(url, options = {}) {
  const response = await fetch(url, options)
  if (!response.ok) {
    const body = await response.json().catch(() => ({}))
    throw new Error(body.message || `GitHub API error: ${response.status}`)
  }
  return response
}

function authHeaders() {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

function parsePostMetadata(content, filename) {
  const lines = content.split('\n')
  let category = '未分类'
  let title = filename.replace(/\.md$/, '').replace(/_/g, ' ')

  for (const line of lines) {
    const catMatch = line.match(/^<!--\s*category:\s*(.+?)\s*-->$/)
    if (catMatch) {
      category = catMatch[1].trim()
    }
    const titleMatch = line.match(/^#\s+(.+)/)
    if (titleMatch) {
      title = titleMatch[1].replace(/[*_`~]/g, '').trim()
      break
    }
  }

  return { category, title }
}

export async function fetchPostList() {
  const response = await apiRequest(
    `${API_BASE}/repos/${OWNER}/${REPO}/contents/${POSTS_PATH}?ref=${BRANCH}`,
  )
  const entries = await response.json()

  const categories = []

  for (const entry of entries) {
    if (entry.type === 'file' && entry.name.endsWith('.md')) {
      const contentResponse = await fetch(entry.download_url)
      const content = await contentResponse.text()
      const { title } = parsePostMetadata(content, entry.name)
      categories.push({
        name: title,
        icon: '📝',
        posts: [{
          id: entry.name.replace(/\.md$/, ''),
          title,
          content,
          filename: entry.name,
          sha: entry.sha,
        }],
      })
      continue
    }

    if (entry.type !== 'dir') continue

    const dirResponse = await apiRequest(
      `${API_BASE}/repos/${OWNER}/${REPO}/contents/${entry.path}?ref=${BRANCH}`,
    )
    const dirEntries = await dirResponse.json()

    const directMdFiles = dirEntries.filter(e => e.type === 'file' && e.name.endsWith('.md'))
    const subDirs = dirEntries.filter(e => e.type === 'dir')

    const icon = { 'CSS语法': '🎨', 'React基础': '⚛️', 'AI 模型优化': '🤖' }[entry.name] || '📝'

    if (subDirs.length > 0) {
      const subcategories = []
      for (const sub of subDirs) {
        const subResponse = await apiRequest(
          `${API_BASE}/repos/${OWNER}/${REPO}/contents/${sub.path}?ref=${BRANCH}`,
        )
        const subEntries = await subResponse.json()
        const subMdFiles = subEntries.filter(e => e.type === 'file' && e.name.endsWith('.md'))

        const posts = []
        for (const file of subMdFiles) {
          const contentResponse = await fetch(file.download_url)
          const content = await contentResponse.text()
          const { title } = parsePostMetadata(content, file.name)
          posts.push({
            id: `${entry.name}/${sub.name}/${file.name}`.replace(/\.md$/, ''),
            title,
            content,
            filename: file.name,
            sha: file.sha,
            path: `${entry.name}/${sub.name}`,
          })
        }
        subcategories.push({ name: sub.name.replace(/^\d+-/, ''), posts })
      }
      categories.push({ name: entry.name, icon, subcategories, posts: [] })
    } else {
      const posts = []
      for (const file of directMdFiles) {
        const contentResponse = await fetch(file.download_url)
        const content = await contentResponse.text()
        const { title } = parsePostMetadata(content, file.name)
        posts.push({
          id: `${entry.name}/${file.name}`.replace(/\.md$/, ''),
          title,
          content,
          filename: file.name,
          sha: file.sha,
          path: entry.name,
        })
      }
      categories.push({ name: entry.name, icon, posts })
    }
  }

  return categories
}

export async function fetchPostContent(filename) {
  const response = await apiRequest(
    `${API_BASE}/repos/${OWNER}/${REPO}/contents/${POSTS_PATH}/${filename}?ref=${BRANCH}`,
  )
  const data = await response.json()
  const contentResponse = await fetch(data.download_url)
  const content = await contentResponse.text()

  return { content, sha: data.sha }
}

export async function savePost(filename, content, sha) {
  const encodedContent = btoa(unescape(encodeURIComponent(content)))
  const isUpdate = !!sha

  const body = {
    message: isUpdate ? `docs: update ${filename}` : `docs: create ${filename}`,
    content: encodedContent,
    branch: BRANCH,
  }

  if (isUpdate) {
    body.sha = sha
  }

  const response = await apiRequest(
    `${API_BASE}/repos/${OWNER}/${REPO}/contents/${POSTS_PATH}/${filename}`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify(body),
    },
  )

  const data = await response.json()
  return data.content.sha
}

export async function deletePost(filename, sha) {
  await apiRequest(
    `${API_BASE}/repos/${OWNER}/${REPO}/contents/${POSTS_PATH}/${filename}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...authHeaders(),
      },
      body: JSON.stringify({
        message: `docs: delete ${filename}`,
        sha,
        branch: BRANCH,
      }),
    },
  )
}
