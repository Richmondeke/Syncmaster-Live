/**
 * Simple markdown-to-HTML renderer.
 * Covers: headings (h1–h4), bold, italic, inline code, fenced code blocks,
 * unordered lists, ordered lists, blockquotes, horizontal rules, paragraphs.
 * Also: CTA buttons, Social Bridge stripping, internal link resolution.
 * No external dependencies required.
 */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

const INTERNAL_DOMAINS = ['syncmaster.live', 'www.syncmaster.live', 'syncmaster.io']

// ── Design-system CTA button classes ────────────────────────────────────────
// Matches the footer CTA style: bg-primary, rounded-full, font-black, uppercase
const CTA_BUTTON_CLASSES = [
  'inline-flex items-center justify-center gap-2',
  'px-8 py-3.5 mt-4 mb-2',
  'rounded-full',
  'bg-primary text-primary-foreground',
  'font-black text-sm uppercase tracking-wider',
  'hover:bg-primary/90',
  'transition-all duration-200',
  'shadow-[var(--shadow-primary-glow)]',
  'no-underline',
].join(' ')

const CTA_ARROW_SVG = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>'

// ── URL rewriting ───────────────────────────────────────────────────────────

function rewriteUrl(href: string): string {
  for (const domain of INTERNAL_DOMAINS) {
    const pattern = new RegExp(`^https?://${domain.replace(/\./g, '\\.')}(/[^\\s"']*)?$`)
    const match = href.match(pattern)
    if (match) {
      let path = match[1] ?? '/'
      // Map known dead paths to real routes
      if (path === '/apply-composer') path = '/signup'
      if (path === '/composers') path = '/composers'
      if (path === '/supervisors') path = '/supervisors'
      return path || '/'
    }
  }
  return href
}

// ── Inline processing ───────────────────────────────────────────────────────

function processInline(text: string, slugMap?: Record<string, string>): string {
  // Bold + italic: ***text***
  text = text.replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
  // Bold: **text**
  text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  // Italic: *text*
  text = text.replace(/\*(.+?)\*/g, '<em>$1</em>')
  // Inline code: `code`
  text = text.replace(/`([^`]+)`/g, '<code class="font-mono text-sm bg-muted px-1.5 py-0.5 rounded text-primary">$1</code>')

  // Images: ![alt text](url)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="rounded-xl border border-border my-8 w-full object-cover shadow-sm" />')

  // ── CTA patterns ──────────────────────────────────────────────────────

  // [CTA: Label](url) — CTA with explicit link
  text = text.replace(/\[CTA:\s*([^\]]+)\]\(([^)]+)\)/g, (_, label, rawHref) => {
    const href = rewriteUrl(rawHref)
    return `<a href="${href}" class="${CTA_BUTTON_CLASSES}">${label.trim()} ${CTA_ARROW_SVG}</a>`
  })

  // [CTA: Label] — bare CTA without link → default to /signup
  text = text.replace(/\[CTA:\s*([^\]]+)\]/g, (_, label) => {
    return `<a href="/signup" class="${CTA_BUTTON_CLASSES}">${label.trim()} ${CTA_ARROW_SVG}</a>`
  })

  // Internal Links: [INTERNAL LINK: Title] — resolve slug via map first, then generate
  text = text.replace(/\[INTERNAL LINK:\s*([^\]]+)\]/g, (_, title) => {
    const key = title.toLowerCase().replace(/[^\w\s]/g, '').replace(/\s+/g, ' ').trim()
    const slug = slugMap?.[key]
      ?? title.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-')
    return `<a href="/blog/${slug}" class="inline-flex items-center gap-1.5 font-bold text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-4 decoration-2 transition-all">
      ${title}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
    </a>`
  })

  // [LINK: Label] — sometimes used as inline CTA → /signup
  text = text.replace(/\[LINK:\s*([^\]]+)\]/g, (_, label) => {
    // If it mentions "supervisor" or "brief", link to /supervisors
    const href = /supervisor|brief/i.test(label) ? '/supervisors' : '/signup'
    return `<a href="${href}" class="${CTA_BUTTON_CLASSES}">${label.trim()} ${CTA_ARROW_SVG}</a>`
  })

  // Links: [text](url) — rewrite syncmaster domains to relative, open external in new tab
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, rawHref) => {
    const href = rewriteUrl(rawHref)
    const isExternal = /^https?:\/\//.test(href)
    const attrs = isExternal
      ? ' target="_blank" rel="noopener noreferrer"'
      : ''
    return `<a href="${href}"${attrs} class="text-primary font-bold underline decoration-primary/30 underline-offset-4 decoration-2 hover:decoration-primary transition-all">${label}</a>`
  })

  // Bare syncmaster.io/syncmaster.live URLs in text → make them clickable
  text = text.replace(/(?<!")(?:https?:\/\/)?((?:www\.)?syncmaster\.(?:io|live))(\/\S*)?/g, (match, domain, path) => {
    if (match.startsWith('"') || match.startsWith("'")) return match // skip if inside attr
    const fullPath = rewriteUrl(`https://${domain}${path || ''}`)
    const isExternal = /^https?:\/\//.test(fullPath)
    if (isExternal) return match
    return `<a href="${fullPath}" class="text-primary font-bold underline decoration-primary/30 underline-offset-4 decoration-2 hover:decoration-primary transition-all">${domain}${path || ''}</a>`
  })

  // "Link in Bio" / "[Link in Bio]" → strip
  text = text.replace(/\[?Link in Bio\]?/gi, '')

  return text
}

