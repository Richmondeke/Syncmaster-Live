import fs from 'fs'
import path from 'path'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export interface PostMeta {
  slug: string
  title: string
  publishDate: string
  keyword: string
  cluster: string
  persona: string
  wordCount: number
  excerpt: string
}

export interface Post extends PostMeta {
  content: string
}

/**
 * Parse YAML frontmatter from a markdown file.
 * Returns { data, content } where data is the parsed frontmatter object.
 */
function parseFrontmatter(raw: string): { data: Record<string, string>; content: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/)
  if (!match) {
    return { data: {}, content: raw }
  }

  const yamlBlock = match[1]
  const content = match[2]

  const data: Record<string, string> = {}
  for (const line of yamlBlock.split('\n')) {
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue
    const key = line.slice(0, colonIdx).trim()
    const value = line.slice(colonIdx + 1).trim()
    if (key) {
      data[key] = value
    }
  }

  return { data, content }
}

/**
 * Extract first ~120 chars of body text as excerpt (strips markdown syntax).
 */
function extractExcerpt(content: string, length = 120): string {
  const stripped = content
    .replace(/^#+\s.+$/gm, '')     // remove headings
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/`[^`]+`/g, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/^[>\-*]\s+/gm, '')
    .replace(/\n+/g, ' ')
    .trim()

  return stripped.length > length ? stripped.slice(0, length).replace(/\s\S*$/, '') + '…' : stripped
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(BLOG_DIR)) return []

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))

  const posts: PostMeta[] = files.map((filename) => {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8')
    const { data, content } = parseFrontmatter(raw)

    const slug = data.slug || filename.replace(/\.md$/, '')

    return {
      slug,
      title: data.title || slug,
      publishDate: data.publishDate || '',
      keyword: data.keyword || '',
      cluster: data.cluster || 'General',
      persona: data.persona || '',
      wordCount: parseInt(data.wordCount || data.word_count_target || '1000', 10),
      excerpt: extractExcerpt(content),
    }
  })

  // Sort newest first
  return posts.sort((a, b) => {
    if (!a.publishDate) return 1
    if (!b.publishDate) return -1
    return new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
  })
}

export function getPostBySlug(slug: string): Post | null {
  if (!fs.existsSync(BLOG_DIR)) return null

  const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith('.md'))

  for (const filename of files) {
    const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf8')
    const { data, content } = parseFrontmatter(raw)

    const fileSlug = data.slug || filename.replace(/\.md$/, '')
    if (fileSlug !== slug) continue

    return {
      slug: fileSlug,
      title: data.title || fileSlug,
      publishDate: data.publishDate || '',
      keyword: data.keyword || '',
      cluster: data.cluster || 'General',
      persona: data.persona || '',
      wordCount: parseInt(data.wordCount || data.word_count_target || '1000', 10),
      excerpt: extractExcerpt(content),
      content,
    }
  }

  return null
}

export function getReadTime(wordCount: number): number {
  return Math.max(1, Math.round(wordCount / 200))
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
}

export type ClusterKey =
  | 'Pillar Keywords'
  | 'Case Studies'
  | 'Licensing Education'
  | 'Technical/Metadata'
  | 'African Music Infrastructure'

const CLUSTER_STYLES: Record<string, { bg: string; text: string }> = {
  'Pillar Keywords': { bg: 'bg-primary/10', text: 'text-primary' },
  'Case Studies': { bg: 'bg-emerald-500/10', text: 'text-emerald-500' },
  'Licensing Education': { bg: 'bg-orange-500/10', text: 'text-orange-500' },
  'Technical/Metadata': { bg: 'bg-sky-500/10', text: 'text-sky-500' },
  'African Music Infrastructure': { bg: 'bg-fuchsia-500/10', text: 'text-fuchsia-500' },
}

const DEFAULT_STYLE = { bg: 'bg-muted', text: 'text-muted-foreground' }

export function getClusterStyle(cluster: string): { bg: string; text: string } {
  return CLUSTER_STYLES[cluster] ?? DEFAULT_STYLE
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}
