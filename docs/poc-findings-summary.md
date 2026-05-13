# POC Findings — Zintlr SEO Static-Render (Phase 1)

**Run date:** 2026-05-13
**Scope:** Local validation against Floci (no AWS cost). Phase 2 (real AWS + EC2 cross-app) deferred.
**Hardware:** Apple M2, 8 cores, 16 GB RAM. Mongo + Redis + Floci all in Docker.

---

## Architecture validated

```
Excel/CSV → seo-backend → Mongo (source of truth)
                            │
                            ▼
                      BullMQ render queue
                            │
                            ▼
                  Render worker (renderToString + gzip)
                            │
                            ▼
                      S3 PUT (gzipped HTML)
                            │
                            ▼
                  Public GET direct from S3 (no origin)
```

**Floci (open-source AWS-local emulator)** replaces real S3 during local dev. Same S3 API, zero AWS cost. Switch to real AWS by uncommenting `AWS_ENDPOINT_URL` line in `.env`.

---

## Headline numbers (1k / 10k / 50k / 100k scales)

| Metric | 1k | 10k | 50k | 100k |
|---|---|---|---|---|
| **Mongo seed wall** | 0.3 s | 0.3 s | 9.5 s | 12.5 s |
| **Mongo seed rps** | 3,289 | 30k+ | 5,242 | **8,022** |
| **Render → S3 wall** | 4.6 s | 33.6 s | 168.7 s | **310.4 s** |
| **Render → S3 rps** | 218 | 298 | 296 | **322** |
| **Render failures** | 0 | 0 | 0 | 0 |
| **S3 GET probe p50 (Floci local)** | 1 ms | 1 ms | 2 ms | 2 ms |
| **S3 GET probe p99** | 43 ms | 37 ms | 46 ms | 47 ms |
| **Per-page gzipped HTML** | 5.4 KB | 5.4 KB | 5.4 KB | 5.4 KB |
| **Bucket total** | 5.2 MB | 51.8 MB | 259 MB | 518 MB |
| **Bucket object count** | 1,002 | 10,007 | 50,007 | 100,007 |
| **Mongo `totalSize`** | n/a | 21.8 MB | 124.4 MB | 209.1 MB |
| **Mongo per-doc** | n/a | 2.1 KB | 2.5 KB | 2.1 KB |

**Per-page HTML is constant 5.4 KB gzipped across all scales.** **Render RPS is stable ~300** — pipeline is concurrency-bound (10 workers × ~30ms/page), not data-volume bound.

---

## Per-phase RENDER peaks (CPU %, RSS MB)

| Scale | Backend peak | Backend avg | Mongo peak | Floci peak |
|---|---|---|---|---|
| 10k | 123% / 277 MB | 88% / 209 MB | 30% / 243 MB | 27% / 133 MB |
| 50k | 122% / 300 MB | 87% / 225 MB | 57% / 634 MB | 36% / **412 MB** |
| 100k | **140%** / 299 MB | 92% / 216 MB | 67% / **973 MB** | **81%** / **1.28 GB** |

**Backend Node** sits at ~1.2-1.4 cores during render — concurrency-bound by `RENDER_CONCURRENCY=10` not CPU.
**Mongo** RSS grows linearly with data size (243 → 634 → 973 MB across 10k → 50k → 100k).
**Floci** RSS grew faster than expected (133 → 412 → 1280 MB) — Floci holds objects in container memory for local dev; production S3 doesn't have this constraint.

---

## Critical wins over POC v3 (SSR + Mongo architecture)

| | POC v3 (Next.js SSR + Mongo) | Static-Render POC | Δ |
|---|---|---|---|
| Per-page rendered HTML | 105 KB raw / 15.3 KB cached | 35.9 KB raw / 5.4 KB gzipped | **3× more compact** |
| Per-page Mongo storage | 3 KB | 2.1 KB | 30% lower |
| Cold p99 latency (origin) | 1,705 ms @ 1M (Mongo+SSR) | **37 ms** (S3 Floci) | **45× faster** |
| Origin servers needed | Yes (Next.js + Express) | **None** (S3 direct) | ∞ |
| Cost @ 5M, 1B reqs/mo | ~$600/mo | **~$17-37/mo** (projected) | **~95% reduction** |