// ── Detect if a line is a standalone CTA paragraph ──────────────────────────
// e.g. "Ready to unlock your music?" or "Apply to SyncMaster today"
function isCtaParagraph(text: string): boolean {
  // Already has a CTA button (processed in inline)
  if (text.includes(CTA_BUTTON_CLASSES.slice(0, 20))) return false
  // Check for CTA-like phrasing at paragraph level
  const ctaPhrases = [
    /^ready to .{10,}\?/i,
    /^discover how syncmaster/i,
    /^visit syncmaster/i,
    /^apply to syncmaster/i,
    /^learn more about.*syncmaster/i,
    /^explore how syncmaster/i,
    /^join syncmaster/i,
    /^get started with syncmaster/i,
  ]
  const plain = text.replace(/<[^>]+>/g, '') // strip HTML for matching
  return ctaPhrases.some(p => p.test(plain.trim()))
}

// ── Main renderer ───────────────────────────────────────────────────────────

export function renderMarkdown(content: string, slugMap?: Record<string, string>): string {
  // Strip everything from "## Social Bridge" onward — internal editorial notes
  content = content.replace(/\n---\s*\n## Social Bridge[\s\S]*$/m, '')
  content = content.replace(/\n## Social Bridge[\s\S]*$/m, '')

  // Strip "# Carousel Post" sections — social media notes
  content = content.replace(/\n# Carousel Post[\s\S]*$/m, '')

  const lines = content.split('\n')
  const htmlParts: string[] = []

  let i = 0
  while (i < lines.length) {
    const line = lines[i]

    // Fenced code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]))
        i++
      }
      const langClass = lang ? ` data-lang="${escapeHtml(lang)}"` : ''
      htmlParts.push(
        `<pre class="bg-muted rounded-xl p-6 overflow-x-auto my-6 text-sm font-mono leading-relaxed"${langClass}><code>${codeLines.join('\n')}</code></pre>`
      )
      i++ // skip closing ```
      continue
    }

    // Headings
    const h4 = line.match(/^####\s+(.+)/)
    if (h4) {
      htmlParts.push(`<h4 class="text-lg font-black tracking-[-0.068em] mt-8 mb-3 text-foreground">${processInline(h4[1], slugMap)}</h4>`)
      i++
      continue
    }
    const h3 = line.match(/^###\s+(.+)/)
    if (h3) {
      htmlParts.push(`<h3 class="text-xl font-black tracking-[-0.068em] mt-10 mb-4 text-foreground">${processInline(h3[1], slugMap)}</h3>`)
      i++
      continue
    }
    const h2 = line.match(/^##\s+(.+)/)
    if (h2) {
      htmlParts.push(`<h2 class="text-2xl md:text-3xl font-black tracking-[-0.068em] mt-12 mb-5 text-foreground">${processInline(h2[1], slugMap)}</h2>`)
      i++
      continue
    }
    const h1 = line.match(/^#\s+(.+)/)
    if (h1) {
      htmlParts.push(`<h1 class="text-3xl md:text-4xl font-black tracking-[-0.068em] mt-12 mb-6 text-foreground">${processInline(h1[1], slugMap)}</h1>`)
      i++
      continue
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim()) || /^\*\*\*+$/.test(line.trim())) {
      htmlParts.push('<hr class="my-10 border-border" />')
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const bqLines: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        bqLines.push(processInline(lines[i].slice(2), slugMap))
        i++
      }
      htmlParts.push(
        `<blockquote class="border-l-2 border-l-primary pl-6 my-6 text-muted-foreground italic">${bqLines.join(' ')}</blockquote>`
      )
      continue
    }

    // Unordered list
    if (/^[*\-]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[*\-]\s+/.test(lines[i])) {
        items.push(`<li class="mb-2">${processInline(lines[i].replace(/^[*\-]\s+/, ''), slugMap)}</li>`)
        i++
      }
      htmlParts.push(`<ul class="list-disc list-outside pl-6 my-5 space-y-1 text-muted-foreground">${items.join('')}</ul>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li class="mb-2">${processInline(lines[i].replace(/^\d+\.\s+/, ''), slugMap)}</li>`)
        i++
      }
      htmlParts.push(`<ol class="list-decimal list-outside pl-6 my-5 space-y-1 text-muted-foreground">${items.join('')}</ol>`)
      continue
    }

    // Empty line — skip
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph: collect consecutive non-empty, non-special lines
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^#{1,4}\s/.test(lines[i]) &&
      !/^[*\-]\s+/.test(lines[i]) &&
      !/^\d+\.\s+/.test(lines[i]) &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith('```') &&
      !/^---+$/.test(lines[i].trim()) &&
      !/^\*\*\*+$/.test(lines[i].trim())
    ) {
      paraLines.push(processInline(lines[i], slugMap))
      i++
    }
    if (paraLines.length > 0) {
      const paraHtml = paraLines.join(' ')

      // Check if this paragraph contains a CTA button (already rendered)
      if (paraHtml.includes('CTA_BUTTON') || paraHtml.includes(CTA_BUTTON_CLASSES.slice(0, 30))) {
        // Wrap in a centered CTA container matching design system
        htmlParts.push(`<div class="my-8 flex flex-col items-center text-center">${paraHtml}</div>`)
      } else if (isCtaParagraph(paraHtml)) {
        // Promotional paragraph — style as a CTA card
        htmlParts.push(`<div class="my-10 p-8 rounded-[2rem] bg-primary/5 border border-primary/10 text-center space-y-4">
          <p class="text-lg font-bold text-foreground leading-relaxed">${paraHtml}</p>
          <a href="/signup" class="${CTA_BUTTON_CLASSES}">Get Started ${CTA_ARROW_SVG}</a>
        </div>`)
      } else {
        htmlParts.push(`<p class="my-5 leading-relaxed text-muted-foreground">${paraHtml}</p>`)
      }
    }
  }

  return htmlParts.join('\n')
}
