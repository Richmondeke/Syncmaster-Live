import { NextResponse, type NextRequest } from 'next/server'
import { cookies } from 'next/headers'

// Shared in-memory DB for mock sessions.
// Next.js server processes keep this in memory, which is perfect for Playwright tests!
const mockDb = {
  outreach: [
    {
      id: 'outreach-001',
      composer_id: 'comp-demo',
      brief_id: '6bfe3fa6-7c8b-452a-9903-d94c6f71b7dc',
      status: 'invited',
      sent_at: new Date().toISOString()
    }
  ],
  submissions: [] as any[],
  briefs: [
    {
      id: '6bfe3fa6-7c8b-452a-9903-d94c6f71b7dc',
      producer_id: 'mock-producer-id',
      title: 'Upbeat Indie Pop for Summer Fashion Campaign',
      description: 'Looking for bright, energetic indie pop tracks with catchy hooks for a major fashion brand summer campaign.',
      genres: ['Indie Pop', 'Synth Pop', 'Electronic'],
      budget_min: 5000,
      budget_max: 15000,
      deadline: '2026-06-15',
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ai_match_status: 'complete',
      ai_suggested_composers: ['comp-demo'],
      ai_suggested_composers_detail: [
        {
          composer_id: 'comp-demo',
          match_score: 9.5,
          match_reason: 'Highly relevant genres and successful summer fashion campaigns portfolio.',
          confidence: 0.95
        }
      ]
    }
  ],
  profiles: [
    { id: 'mock-admin-id', role: 'admin', full_name: 'Admin User' },
    { id: 'mock-producer-id', role: 'producer', full_name: 'Sarah Mitchell' },
    { id: 'user-1', role: 'composer', full_name: 'Julian Thorne' },
    { id: 'user-2', role: 'composer', full_name: 'Elena Vance' },
    { id: 'user-3', role: 'composer', full_name: 'Marcus Gray' },
    { id: 'a2308014-7225-474f-a2e1-04a02111e348', role: 'composer', full_name: 'Composer Demo' }
  ],
  composers: [
    {
      id: 'comp-1',
      profile_id: 'user-1',
      status: 'pending',
      bio: 'Award-winning film composer specializing in orchestral and ambient scores.',
      genres: ['Orchestral', 'Ambient', 'Cinematic'],
      portfolio_url: 'https://example.com/portfolio1',
      created_at: new Date().toISOString()
    },
    {
      id: 'comp-2',
      profile_id: 'user-2',
      status: 'pending',
      bio: 'Electronic music producer with a focus on synth-wave and techno.',
      genres: ['Electronic', 'Synth-wave', 'Techno'],
      portfolio_url: 'https://example.com/portfolio2',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'comp-3',
      profile_id: 'user-3',
      status: 'pending',
      bio: 'Singer-songwriter and multi-instrumentalist.',
      genres: ['Folk', 'Acoustic', 'Indie'],
      portfolio_url: 'https://example.com/portfolio3',
      created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'comp-4',
      profile_id: 'user-4',
      status: 'pending',
      bio: 'Jazz pianist and composer.',
      genres: ['Jazz', 'Classical'],
      portfolio_url: 'https://example.com/portfolio4',
      created_at: new Date().toISOString()
    },
    {
      id: 'comp-5',
      profile_id: 'user-5',
      status: 'pending',
      bio: 'Pop music producer.',
      genres: ['Pop', 'R&B'],
      portfolio_url: 'https://example.com/portfolio5',
      created_at: new Date().toISOString()
    },
    {
      id: 'comp-6',
      profile_id: 'user-6',
      status: 'pending',
      bio: 'Rock guitarist and songwriter.',
      genres: ['Rock', 'Alternative'],
      portfolio_url: 'https://example.com/portfolio6',
      created_at: new Date().toISOString()
    },
    {
      id: 'comp-7',
      profile_id: 'user-7',
      status: 'pending',
      bio: 'Hip-hop beatmaker.',
      genres: ['Hip-hop', 'Trap'],
      portfolio_url: 'https://example.com/portfolio7',
      created_at: new Date().toISOString()
    },
    {
      id: 'comp-8',
      profile_id: 'user-8',
      status: 'pending',
      bio: 'Country music singer.',
      genres: ['Country', 'Folk'],
      portfolio_url: 'https://example.com/portfolio8',
      created_at: new Date().toISOString()
    },
    {
      id: 'comp-9',
      profile_id: 'user-9',
      status: 'pending',
      bio: 'Experimental sound artist.',
      genres: ['Experimental', 'Noise'],
      portfolio_url: 'https://example.com/portfolio9',
      created_at: new Date().toISOString()
    },
    {
      id: 'comp-10',
      profile_id: 'user-10',
      status: 'pending',
      bio: 'Classical composer.',
      genres: ['Classical', 'Orchestral'],
      portfolio_url: 'https://example.com/portfolio10',
      created_at: new Date().toISOString()
    },
    {
      id: 'comp-2',
      profile_id: 'user-2',
      status: 'active',
      bio: 'Electronic music producer with a focus on synth-wave and techno.',
      genres: ['Electronic', 'Synth-wave', 'Techno'],
      portfolio_url: 'https://example.com/portfolio2',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'comp-3',
      profile_id: 'user-3',
      status: 'active',
      bio: 'Singer-songwriter and multi-instrumentalist.',
      genres: ['Folk', 'Acoustic', 'Indie'],
      portfolio_url: 'https://example.com/portfolio3',
      created_at: new Date(Date.now() - 172800000).toISOString()
    },
    {
      id: 'comp-demo',
      profile_id: 'a2308014-7225-474f-a2e1-04a02111e348',
      status: 'active',
      bio: 'Demo composer.',
      genres: ['Indie Pop', 'Electronic'],
      portfolio_url: 'https://example.com/demo',
      created_at: new Date(Date.now() - 250000000).toISOString()
    }
  ]
}