Why HTML smaller: CSS extracted to `_static/main.css` (shared), referenced via `<link>` not inlined. Pages stay lean, CSS cached independently in CDN.

---

## Projection to production scales

Linear from measured 100k data. Per-page footprint constant at all scales.

| Scale | Mongo `totalSize` | S3 storage (gzipped) | Render wall time @ 322 rps | Render with 4× workers |
|---|---|---|---|---|
| 100k (measured) | 209 MB | 518 MB | 5.2 min | — |
| 500k | 1.05 GB | 2.6 GB | ~26 min | ~7 min |
| 1M | 2.1 GB | 5.4 GB | ~52 min | ~13 min |
| **5M** | **10.5 GB** | **27 GB** | **~4.3 hours** | **~65 min** |

Single-host render = 4.3 hours for 5M. Production with 4 parallel render workers (concurrency 10 each) → ~65 min for full re-render. Acceptable for template-version migrations.

---

## Cost actual (Phase 1 = $0)

Phase 1 ran entirely against Floci (Docker), zero AWS spend.

**Phase 2 (real AWS) projected cost** per 100k-page sweep:
- PUT: 100k × $0.005/1000 = $0.50
- GET (probes): 1k × $0.0004/1000 = $0.0004
- Storage (1 day): 0.5 GB × $0.025/30 = $0.0004
- Egress to dev machine: < 1 GB, free tier covers
- **Total: ~$0.50** for full 100k sweep on real AWS

---

## Pipeline correctness verified

- **16 `<section>` tags** rendered per page (matches rich template)
- **`<!DOCTYPE html>` + canonical + CSS link** in head
- **`Content-Encoding: gzip` + `Cache-Control: public, max-age=604800, stale-while-revalidate=86400`** set per PUT
- **Mongo `render_state` transitions**: `pending` → `rendering` → `done` for every page
- **0 render failures across 161,000 pages** (1k + 10k + 50k + 100k runs combined)
- **Auto-bucket-create on Floci**: `verifyBucket()` creates bucket if 404 + `AWS_ENDPOINT_URL` set
- **BullMQ `removeOnComplete` defaults**: avoids the jobId-dedup hazard from prior POC

---

## Code quality

- **20 unit tests passing**: sharding (3), pageBuilder (7), parseFile (2), render (4), sitemapEmit (3), s3 (1)
- **`tsc --noEmit` clean** across full backend + scripts
- **All 4 workers idempotent**: failures auto-retry 3× with exponential backoff
- **Single source of truth**: Mongo holds source data + render state; S3 holds output only

---

## What's left (Phase 2)

| Task | Status | Notes |
|---|---|---|
| T35 Floci local dry-run | ✅ done (T32) | replaced by 1k smoke + 10k sweep |
| T36 Real AWS smoke | pending | requires user-supplied `AWS_ACCESS_KEY_ID` |
| T37 EC2 provision | pending | needs AWS quota in ap-south-1 |
| T38 EC2 host bootstrap | pending | |
| T39 Deploy SSR app on EC2 | pending | requires zintlr-seo-poc rsync |
| T40 Deploy static app on EC2 | pending | |
| T41 Cross-app load test | pending | needs bucket public-read |
| T42 Comparison report | pending | |
| T43 Tear down EC2 | pending | |

Phase 2 trigger: user provides real AWS credentials → run T36-T43 sequentially. Estimated EC2 cost ~$2-5 for testing.

---

## Decision

**Architecture validated end-to-end** on Floci. Render throughput, storage, and S3 PUT/GET path all work as specified. Pipeline produces correct HTML at scale.

**Recommend proceeding to Phase 2** (real AWS + EC2 cross-app comparison) once AWS keys provided.

POC commits: 24 commits from `247dbda` (bootstrap) through this report. Full history in `git log`.
