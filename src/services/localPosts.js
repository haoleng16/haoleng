const postModules = import.meta.glob('../posts/**/*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
})

const icons = {
  'AI 模型优化': '🤖',
  'React 学习笔记': '⚛️',
  '前端技巧': '🎨',
  'Python第三方库': '🐍',
  'Python基础': '🌱',
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

function filenameFromPath(path) {
  return path.split('/').pop()
}

function postPartsFromPath(path) {
  return path.replace('../posts/', '').split('/')
}

function postIdFromParts(parts) {
  return parts.join('/').replace(/\.md$/, '')
}

function postTitleFromFilename(filename) {
  return filename.replace(/\.md$/, '').replace(/_/g, ' ')
}

function ensureCategory(categoryMap, name) {
  if (!categoryMap.has(name)) {
    categoryMap.set(name, {
      name,
      icon: icons[name] || '📝',
      posts: [],
      subcategoryMap: new Map(),
    })
  }
  return categoryMap.get(name)
}

function toPublicCategory(category) {
  const subcategories = Array.from(category.subcategoryMap, ([name, posts]) => ({
    name,
    posts,
  }))

  return {
    name: category.name,
    icon: category.icon,
    posts: category.posts,
    subcategories,
  }
}

export function getLocalPostCategories() {
  const categoryMap = new Map()

  const posts = Object.entries(postModules).sort(([a], [b]) =>
    a.localeCompare(b, 'en'),
  )

  for (const [path, content] of posts) {
    const filename = filenameFromPath(path)
    const parts = postPartsFromPath(path)
    const { category: metadataCategory, title } = parsePostMetadata(content, filename)
    const post = {
      id: postIdFromParts(parts),
      title: title || postTitleFromFilename(filename),
      content,
      filename,
    }

    if (parts.length === 1) {
      ensureCategory(categoryMap, metadataCategory).posts.push(post)
      continue
    }

    const category = ensureCategory(categoryMap, parts[0])
    if (parts.length === 2) {
      category.posts.push(post)
      continue
    }

    const subcategoryName = parts.slice(1, -1).join(' / ')
    if (!category.subcategoryMap.has(subcategoryName)) {
      category.subcategoryMap.set(subcategoryName, [])
    }
    category.subcategoryMap.get(subcategoryName).push(post)
  }

  return Array.from(categoryMap.values(), toPublicCategory)
}