/** Return single object when Supabase client uses .single() or .maybeSingle() */
function respond(data: any[], request: NextRequest) {
  const accept = request.headers.get('accept') || ''
  if (accept.includes('application/vnd.pgrst.object+json')) {
    // .single() / .maybeSingle() — return first item as object
    if (data.length === 1) {
      return new NextResponse(JSON.stringify(data[0]), {
        headers: { 'Content-Type': 'application/vnd.pgrst.object+json' }
      })
    }
    if (data.length === 0) {
      // .maybeSingle() expects null, .single() expects an error
      // Return 406 for .single() with 0 rows — Supabase client handles this
      return new NextResponse(JSON.stringify(null), {
        status: 200,
        headers: { 'Content-Type': 'application/vnd.pgrst.object+json' }
      })
    }
    // Multiple rows — return first anyway (mock is lenient)
    return new NextResponse(JSON.stringify(data[0]), {
      headers: { 'Content-Type': 'application/vnd.pgrst.object+json' }
    })
  }
  return NextResponse.json(data)
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.path?.join('/') || ''
  const searchParams = request.nextUrl.searchParams

  if (path.startsWith('auth/v1/admin/users/')) {
    const id = path.split('/').pop() || 'mock-user-id'
    const prof = mockDb.profiles.find(p => p.id === id)
    return NextResponse.json({
      id,
      email: `${id}@test.com`,
      user_metadata: { full_name: prof?.full_name || 'Composer Demo', role: 'composer' }
    })
  }
  
  if (path.startsWith('auth/v1/user')) {
    const cookieStore = await cookies()
    const sessionEmail = cookieStore.get('session_email')?.value
    if (!sessionEmail) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    
    let role = cookieStore.get('role')?.value || 'admin'
    let id = 'mock-admin-id'
    if (sessionEmail.includes('composer')) {
      id = 'a2308014-7225-474f-a2e1-04a02111e348'
      role = 'composer'
    } else if (sessionEmail.includes('producer')) {
      id = 'mock-producer-id'
      role = 'producer'
    }
    
    return NextResponse.json({
      id,
      email: sessionEmail,
      user_metadata: { full_name: cookieStore.get('full_name')?.value || 'Godliverse', role }
    })
  }

  // Handle rest calls
  if (path.startsWith('rest/v1/profiles')) {
    const idFilter = searchParams.get('id')
    if (idFilter) {
      const idVal = idFilter.split('.').pop()
      const prof = mockDb.profiles.find(p => p.id === idVal)
      if (prof) {
        return respond([prof], request)
      }
      return respond([], request)
    }
    const cookieStore = await cookies()
    const role = cookieStore.get('role')?.value || 'admin'
    return respond([{ role, full_name: cookieStore.get('full_name')?.value || 'Godliverse' }], request)
  }

  if (path.startsWith('rest/v1/composers')) {
    const data = mockDb.composers.map(comp => {
      const prof = mockDb.profiles.find(p => p.id === comp.profile_id)
      return {
        ...comp,
        profiles: {
          full_name: prof?.full_name || 'Composer'
        }
      }
    })
    return respond(data, request)
  }

  if (path.startsWith('rest/v1/producers')) {
    return respond([{ id: 'mock-producer-id', profile_id: 'mock-producer-id' }], request)
  }

  if (path.startsWith('rest/v1/outreach')) {
    // Check for filters
    const composerIdFilter = searchParams.get('composer_id')
    const briefIdFilter = searchParams.get('brief_id')
    let result = mockDb.outreach
    
    if (composerIdFilter) {
      const idVal = composerIdFilter.split('.').pop()
      result = result.filter(o => o.composer_id === idVal)
    }
    if (briefIdFilter) {
      const idVal = briefIdFilter.split('.').pop()
      result = result.filter(o => o.brief_id === idVal)
    }
    
    return respond(result, request)
  }

  if (path.startsWith('rest/v1/submissions')) {
    const composerIdFilter = searchParams.get('composer_id')
    const briefIdFilter = searchParams.get('brief_id')
    let result = mockDb.submissions
    if (composerIdFilter) {
      const idVal = composerIdFilter.split('.').pop()
      result = result.filter((s: any) => s.composer_id === idVal)
    }
    if (briefIdFilter) {
      const idVal = briefIdFilter.split('.').pop()
      result = result.filter((s: any) => s.brief_id === idVal)
    }
    return respond(result, request)
  }

  if (path.startsWith('rest/v1/briefs')) {
    // If querying by ID
    const idFilter = searchParams.get('id')
    if (idFilter) {
      const idVal = idFilter.split('.').pop()
      const brief = mockDb.briefs.find(b => b.id === idVal)
      if (brief) {
        return respond([{
          ...brief,
          producers: { company: 'Vogue Studios', profiles: { full_name: 'Sarah Mitchell' } }
        }], request)
      }
      return respond([], request)
    }
    return respond(mockDb.briefs.map(b => ({
      ...b,
      producers: { company: 'Vogue Studios', profiles: { full_name: 'Sarah Mitchell' } }
    })), request)
  }

  return respond([], request)
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.path?.join('/') || ''
  const body = await request.json().catch(() => ({}))

  if (path.startsWith('auth/v1/token')) {
    // Reset state for tests
    const comp1 = mockDb.composers.find(c => c.id === 'comp-1')
    if (comp1) comp1.status = 'pending'
    
    const outreach1 = mockDb.outreach.find(o => o.id === 'outreach-001')
    if (outreach1) outreach1.status = 'invited'
    
    return NextResponse.json({ access_token: 'mock-token', user: { id: 'mock-id' } })
  }

  if (path.startsWith('auth/v1/signup')) {
    return NextResponse.json({ user: { id: 'mock-id' } })
  }

  if (path.startsWith('rest/v1/submissions')) {
    const submission = {
      id: `submission-${Date.now()}`,
      created_at: new Date().toISOString(),
      ...body
    }
    mockDb.submissions.push(submission)
    return respond([submission], request)
  }

  if (path.startsWith('rest/v1/briefs')) {
    const brief = {
      id: body.id || `brief-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      status: 'draft',
      ai_match_status: 'pending',
      ai_suggested_composers: [],
      ai_suggested_composers_detail: [],
      ...body
    }
    mockDb.briefs.push(brief)
    return respond([brief], request)
  }

  if (path.startsWith('rest/v1/outreach')) {
    const outreach = {
      id: `outreach-${Date.now()}`,
      sent_at: new Date().toISOString(),
      ...body
    }
    mockDb.outreach.push(outreach)
    return respond([outreach], request)
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.path?.join('/') || ''
  const body = await request.json().catch(() => ({}))
  const searchParams = request.nextUrl.searchParams

  if (path.startsWith('rest/v1/outreach')) {
    const composerIdFilter = searchParams.get('composer_id')
    const briefIdFilter = searchParams.get('brief_id')
    
    let matched = mockDb.outreach
    if (composerIdFilter) {
      const idVal = composerIdFilter.split('.').pop()
      matched = matched.filter(o => o.composer_id === idVal)
    }
    if (briefIdFilter) {
      const idVal = briefIdFilter.split('.').pop()
      matched = matched.filter(o => o.brief_id === idVal)
    }
    
    matched.forEach(o => {
      if (body.status) o.status = body.status
    })
    return NextResponse.json({ success: true })
  }

  if (path.startsWith('rest/v1/briefs')) {
    const idFilter = searchParams.get('id')
    if (idFilter) {
      const idVal = idFilter.split('.').pop()
      const brief = mockDb.briefs.find(b => b.id === idVal)
      if (brief) {
        Object.assign(brief, body)
      }
    }
    return NextResponse.json({ success: true })
  }

  if (path.startsWith('rest/v1/composers')) {
    const profileIdFilter = searchParams.get('profile_id')
    if (profileIdFilter) {
      const profileIdVal = profileIdFilter.split('.').pop()
      const comp = mockDb.composers.find(c => c.profile_id === profileIdVal)
      if (comp) {
        Object.assign(comp, body)
      }
    }
    return NextResponse.json({ success: true })
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const resolvedParams = await params
  const path = resolvedParams.path?.join('/') || ''
  
  if (path.startsWith('rest/v1/submissions')) {
    mockDb.submissions = []
    return NextResponse.json({ success: true })
  }
  return NextResponse.json({ success: true })
}
