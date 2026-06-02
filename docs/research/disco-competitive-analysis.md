# DISCO.ac — Competitive Analysis

**Date scraped:** 2026-06-02  
**Source:** https://www.disco.ac/  
**Purpose:** Feature inspiration and positioning reference for SyncMaster product decisions.

---

## What DISCO Is

All-in-one music management platform. Horizontal SaaS — catalog storage, sharing, discovery, and metadata — for the whole music industry. Pricing from $10.80/mo subscription.

**Tagline:** "Where music lives, works and moves."  
**Subheadline:** "The all-in-one music management platform. Helping music go further, faster."

---

## Target Users

- Music Supervisors
- Rights Holders (Labels & Publishers)
- Artists & Creators
- A&R and Management
- Enterprise
- Marketing & Promotions

---

## Core Feature Pillars

| Pillar | Description |
|--------|-------------|
| **Manage** | Centralise and simplify — everything in one place |
| **Share** | Send/receive music securely, track listener engagement |
| **Discover** | AI-powered discovery to surface relevant tracks |

---

## Feature Detail

### Catalog & Storage
- Upload unlimited tracks, playlists, metadata
- WAV/AIFF conversion
- Custom fields
- CSV catalog editing
- Distributor ingestion
- Bulk uploader tool

### Sharing & Collaboration
- Playlist sharing with clients
- Inboxes for receiving track submissions
- Email creator
- Assigned URLs / expiring URLs
- Password protection
- Territory restrictions (Enterprise)
- Watermarking — inaudible, re-encoding resistant, leak tracing ($29/mo add-on)

### Discovery (Discovery Suite — $10/mo add-on)
- Autotagging — auto-generates genre, mood, tempo, instrumentation
- Similarity search — "find tracks that sound like this"
- Lyric transcription
- Instant instrumental generation
- DISCO Catalogs — search across all users' catalogs

### Analytics
- Advanced playlist stats
- Listener engagement tracking (who played, how long)

### Access
- iOS and Android mobile apps
- API access (Enterprise)
- SSO (Enterprise)
- Enhanced customisation (Enterprise)

---

## Pricing

| Plan | Price | Users | Files |
|------|-------|-------|-------|
| Artist | From $10.80/mo | 1 | Unlimited |
| Plus | From $16.99/mo | 1 | 1K |
| Pro | From $26.99/mo | 1 | 1K |
| Enterprise | Custom | Many | Custom |

Add-ons: Discovery Suite (+$10/mo), Watermarking (+$29/mo)

No free tier. Free trial available.

---

## Music Supervisor Page Highlights

**Headline:** "The platform that works like you do"  
**Stat:** 90% of music supervisors trust DISCO

Pain points they address:
- Disorganised music across hard drives, folders, iTunes
- Time-consuming submission/metadata management
- Cumbersome client feedback
- Limited mobility during production

Key testimonials:
- *"DISCO has organized all of our music in one place."* — Evyen Klean, Music Supervisor
- *"Sending links with direct inbox submissions saves so much time."* — Aminé Ramer, Music Supervisor

---

## Positioning: DISCO vs SyncMaster

| Dimension | DISCO | SyncMaster |
|-----------|-------|------------|
| **Model** | SaaS tool — self-serve | Curated agency — we do it for you |
| **Discovery** | Search everything yourself | 3–5 curated picks, human + AI |
| **Access** | Open marketplace | Invite-only, vetted composers |
| **Rights** | Shows contact info | Pre-cleared, rights verified |
| **Focus** | Global, horizontal | African composers → global briefs |
| **Price** | Subscription | Commission on placement |
| **EPK / Profiles** | Not a feature | SyncMaster advantage |
| **Brief management** | Not a feature | SyncMaster differentiator |

**Core insight:** DISCO is a tool. SyncMaster is a service. DISCO gives supervisors a bigger haystack with better search. SyncMaster gives them no haystack — just the right tracks.

---

## Features Worth Adapting (Prioritised)

### High Priority
| Feature | Why | SyncMaster Status |
|---------|-----|------------------|
| Expiring share links | Supervisors should get time-limited link to review matches | Not built |
| Playlist-style match delivery | Present 3–5 curated tracks as a streamable playlist | Not built |
| Engagement tracking | Know when a supervisor played a track, how long, replays | Not built |
| Autotagging | Already scaffolded in `agents/metadata-tagger.ts` | In progress |

### Medium Priority
| Feature | Why | SyncMaster Status |
|---------|-----|------------------|
| Similarity search (admin-only) | Find composers whose catalog fits a brief | Not built |
| Watermarking | Rights protection during review window | Not built |
| Submission inbox UX improvements | DISCO's direct-to-inbox flow is cleaner | Partial |

### Low Priority / Out of Scope
- Mobile app
- Lyric transcription
- Instant instrumental

---

## Copy Worth Studying

- *"The platform that works like you do"* — empathy-first
- *"90% of music supervisors trust DISCO"* — social proof stat
- *"Helping music go further, faster"* — outcome-focused
- *"Built by music supervisors for music supervisors"* — credibility marker

SyncMaster equivalent: **built for the corridor that didn't exist before.**
