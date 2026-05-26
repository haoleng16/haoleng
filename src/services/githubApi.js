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
  const mdFiles = entries.filter(e => e.type === 'file' && e.name.endsWith('.md'))

  const categoryMap = new Map()

  for (const file of mdFiles) {
    const contentResponse = await fetch(file.download_url)
    const content = await contentResponse.text()
    const { category, title } = parsePostMetadata(content, file.name)

    if (!categoryMap.has(category)) {
      categoryMap.set(category, [])
    }
    categoryMap.get(category).push({
      id: file.name.replace(/\.md$/, ''),
      title,
      content,
      filename: file.name,
      sha: file.sha,
    })
  }

  const icons = {
    'AI 模型优化': '🤖',
    'React 学习笔记': '⚛️',
    '前端技巧': '🎨',
  }

  const categories = []
  for (const [name, posts] of categoryMap) {
    categories.push({
      name,
      icon: icons[name] || '📝',
      posts,
    })
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
