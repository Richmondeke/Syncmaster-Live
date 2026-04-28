# SyncMaster — Vision, Personas & Problem

## Product Vision
SyncMaster is a curated sync licensing platform establishing a defensible wedge in the **African composer ↔ global brief corridor**. Solves submission overwhelm for producers and invisibility for African composers who lack professional representation.

**Core differentiator:** Human curation + rights clarity. Every composer is manually vetted. Producers receive 3–5 curated options — not a directory of thousands.

---

## Problem Statement

| Persona | Problem |
|---------|---------|
| African composer | Technically skilled but professionally invisible. Rights documentation is fragmented. |
| Regional producer / Nollywood | Needs rights clarity but no time to verify or sift through unvetted submissions. |
| Global music supervisor (Netflix, Amazon) | Needs vetted, one-stop-cleared African content. Poorly tagged on generic platforms. |

---

## Personas

- **Tunde** — Emerging composer, Lagos/Nairobi. No representation, no sync pathway.
- **Amara** — Regional producer. Needs curation, gets 500 unvetted results on open platforms.
- **James** — Global supervisor (Netflix/Amazon). Needs one-stop clearance + ISRC docs. Uses Producer login in V1.
- **Founder (Admin)** — Manual matching engine. Vets, matches, facilitates warm intros.

---

## North Star Metric
**Placements per month** — every other metric serves this number.

---

## V1.0 — 90-Day Targets

| Metric | Target |
|--------|--------|
| Vetted composers onboarded | 20 |
| Real briefs received | 10 |
| Placements closed | 3 |
| Producer retention (2nd brief) | 50% |
| Application → vetted time | < 5 business days |

---

## V1.0 — Out of Scope

```
✗ In-app messaging
✗ Automated payments or escrow
✗ E-signature
✗ Algorithmic or AI-assisted matching (admin matches manually in V1.0 — AI suggestions are Phase D)
✗ File upload for tracks (track URLs only in V1)
✗ Open composer browse by producers
✗ Global music supervisor role (uses producer login)
✗ Split sheet file uploads
✗ Stem access
```

---

## Schema ↔ Feature Mapping

| Feature | DB Table | Status Field |
|---------|----------|-------------|
| Composer application | `composers` | `pending\|active\|rejected` |
| Producer brief | `briefs` | `draft\|active\|matched\|closed` |
| Composer submission | `submissions` | `pending\|shortlisted\|accepted\|rejected` |
| Admin outreach invite | `outreach` | `invited\|accepted\|declined` |
| Deal closure | `placements` | `pending\|confirmed\|paid` |
