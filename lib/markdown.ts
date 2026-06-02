/**
 * Simple markdown-to-HTML renderer.
 * Covers: headings (h1–h4), bold, italic, inline code, fenced code blocks,
 * unordered lists, ordered lists, blockquotes, horizontal rules, paragraphs.
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

function processInline(text: string): string {
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

  // Internal Links: [INTERNAL LINK: What is a one-stop licence?]
  text = text.replace(/\[INTERNAL LINK:\s*([^\]]+)\]/g, (match, title) => {
    const slug = title.toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
    return `<a href="/blog/${slug}" class="inline-flex items-center gap-1.5 font-bold text-primary hover:text-primary/80 underline decoration-primary/30 underline-offset-4 decoration-2 transition-all">
      ${title}
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
    </a>`
  })

  // Links: [text](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-primary font-bold underline decoration-primary/30 underline-offset-4 decoration-2 hover:decoration-primary transition-all">$1</a>')
  
  return text
}

export function renderMarkdown(content: string): string {
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
      htmlParts.push(`<h4 class="text-lg font-black tracking-[-0.068em] mt-8 mb-3 text-foreground">${processInline(h4[1])}</h4>`)
      i++
      continue
    }
    const h3 = line.match(/^###\s+(.+)/)
    if (h3) {
      htmlParts.push(`<h3 class="text-xl font-black tracking-[-0.068em] mt-10 mb-4 text-foreground">${processInline(h3[1])}</h3>`)
      i++
      continue
    }
    const h2 = line.match(/^##\s+(.+)/)
    if (h2) {
      htmlParts.push(`<h2 class="text-2xl md:text-3xl font-black tracking-[-0.068em] mt-12 mb-5 text-foreground">${processInline(h2[1])}</h2>`)
      i++
      continue
    }
    const h1 = line.match(/^#\s+(.+)/)
    if (h1) {
      htmlParts.push(`<h1 class="text-3xl md:text-4xl font-black tracking-[-0.068em] mt-12 mb-6 text-foreground">${processInline(h1[1])}</h1>`)
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
        bqLines.push(processInline(lines[i].slice(2)))
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
        items.push(`<li class="mb-2">${processInline(lines[i].replace(/^[*\-]\s+/, ''))}</li>`)
        i++
      }
      htmlParts.push(`<ul class="list-disc list-outside pl-6 my-5 space-y-1 text-muted-foreground">${items.join('')}</ul>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s+/.test(lines[i])) {
        items.push(`<li class="mb-2">${processInline(lines[i].replace(/^\d+\.\s+/, ''))}</li>`)
        i++
      }
      htmlParts.push(`<ol class="list-decimal list-outside pl-6 my-5 space-y-1 text-muted-foreground">${items.join('')}</ol>`)
      continue
    }

    // Empty line — skip (paragraph breaks handled by collecting non-empty lines below)
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
      paraLines.push(processInline(lines[i]))
      i++
    }
    if (paraLines.length > 0) {
      htmlParts.push(`<p class="my-5 leading-relaxed text-muted-foreground">${paraLines.join(' ')}</p>`)
    }
  }

  return htmlParts.join('\n')
}
