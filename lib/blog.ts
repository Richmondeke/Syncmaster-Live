import fs from 'fs'
import path from 'path'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

const CLUSTER_MAP: Record<string, string> = {
  // Composer Stories
  'Artist Stories': 'Composer Stories',
  'Composers like Tunde': 'Composer Stories',

  // Supervisor Side
  'Music Supervisor Side': 'Supervisor Side',
  'Head of Sync': 'Supervisor Side',

  // Proof & Placements
  'Proof/Placements': 'Proof & Placements',
  'Proof': 'Proof & Placements',
  'Case Studies': 'Proof & Placements',

  // African Music
  'African Music Infrastructure': 'African Music',
  'C — African Music Infrastructure & Market': 'African Music',
  'Amapiano Culture': 'African Music',
  'Diaspora': 'African Music',
  'Culture': 'African Music',

  // Education
  'Education': 'Education',
  'Licensing Education': 'Education',
  'Definitions': 'Education',
  'How-To': 'Education',
  'Technical/Metadata': 'Education',
  'Product': 'Education',
  'Sync licensing fundamentals': 'Education',
  'Pillar Keywords': 'Education',
  'Publishing': 'Education',
  'Royalty Collection': 'Education',
  'Long-tail Qs': 'Education',
  'Action Intent': 'Education',
  'Problem Awareness': 'Education',

  // Industry (catch-all)
  'Industry': 'Industry',
  'default': 'Industry',
  'Market News': 'Industry',
  'Income': 'Industry',
  'Gaming': 'Industry',
  'Genre Sync': 'Industry',
  'Film & TV': 'Industry',
  'Film & TV Sync': 'Industry',
  'Advertising': 'Industry',
  'Sports Sync': 'Industry',
  'Behind the Scenes': 'Industry',
  'Relationships': 'Industry',
}

function normalizeCluster(raw: string): string {
  return CLUSTER_MAP[raw] ?? 'Industry'
}

export interface PostMeta {
  slug: string
  title: string
  publishDate: string
  keyword: string
  cluster: string
  persona: string
  wordCount: number
  excerpt: string
  coverImage?: string
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
      cluster: normalizeCluster(data.cluster || 'default'),
      persona: data.persona || '',
      wordCount: parseInt(data.wordCount || data.word_count_target || '1000', 10),
      excerpt: extractExcerpt(content),
      coverImage: data.coverImage || undefined,
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

// Strip internal metadata (Social Bridge)
let cleanContent = content
const socialBridgeIdx = content.indexOf('## Social Bridge')
if (socialBridgeIdx !== -1) {
  cleanContent = content.slice(0, socialBridgeIdx).trim()
}

return {
  slug: fileSlug,
  title: data.title || fileSlug,
  publishDate: data.publishDate || '',
  keyword: data.keyword || '',
  cluster: normalizeCluster(data.cluster || 'default'),
  persona: data.persona || '',
  wordCount: parseInt(data.wordCount || data.word_count_target || '1000', 10),
  excerpt: extractExcerpt(cleanContent),
  content: cleanContent,
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
  | 'Composer Stories'
  | 'Supervisor Side'
  | 'Proof & Placements'
  | 'African Music'
  | 'Education'
  | 'Industry'

const CLUSTER_STYLES: Record<string, { bg: string; text: string }> = {
  'Composer Stories':   { bg: 'bg-primary/10',      text: 'text-primary' },
  'Supervisor Side':    { bg: 'bg-sky-500/10',       text: 'text-sky-500' },
  'Proof & Placements': { bg: 'bg-emerald-500/10',   text: 'text-emerald-500' },
  'African Music':      { bg: 'bg-fuchsia-500/10',   text: 'text-fuchsia-500' },
  'Education':          { bg: 'bg-orange-500/10',    text: 'text-orange-500' },
  'Industry':           { bg: 'bg-muted',            text: 'text-muted-foreground' },
}

const DEFAULT_STYLE = { bg: 'bg-muted', text: 'text-muted-foreground' }

export function getClusterStyle(cluster: string): { bg: string; text: string } {
  return CLUSTER_STYLES[cluster] ?? DEFAULT_STYLE
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug)
}
