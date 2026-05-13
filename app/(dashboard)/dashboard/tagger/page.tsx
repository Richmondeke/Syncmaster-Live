export default function TaggerPage() {
  return (
    <div className="flex flex-col gap-8 pt-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl md:text-5xl font-medium tracking-[-0.05em] text-foreground">AI Tagger</h1>
        <p className="text-lg text-muted-foreground tracking-tight">Automatically generate metadata and mood tags for your tracks using AI.</p>
      </div>
      
      <div className="rounded-3xl border border-border bg-card p-12 flex flex-col items-center justify-center min-h-[400px] text-center gap-4">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/><path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/></svg>
        </div>
        <h2 className="text-2xl font-medium tracking-tight">Ready to tag your music?</h2>
        <p className="text-muted-foreground max-w-md">Drop your audio files here to start the AI analysis and generate production-ready tags.</p>
        <button className="mt-4 px-8 py-3 bg-primary text-primary-foreground rounded-full font-bold hover:bg-primary/90 transition-colors">
          Upload Tracks
        </button>
      </div>
    </div>
  )
}
