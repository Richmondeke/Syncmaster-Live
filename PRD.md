# SyncMaster — Product Requirements Document
> Source of truth for all build sessions. Claude Code reads this before writing any feature code.
> Notebook source: https://notebooklm.google.com/notebook/5b1d4485-3ed6-43e4-ba3d-5a16271a3ef2

**Version:** 1.0
**Last updated:** April 2026

---

## 1. Product Vision

SyncMaster is a curated sync licensing platform establishing a defensible wedge in the **African composer ↔ global brief corridor**. It solves submission overwhelm for producers and invisibility for African composers who lack professional representation and a clear pathway to global film, TV, and advertising placements.

**Core differentiator:** Human curation + rights clarity. Every composer is manually vetted before appearing on any brief. Producers receive 3–5 curated options — not a directory of thousands.

---

## 2. Problem Statement

| Persona | Problem |
|---------|---------|
| African composer | Technically skilled but professionally invisible. No dedicated pathway to sync deals. Rights documentation is fragmented. |
| Regional producer / Nollywood | Needs authentic sounds but has no time to verify rights or sift through unvetted submissions. |
| Global music supervisor (Netflix, Amazon) | Needs vetted, one-stop-cleared African content. Existing African music is poorly tagged and rights-unclear on generic platforms. |

---

## 3. Personas

### Tunde — The Emerging Composer
- Based in Lagos or Nairobi. Technically skilled, no professional representation.
- Has tracks but struggles to prove rights ownership to global buyers.
- Pain: invisible on Songtradr, buried in TAXI, no African-specific platform.

### Amara — The Regional Producer
- Music supervisor or filmmaker in Nollywood / Pan-African film.
- Needs rights clarity before presenting to clients.
- Pain: open marketplaces give her 500 results with no curation.

### James — The Global Music Supervisor
- Works at Netflix, Amazon, or similar. Needs "ready-to-license" African content with one-stop clearance and ISRC documentation.
- Pain: generic "World Music" labels obscure the specific African sub-genres he needs.

### The Founder (Admin)
- Manual matching engine in the concierge phase.
- Vets applications, reviews briefs, hand-picks 3–5 composers per brief.
- Facilitates warm intros. Provides A&R feedback to rejected composers.

> **V1 note:** James (global supervisor) uses the Producer login in V1. A dedicated supervisor tier is a V4 feature.

---

## 4. User States

### Composer
```
pending → active → rejected
```
| DB State | UX Label | Trigger |
|----------|----------|---------|
| `pending` | Application received / Under review | Signup |
| `active` | Vetted — eligible for briefs | Admin approves |
| `rejected` | Not approved | Admin rejects |

> V2 expansion: add `paused` and `in_review` as explicit states.

### Brief
```
draft → active → matched → closed
```
| DB State | UX Label | Trigger |
|----------|----------|---------|
| `draft` | Saved, not submitted | Producer saves |
| `active` | Curating / Live | Admin moves from draft; invites composers |
| `matched` | Shortlisting / Intro made | Admin after submission deadline |
| `closed` | Placed or No placement | Admin closes |

### Submission
```
pending → shortlisted → accepted → rejected
```

### Placement
```
pending → confirmed → paid
```

### Outreach
```
invited → accepted → declined
```

---

## 5. User Flows

### Flow 1 — Composer Onboarding
```
1. /signup → fills name, email, password, selects Composer
2. composers record created (status: pending)
3. Confirmation email sent: "Application received"
4. /dashboard → sees "Application under review" banner
5. Admin reviews at /dashboard/composers
6. Admin approves → status: active → activation email sent
7. Composer logs in → sees invited briefs, can submit
```

### Flow 2 — Producer Brief Submission
```
1. /signup → selects Producer → immediate dashboard access
2. Creates brief: title, description, genres, budget, deadline
3. Brief saved as draft → admin notified
4. Admin curates: selects 3–5 matching active composers via outreach
5. Composers receive invite → submit up to 3 tracks + creative note
6. Admin shortlists → producer reviews curated tracks
7. Producer selects preferred track
8. Admin sends warm intro email externally
9. Deal closes → placement logged with fee + commission
```

### Flow 3 — Composer Submits to Brief
```
1. Composer receives brief invite (outreach record created)
2. Logs in → sees invited brief
3. Submits up to 3 track URLs + 1–2 sentence creative note per track
4. Submission status: pending
5. If shortlisted → notified
6. If accepted → placement created, notified
7. If rejected → A&R feedback note sent
```

### Flow 4 — Admin End-to-End
```
1. New application → pending count on /dashboard/composers
2. Reviews application → approves or rejects
3. New brief from producer → reviews at /dashboard/briefs
4. Identifies 3–5 active composers → creates outreach records
5. Composers notified → submissions arrive
6. Admin curates shortlist → moves brief to matched
7. Producer selects → admin sends warm intro externally
8. Logs placement: fee, commission → status: confirmed
```

---

## 6. Feature Specification & Versioned Roadmap

### V1.0 — Concierge MVP *(Current Build — Sessions 1–5)*
> Manual everything. Admin is the engine. Validates the Africa-first wedge.

**Auth & Onboarding**
- [x] Composer signup with role selection
- [x] Producer signup (immediate access)
- [x] Admin role (SQL-set, no self-registration)
- [x] Application received email (Resend)
- [x] Composer pending/rejected state on dashboard

**Admin Tools**
- [x] Composer vetting: approve / reject
- [ ] Brief management: review, status transitions
- [ ] Outreach: invite specific composers to a brief
- [ ] Placement logging: fee + commission entry

