import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// ---------------------------------------------------------------------------
// In-memory mock DB — shared across all requests in the same server process
// ---------------------------------------------------------------------------
const mockDb = {
  // ── Auth / Profiles ──────────────────────────────────────────────────────
  profiles: [
    { id: 'richmond-admin-id', role: 'admin', full_name: 'Richmond Acheampong', email: 'richmond@guava.earth' },
    { id: 'mock-admin-id',     role: 'admin', full_name: 'Admin User',           email: 'admin@syncmaster.io' },
    { id: 'mock-producer-id',  role: 'producer', full_name: 'Sarah Mitchell',    email: 'sarah@vogue.studio' },
    { id: 'user-1',  role: 'composer', full_name: 'Julian Thorne',  email: 'julian@composers.io' },
    { id: 'user-2',  role: 'composer', full_name: 'Elena Vance',    email: 'elena@composers.io' },
    { id: 'user-3',  role: 'composer', full_name: 'Marcus Gray',    email: 'marcus@composers.io' },
    { id: 'a2308014-7225-474f-a2e1-04a02111e348', role: 'composer', full_name: 'Composer Demo', email: 'composer@demo.com' },
  ] as any[],

  // ── Briefs ───────────────────────────────────────────────────────────────
  briefs: [
    {
      id: '6bfe3fa6-7c8b-452a-9903-d94c6f71b7dc',
      producer_id: 'mock-producer-id',
      title: 'Upbeat Indie Pop for Summer Fashion Campaign',
      description: 'Looking for bright, energetic indie pop tracks with catchy hooks for a major fashion brand summer campaign.',
      genres: ['Indie Pop', 'Synth Pop', 'Electronic'],
      budget_min: 5000, budget_max: 15000,
      deadline: '2026-06-15', status: 'active',
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      ai_match_status: 'complete',
      ai_suggested_composers: ['comp-demo'],
      ai_suggested_composers_detail: [{ composer_id: 'comp-demo', match_score: 9.5, match_reason: 'Highly relevant genres.', confidence: 0.95 }],
    },
    {
      id: 'a1b2c3d4-0001-4000-8000-000000000001',
      producer_id: 'mock-producer-id',
      title: 'Cinematic Orchestral Score for Nature Documentary',
      description: 'Epic orchestral compositions needed for a nature documentary series airing on Netflix. Must convey grandeur and wonder.',
      genres: ['Orchestral', 'Cinematic', 'Ambient'],
      budget_min: 10000, budget_max: 30000,
      deadline: '2026-07-01', status: 'active',
      created_at: new Date(Date.now() - 86400000).toISOString(), updated_at: new Date().toISOString(),
      ai_match_status: 'pending', ai_suggested_composers: [], ai_suggested_composers_detail: [],
    },
    {
      id: 'a1b2c3d4-0002-4000-8000-000000000002',
      producer_id: 'mock-producer-id',
      title: 'Lo-Fi Hip Hop for Mobile Gaming App',
      description: 'Chill lo-fi beats for a casual puzzle game. Must be loopable and non-distracting. 60–90 second loops preferred.',
      genres: ['Lo-Fi', 'Hip Hop', 'Chillhop'],
      budget_min: 2000, budget_max: 5000,
      deadline: '2026-05-30', status: 'active',
      created_at: new Date(Date.now() - 172800000).toISOString(), updated_at: new Date().toISOString(),
      ai_match_status: 'complete', ai_suggested_composers: ['comp-1'], ai_suggested_composers_detail: [],
    },
    {
      id: 'a1b2c3d4-0003-4000-8000-000000000003',
      producer_id: 'mock-producer-id',
      title: 'Dark Electronic Score for Sci-Fi Game Trailer',
      description: 'Intense, atmospheric electronic music for a AAA sci-fi game trailer reveal. Needs cinematic tension and drop moments.',
      genres: ['Electronic', 'Dark Ambient', 'Industrial'],
      budget_min: 8000, budget_max: 20000,
      deadline: '2026-08-01', status: 'active',
      created_at: new Date(Date.now() - 259200000).toISOString(), updated_at: new Date().toISOString(),
      ai_match_status: 'pending', ai_suggested_composers: [], ai_suggested_composers_detail: [],
    },
    {
      id: 'a1b2c3d4-0004-4000-8000-000000000004',
      producer_id: 'mock-producer-id',
      title: 'Warm Acoustic Guitar for Insurance TV Commercial',
      description: 'Emotional, warm acoustic guitar piece for a 60-second TV ad. Wholesome, family-friendly feel.',
      genres: ['Acoustic', 'Folk', 'Singer-Songwriter'],
      budget_min: 3000, budget_max: 8000,
      deadline: '2026-06-20', status: 'active',
      created_at: new Date(Date.now() - 345600000).toISOString(), updated_at: new Date().toISOString(),
      ai_match_status: 'pending', ai_suggested_composers: [], ai_suggested_composers_detail: [],
    },
  ] as any[],

  // ── EPKs ─────────────────────────────────────────────────────────────────
  epks: [
    {
      id: 'epk-1',
      user_id: 'a2308014-7225-474f-a2e1-04a02111e348',
      title: 'Neon Horizon',
      slug: 'neon-horizon',
      type: 'Album Release',
      status: 'published',
      views: 142,
      image_url: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?auto=format&fit=crop&w=800&q=80',
      bio: 'Neon Horizon is the upcoming synthwave concept album from Malena Cadiz. Immersive, atmospheric, and highly energetic, the release showcases the juxtaposition of cold digital and warm analog sounds.',
      tracks: [
        { id: 'tr_1', title: 'Midnight Horizon', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', duration: '3:45' },
        { id: 'tr_2', title: 'Neon Pulse', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', duration: '2:30' }
      ],
      social_links: {
        instagram: 'https://instagram.com/malenacadiz',
        spotify: 'https://open.spotify.com/artist/malenacadiz',
        soundcloud: 'https://soundcloud.com/malenacadiz'
      },
      created_at: new Date(Date.now() - 604800000).toISOString(),
      updated_at: new Date().toISOString()
    },
    {
      id: 'epk-2',
      user_id: 'a2308014-7225-474f-a2e1-04a02111e348',
      title: 'Ethereal Soul',
      slug: 'ethereal-soul',
      type: 'Artist Profile',
      status: 'draft',
      views: 12,
      image_url: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=800&q=80',
      bio: 'Ethereal Soul is a sound journey crossing ambient landscapes and cinematic soundscapes.',
      tracks: [
        { id: 'tr_3', title: 'Ethereal Echoes', audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', duration: '4:12' }
      ],
      social_links: {
        instagram: 'https://instagram.com/malenacadiz',
        spotify: 'https://open.spotify.com/artist/malenacadiz'
      },
      created_at: new Date(Date.now() - 345600000).toISOString(),
      updated_at: new Date().toISOString()
    }
  ] as any[],

  // ── Composers ────────────────────────────────────────────────────────────
  composers: [
    { id: 'comp-demo', profile_id: 'a2308014-7225-474f-a2e1-04a02111e348', status: 'active', bio: 'Demo composer.', genres: ['Indie Pop', 'Electronic'], portfolio_url: 'https://example.com/demo', created_at: new Date(Date.now() - 250000000).toISOString() },
    { id: 'comp-1',  profile_id: 'user-1', status: 'pending', bio: 'Award-winning film composer specializing in orchestral and ambient scores.', genres: ['Orchestral', 'Ambient', 'Cinematic'], portfolio_url: 'https://example.com/portfolio1', created_at: new Date().toISOString() },
    { id: 'comp-2',  profile_id: 'user-2', status: 'active',  bio: 'Electronic music producer with a focus on synth-wave and techno.', genres: ['Electronic', 'Synth-wave', 'Techno'], portfolio_url: 'https://example.com/portfolio2', created_at: new Date(Date.now() - 86400000).toISOString() },
    { id: 'comp-3',  profile_id: 'user-3', status: 'active',  bio: 'Singer-songwriter and multi-instrumentalist.', genres: ['Folk', 'Acoustic', 'Indie'], portfolio_url: 'https://example.com/portfolio3', created_at: new Date(Date.now() - 172800000).toISOString() },
  ] as any[],

  // ── Outreach / Submissions ───────────────────────────────────────────────
  outreach: [
    { id: 'outreach-001', composer_id: 'comp-demo', brief_id: '6bfe3fa6-7c8b-452a-9903-d94c6f71b7dc', status: 'invited', sent_at: new Date().toISOString() },
  ] as any[],
  submissions: [] as any[],

  // ── Track Catalog ────────────────────────────────────────────────────────
  tracks: [
    { id: 'tr_1', title: 'Midnight Horizon', genre: 'Ambient / Cinematic', duration: '3:45', bpm: '72', key: 'Am', plays: '1.2k', versions: [{ id: 'tr_1_main', title: 'Main Mix', type: 'Full' }, { id: 'tr_1_inst', title: 'Instrumental', type: 'Instrumental' }], created_at: new Date(Date.now() - 200000000).toISOString() },
    { id: 'tr_2', title: 'Neon Pulse', genre: 'Cyberpunk / Electronic', duration: '2:30', bpm: '124', key: 'Fm', plays: '850', versions: [{ id: 'tr_2_main', title: 'Main Mix', type: 'Full' }], created_at: new Date(Date.now() - 100000000).toISOString() },
    { id: 'tr_3', title: 'Ethereal Echoes', genre: 'Atmospheric / Vocal', duration: '4:12', bpm: '65', key: 'C#m', plays: '2.4k', versions: [], created_at: new Date(Date.now() - 50000000).toISOString() },
  ] as any[],

  // ── Track Extended Metadata ──────────────────────────────────────────────
  track_metadata: [
    { track_id: 'tr_1', artist: 'Malena Cadiz', album: 'Hellbent & Moonbound', composer: 'Malena Cadiz', grouping: '', year: '2023', isrc: '', comments: '', lyrics: '', tags: ['ambient', 'cinematic', 'film'] },
    { track_id: 'tr_2', artist: 'Malena Cadiz', album: 'Neon Sessions', composer: 'Malena Cadiz', grouping: '', year: '2024', isrc: '', comments: '', lyrics: '', tags: ['electronic', 'cyberpunk'] },
    { track_id: 'tr_3', artist: 'Malena Cadiz', album: 'Atmospheric Vol.1', composer: 'Malena Cadiz', grouping: '', year: '2024', isrc: '', comments: '', lyrics: '', tags: ['vocal', 'atmospheric'] },
  ] as any[],

  // ── Track Writers / Composition splits ──────────────────────────────────
  track_writers: [] as any[],
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function respond(data: any[], request: NextRequest) {
  const accept = request.headers.get('accept') || ''
  if (accept.includes('application/vnd.pgrst.object+json')) {
    if (data.length === 0) return new NextResponse(JSON.stringify(null), { status: 200, headers: { 'Content-Type': 'application/vnd.pgrst.object+json' } })
    return new NextResponse(JSON.stringify(data[0]), { headers: { 'Content-Type': 'application/vnd.pgrst.object+json' } })
  }
  return NextResponse.json(data)
}

function getFilterVal(param: string | null) {
  return param ? param.split('.').pop() : null
}

// ---------------------------------------------------------------------------
// GET
// ---------------------------------------------------------------------------
export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.path?.join('/') || ''
  const sp = request.nextUrl.searchParams

  // Auth: admin user lookup
  if (path.startsWith('auth/v1/admin/users/')) {
    const id = path.split('/').pop() || 'mock-user-id'
    const prof = mockDb.profiles.find(p => p.id === id)
    return NextResponse.json({ id, email: prof?.email || `${id}@test.com`, user_metadata: { full_name: prof?.full_name || 'Composer Demo', role: prof?.role || 'composer' } })
  }

  // Auth: current user from cookie
  if (path.startsWith('auth/v1/user')) {
    const cookieStore = await cookies()
    const sessionEmail = cookieStore.get('session_email')?.value
    if (!sessionEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    let role = 'admin', id = 'mock-admin-id'
    if (sessionEmail === 'richmond@guava.earth') { id = 'richmond-admin-id'; role = 'admin' }
    else if (sessionEmail.includes('composer')) { id = 'a2308014-7225-474f-a2e1-04a02111e348'; role = 'composer' }
    else if (sessionEmail.includes('producer')) { id = 'mock-producer-id'; role = 'producer' }
    return NextResponse.json({ id, email: sessionEmail, user_metadata: { full_name: cookieStore.get('full_name')?.value || 'Godliverse', role } })
  }

  // Profiles — supports ?email=eq.{email} for autocomplete
  if (path.startsWith('rest/v1/profiles')) {
    const emailFilter = sp.get('email')
    if (emailFilter) {
      const emailVal = getFilterVal(emailFilter)
      const results = mockDb.profiles.filter(p => p.email?.toLowerCase().includes((emailVal || '').toLowerCase()))
      return respond(results, request)
    }
    const idFilter = sp.get('id')
    if (idFilter) {
      const idVal = getFilterVal(idFilter)
      const prof = mockDb.profiles.find(p => p.id === idVal)
      return respond(prof ? [prof] : [], request)
    }
    const cookieStore = await cookies()
    const role = cookieStore.get('role')?.value || 'admin'
    return respond([{ role, full_name: cookieStore.get('full_name')?.value || 'Godliverse' }], request)
  }

  // Composers
  if (path.startsWith('rest/v1/composers')) {
    const data = mockDb.composers.map(comp => ({ ...comp, profiles: { full_name: mockDb.profiles.find(p => p.id === comp.profile_id)?.full_name || 'Composer' } }))
    return respond(data, request)
  }

  if (path.startsWith('rest/v1/producers')) {
    return respond([{ id: 'mock-producer-id', profile_id: 'mock-producer-id' }], request)
  }

  // Outreach
  if (path.startsWith('rest/v1/outreach')) {
    let result = mockDb.outreach
    const cid = getFilterVal(sp.get('composer_id')); if (cid) result = result.filter(o => o.composer_id === cid)
    const bid = getFilterVal(sp.get('brief_id'));    if (bid) result = result.filter(o => o.brief_id === bid)
    return respond(result, request)
  }

  // Submissions
  if (path.startsWith('rest/v1/submissions')) {
    let result = mockDb.submissions
    const cid = getFilterVal(sp.get('composer_id')); if (cid) result = result.filter((s: any) => s.composer_id === cid)
    const bid = getFilterVal(sp.get('brief_id'));    if (bid) result = result.filter((s: any) => s.brief_id === bid)
    return respond(result, request)
  }

  // Briefs
  if (path.startsWith('rest/v1/briefs')) {
    const idVal = getFilterVal(sp.get('id'))
    if (idVal) {
      const brief = mockDb.briefs.find(b => b.id === idVal)
      if (brief) return respond([{ ...brief, producers: { company: 'Vogue Studios', profiles: { full_name: 'Sarah Mitchell' } } }], request)
      return respond([], request)
    }
    return respond(mockDb.briefs.map(b => ({ ...b, producers: { company: 'Vogue Studios', profiles: { full_name: 'Sarah Mitchell' } } })), request)
  }

  // ── Tracks catalog ───────────────────────────────────────────────────────
  if (path.startsWith('rest/v1/tracks')) {
    const idVal = getFilterVal(sp.get('id'))
    if (idVal) {
      const track = mockDb.tracks.find(t => t.id === idVal)
      return respond(track ? [track] : [], request)
    }
    return respond(mockDb.tracks, request)
  }

  // Track metadata
  if (path.startsWith('rest/v1/track_metadata')) {
    const trackId = getFilterVal(sp.get('track_id'))
    if (trackId) {
      const meta = mockDb.track_metadata.find(m => m.track_id === trackId)
      return respond(meta ? [meta] : [], request)
    }
    return respond(mockDb.track_metadata, request)
  }

  // Track writers
  if (path.startsWith('rest/v1/track_writers')) {
    const trackId = getFilterVal(sp.get('track_id'))
    if (trackId) return respond(mockDb.track_writers.filter(w => w.track_id === trackId), request)
    return respond(mockDb.track_writers, request)
  }

  // EPKs
  if (path.startsWith('rest/v1/epks')) {
    let result = mockDb.epks
    const slugFilter = sp.get('slug')
    if (slugFilter) {
      const slugVal = getFilterVal(slugFilter)
      result = result.filter(e => e.slug === slugVal)
    }
    const idFilter = sp.get('id')
    if (idFilter) {
      const idVal = getFilterVal(idFilter)
      result = result.filter(e => e.id === idVal)
    }
    const userIdFilter = sp.get('user_id')
    if (userIdFilter) {
      const userIdVal = getFilterVal(userIdFilter)
      result = result.filter(e => e.user_id === userIdVal)
    }
    return respond(result, request)
  }

  return respond([], request)
}

// ---------------------------------------------------------------------------
// POST
// ---------------------------------------------------------------------------
export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.path?.join('/') || ''
  const body = await request.json().catch(() => ({}))

  if (path.startsWith('auth/v1/token')) {
    const comp1 = mockDb.composers.find(c => c.id === 'comp-1'); if (comp1) comp1.status = 'pending'
    const o1 = mockDb.outreach.find(o => o.id === 'outreach-001'); if (o1) o1.status = 'invited'
    return NextResponse.json({ access_token: 'mock-token', user: { id: 'mock-id' } })
  }
  if (path.startsWith('auth/v1/signup')) return NextResponse.json({ user: { id: 'mock-id' } })

  if (path.startsWith('rest/v1/submissions')) {
    const submission = { id: `submission-${Date.now()}`, created_at: new Date().toISOString(), ...body }
    mockDb.submissions.push(submission)
    return respond([submission], request)
  }
  if (path.startsWith('rest/v1/briefs')) {
    const brief = { id: body.id || `brief-${Date.now()}`, created_at: new Date().toISOString(), updated_at: new Date().toISOString(), status: 'draft', ai_match_status: 'pending', ai_suggested_composers: [], ai_suggested_composers_detail: [], ...body }
    mockDb.briefs.push(brief)
    return respond([brief], request)
  }
  if (path.startsWith('rest/v1/outreach')) {
    const outreach = { id: `outreach-${Date.now()}`, sent_at: new Date().toISOString(), ...body }
    mockDb.outreach.push(outreach)
    return respond([outreach], request)
  }

  // Tracks
  if (path.startsWith('rest/v1/tracks')) {
    const track = { id: body.id || `tr_${Date.now()}`, created_at: new Date().toISOString(), versions: [], plays: '0', ...body }
    mockDb.tracks.push(track)
    return respond([track], request)
  }
  // Track metadata
  if (path.startsWith('rest/v1/track_metadata')) {
    const existing = mockDb.track_metadata.findIndex(m => m.track_id === body.track_id)
    if (existing >= 0) { Object.assign(mockDb.track_metadata[existing], body) }
    else { mockDb.track_metadata.push({ ...body }) }
    return respond([body], request)
  }
  // Track writers — upsert by track_id + email
  if (path.startsWith('rest/v1/track_writers')) {
    const writers: any[] = Array.isArray(body) ? body : [body]
    writers.forEach(w => {
      const idx = mockDb.track_writers.findIndex(x => x.track_id === w.track_id && x.email === w.email)
      if (idx >= 0) Object.assign(mockDb.track_writers[idx], w)
      else mockDb.track_writers.push({ id: `tw_${Date.now()}_${Math.random().toString(36).slice(2,6)}`, ...w })
    })
    return respond(writers, request)
  }

  // EPKs
  if (path.startsWith('rest/v1/epks')) {
    const slug = body.slug
    if (mockDb.epks.some(e => e.slug === slug)) {
      return NextResponse.json({ error: 'duplicate_slug', message: 'An EPK with this slug already exists.' }, { status: 409 })
    }
    const epk = {
      id: body.id || `epk-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      views: 0,
      tracks: body.tracks || [],
      social_links: body.social_links || {},
      ...body
    }
    mockDb.epks.push(epk)
    return respond([epk], request)
  }

  return NextResponse.json({ success: true })
}

// ---------------------------------------------------------------------------
// PATCH
// ---------------------------------------------------------------------------
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.path?.join('/') || ''
  const body = await request.json().catch(() => ({}))
  const sp = request.nextUrl.searchParams

  if (path.startsWith('rest/v1/outreach')) {
    let matched = mockDb.outreach
    const cid = getFilterVal(sp.get('composer_id')); if (cid) matched = matched.filter(o => o.composer_id === cid)
    const bid = getFilterVal(sp.get('brief_id'));    if (bid) matched = matched.filter(o => o.brief_id === bid)
    matched.forEach(o => { if (body.status) o.status = body.status })
    return NextResponse.json({ success: true })
  }
  if (path.startsWith('rest/v1/briefs')) {
    const idVal = getFilterVal(sp.get('id'))
    if (idVal) { const b = mockDb.briefs.find(b => b.id === idVal); if (b) Object.assign(b, body) }
    return NextResponse.json({ success: true })
  }
  if (path.startsWith('rest/v1/composers')) {
    const pidVal = getFilterVal(sp.get('profile_id'))
    if (pidVal) { const c = mockDb.composers.find(c => c.profile_id === pidVal); if (c) Object.assign(c, body) }
    return NextResponse.json({ success: true })
  }
  if (path.startsWith('rest/v1/tracks')) {
    const idVal = getFilterVal(sp.get('id'))
    if (idVal) { const t = mockDb.tracks.find(t => t.id === idVal); if (t) Object.assign(t, body) }
    return NextResponse.json({ success: true })
  }
  if (path.startsWith('rest/v1/track_metadata')) {
    const tidVal = getFilterVal(sp.get('track_id'))
    if (tidVal) {
      const idx = mockDb.track_metadata.findIndex(m => m.track_id === tidVal)
      if (idx >= 0) Object.assign(mockDb.track_metadata[idx], body)
      else mockDb.track_metadata.push({ track_id: tidVal, ...body })
    }
    return NextResponse.json({ success: true })
  }
  if (path.startsWith('rest/v1/track_writers')) {
    const tidVal = getFilterVal(sp.get('track_id'))
    if (tidVal) {
      // Replace all writers for this track
      mockDb.track_writers = mockDb.track_writers.filter(w => w.track_id !== tidVal)
      const writers: any[] = Array.isArray(body) ? body : [body]
      writers.forEach(w => mockDb.track_writers.push({ id: `tw_${Date.now()}`, track_id: tidVal, ...w }))
    }
    return NextResponse.json({ success: true })
  }

  // EPKs
  if (path.startsWith('rest/v1/epks')) {
    const idVal = getFilterVal(sp.get('id'))
    if (idVal) {
      const epkIdx = mockDb.epks.findIndex(e => e.id === idVal)
      if (epkIdx >= 0) {
        if (body.slug && body.slug !== mockDb.epks[epkIdx].slug) {
          if (mockDb.epks.some(e => e.slug === body.slug && e.id !== idVal)) {
            return NextResponse.json({ error: 'duplicate_slug', message: 'An EPK with this slug already exists.' }, { status: 409 })
          }
        }
        Object.assign(mockDb.epks[epkIdx], { ...body, updated_at: new Date().toISOString() })
        return NextResponse.json({ success: true })
      }
    }
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  return NextResponse.json({ success: true })
}

// ---------------------------------------------------------------------------
// DELETE
// ---------------------------------------------------------------------------
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.path?.join('/') || ''
  const sp = request.nextUrl.searchParams

  if (path.startsWith('rest/v1/submissions')) { mockDb.submissions = []; return NextResponse.json({ success: true }) }

  if (path.startsWith('rest/v1/tracks')) {
    const idVal = getFilterVal(sp.get('id'))
    if (idVal) {
      mockDb.tracks = mockDb.tracks.filter(t => t.id !== idVal)
      mockDb.track_metadata = mockDb.track_metadata.filter(m => m.track_id !== idVal)
      mockDb.track_writers = mockDb.track_writers.filter(w => w.track_id !== idVal)
    }
    return NextResponse.json({ success: true })
  }
  if (path.startsWith('rest/v1/track_writers')) {
    const tidVal = getFilterVal(sp.get('track_id'))
    if (tidVal) mockDb.track_writers = mockDb.track_writers.filter(w => w.track_id !== tidVal)
    return NextResponse.json({ success: true })
  }

  // EPKs
  if (path.startsWith('rest/v1/epks')) {
    const idVal = getFilterVal(sp.get('id'))
    if (idVal) {
      mockDb.epks = mockDb.epks.filter(e => e.id !== idVal)
      return NextResponse.json({ success: true })
    }
    return NextResponse.json({ error: 'id_missing' }, { status: 400 })
  }

  return NextResponse.json({ success: true })
}
