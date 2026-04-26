# SyncMaster — User States & Flows

## User States

### Composer
```
pending → active → rejected
```
| DB State | UX Label | Trigger |
|----------|----------|---------|
| `pending` | Application received / Under review | Signup |
| `active` | Vetted — eligible for briefs | Admin approves |
| `rejected` | Not approved | Admin rejects |

### Brief
```
draft → active → matched → closed
```
| DB State | UX Label | Trigger |
|----------|----------|---------|
| `draft` | Saved, not submitted | Producer saves |
| `active` | Curating / Live | Admin activates (Phase D+: AI analysis also runs) |
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

## User Flows

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
Phase B (manual):
1. /signup → selects Producer → immediate dashboard access
2. Creates brief: title, description, genres, budget, deadline
3. Brief saved as draft → admin notified
4. Admin activates brief → manually identifies 3–5 matching active composers
5. Admin creates outreach records → composers notified
6. Composers receive invite → submit up to 3 tracks + creative note
7. Admin shortlists → producer reviews curated tracks
8. Producer selects preferred track
9. Admin sends warm intro email externally
10. Deal closes → placement logged with fee + commission

Phase D addition (AI-assisted):
Step 4 becomes: Admin activates brief → AI brief-analyzer runs automatically,
returns ranked composer list with match reasons → admin reviews and confirms invites
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
Phase B (manual):
1. New application → pending count on /dashboard/composers
2. Reviews application → approves or rejects
3. New brief from producer → reviews at /dashboard/briefs
4. Manually identifies 3–5 active composers → creates outreach records
5. Composers submit → admin curates shortlist → moves brief to matched
6. Producer selects → admin sends warm intro externally
7. Logs placement: fee, commission → status: confirmed

Phase D addition (AI-assisted):
Step 4 becomes: Activates brief → AI returns ranked composer list with reasons
→ admin confirms or overrides each invite
```