**Producer Flow**
- [ ] Create and manage briefs
- [ ] View curated shortlist when ready
- [ ] Select preferred track

**Composer Flow**
- [ ] View invited briefs (outreach-only — not open browse)
- [ ] Submit up to 3 tracks + creative note per brief
- [ ] View own submission statuses

**Shared**
- [ ] Placements view (composer and producer sides)
- [ ] Settings: update name, bio, portfolio URL

---

### V1.5 — Production Polish *(Phase 3 — Sessions 6–7)*
> Same data model. Production-quality UX.

- [ ] Email notifications on all key state transitions
- [ ] Loading skeletons on all data pages
- [ ] Error boundaries on all routes
- [ ] Toast feedback on all mutations
- [ ] Mobile responsiveness audit (375px baseline)
- [ ] A&R feedback field on composer rejection
- [ ] Empty states on every list

---

### V2.0 — Self-Serve Marketplace *(6–12 months post-launch)*
> Reduce admin manual load. Active composers can browse briefs themselves.

- [ ] Active composers browse all live briefs (not outreach-only)
- [ ] Self-submit to open briefs within 3-track cap
- [ ] Admin AI-suggestion dashboard: recommended composer-brief matches
- [ ] Producer brief analytics: submission count, genre breakdown
- [ ] DISCO-style producer inbox: stream and shortlist tracks in-app
- [ ] Expanded composer profile: track uploads, stems, ISRC metadata
- [ ] African PRO affiliation fields: MCSN, SAMRO, BMI, ASCAP
- [ ] Split sheet upload and automated rights verification workflow
- [ ] Automated commission calculation and invoicing

---

### V3.0 — Intelligence Layer *(12–24 months)*
> Platform becomes the smart layer between African talent and global demand.

- [ ] AI acoustic fingerprinting and auto-tagging engine
- [ ] Regional tagging system: African-specific fields (Log Drum energy, Fuji rhythm, Afrobeat BPM range)
- [ ] Similarity search: producer pastes Spotify link → finds matching African tracks
- [ ] Prompt-based discovery: "high-energy Afrobeat opening" → curated results (Ordiio Muse AI model)
- [ ] Automated A&R feedback generation via AI on rejected submissions
- [ ] In-browser stem mixer (Marmoset MixLab model)
- [ ] Visual emotional arc filter for music supervisors
- [ ] Composer analytics: earnings, placement history, brief performance
- [ ] Vercel AI Gateway integration for multi-model AI features

---

### V4.0 — Scale & Ecosystem *(24+ months)*
> SyncMaster becomes infrastructure for African music in global media.

- [ ] Multi-territory expansion: per-country PRO integrations
- [ ] Publishing administration layer (Afro Soundtrack model)
- [ ] In-app escrow and payment processing
- [ ] E-signature for licensing agreements
- [ ] API access for music supervisors to query catalog programmatically
- [ ] White-label platform for African record labels and distributors
- [ ] Global Music Supervisor tier (James persona): premium access, bulk licensing, catalog download
- [ ] Mobile app (iOS + Android)

---

## 7. Out of Scope — V1.0

```
✗ In-app messaging between composer and producer
✗ Automated payments or escrow
✗ E-signature
✗ Algorithmic matching (admin matches manually)
✗ File upload for tracks (track URLs only in V1)
✗ Open composer browse by producers
✗ Global music supervisor role (uses producer login in V1)
✗ Split sheet file uploads
✗ Stem access
```

---

## 8. Monetisation Model

| Version | Model |
|---------|-------|
| V1.0 | Commission on placement fee (15–20%). Manual invoicing. |
| V2.0 | Commission (automated) + Producer subscription tiers by brief volume |
| V3.0 | Composer premium tier (featured placement, analytics). Supervisor API access fee. |
| V4.0 | Publishing admin fee. White-label licensing. Enterprise supervisor contracts. |

---

## 9. Success Metrics

### V1.0 — 90-Day Targets
| Metric | Target |
|--------|--------|
| Vetted composers onboarded | 20 |
| Real briefs received | 10 |
| Placements closed | 3 |
| Producer retention (returned for 2nd brief) | 50% |
| Application → vetted time | < 5 business days |

### North Star Metric
**Placements per month** — every other metric is in service of this number.

---

## 10. Schema ↔ PRD Mapping

| PRD Concept | DB Table | Status Field |
|------------|----------|-------------|
| Composer application | `composers` | `pending\|active\|rejected` |
| Producer brief | `briefs` | `draft\|active\|matched\|closed` |
| Composer submission | `submissions` | `pending\|shortlisted\|accepted\|rejected` |
| Admin outreach invite | `outreach` | `invited\|accepted\|declined` |
| Deal closure | `placements` | `pending\|confirmed\|paid` |
| Internal admin task | `tasks` | `open\|in_progress\|done` |

---

## 11. Competitors Reference

| Platform | Relevant Feature | SyncMaster Version |
|----------|-----------------|-------------------|
| TAXI | Human A&R feedback on rejections | V1.5 |
| DISCO | Supervisor inbox, AI auto-tagging | V2.0 / V3.0 |
| Ordiio | Region-forward curation, Muse AI prompts | V3.0 |
| Songtradr | Acoustic fingerprinting, digital resume profile | V3.0 |
| Musicbed | Vibe-first search, prestige curation | V2.0 |
| Marmoset | Stem mixer (MixLab), visual arc filter (ARC) | V3.0 |
| Epidemic Sound | Legal safety / rights ownership model | V2.0 |
| Afro Soundtrack | African PRO registration, publishing admin | V4.0 |
