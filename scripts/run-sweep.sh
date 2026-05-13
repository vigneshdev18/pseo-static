#!/usr/bin/env bash
# Render-pipeline sweep: drop, seed N, render-all, probe S3, measure bucket.
# Args: <N>
set -e
N=$1

ROOT=/Users/riyuk/Desktop/Projects/zintlr-seo-static
cd "$ROOT"

# 1. Stop everything
lsof -ti:4001 | xargs kill -9 2>/dev/null || true
pkill -f "monitor.sh" 2>/dev/null || true
sleep 1

# 2. Wipe state (drop collections)
mongosh --port 27019 zintlr_seo_static --quiet --eval "db.pages.drop(); db.import_jobs.drop()" > /dev/null
rm -f scripts/results/*.jsonl
docker exec seo-static-redis redis-cli FLUSHDB > /dev/null

# 3. Sync env files
cp .env seo-backend/.env
cp .env scripts/.env

# 4. Boot backend
(cd seo-backend && npx tsx src/index.ts > /tmp/backend.log 2>&1 &)
sleep 6

# 5. Start monitor
MON="$ROOT/scripts/results/monitor-$N.csv"
mkdir -p "$ROOT/scripts/results"
rm -f "$MON"
(cd scripts && ./monitor.sh "$MON" 1 > /dev/null 2>&1 &)
sleep 2

cd scripts

# 6. Seed
T_SEED_START=$(date +%s)
npx tsx seed-pages.ts $N 2>&1 | tail -1
T_SEED_END=$(date +%s)

# 7. Render-all
T_RENDER_START=$(date +%s)
npx tsx trigger-render.ts 2>&1 | tail -1
T_RENDER_END=$(date +%s)

# 8. Regen sitemap
curl -s -X POST http://localhost:4001/api/admin/seo/sitemap/regen -H 'content-type: application/json' -d '{}' > /dev/null
T_SITEMAP_START=$(date +%s)
sleep 60
T_SITEMAP_END=$(date +%s)

# 9. Probe S3 GET latency
T_PROBE_START=$(date +%s)
npx tsx probe-s3.ts 100 2>&1 | tail -1
T_PROBE_END=$(date +%s)

# 10. Measure bucket
npx tsx measure-bucket.ts 2>&1 | tail -1

# 11. Mongo stats
mongosh --port 27019 zintlr_seo_static --quiet --eval "var s=db.pages.stats({scale:1024*1024}); print('MONGO_RESULT ' + JSON.stringify({count:s.count, storageSize_MB:Math.round(s.storageSize*10)/10, totalIndexSize_MB:Math.round(s.totalIndexSize*10)/10, totalSize_MB:Math.round(s.totalSize*10)/10}))"

# 12. Stop monitor
pkill -f "monitor.sh" 2>/dev/null || true
sleep 1

# 13. Per-phase peaks
echo ""
echo "=== PEAKS (scale=$N) ==="
echo "--- SEED ---" ; ./peak.sh $T_SEED_START $T_SEED_END "$MON"
echo "--- RENDER ---" ; ./peak.sh $T_RENDER_START $T_RENDER_END "$MON"
echo "--- SITEMAP REGEN ---" ; ./peak.sh $T_SITEMAP_START $T_SITEMAP_END "$MON"
echo "--- PROBE ---" ; ./peak.sh $T_PROBE_START $T_PROBE_END "$MON"

# 14. Save timestamps
cat > "$ROOT/scripts/results/phases-$N.txt" <<EOF
T_SEED_START=$T_SEED_START
T_SEED_END=$T_SEED_END
T_RENDER_START=$T_RENDER_START
T_RENDER_END=$T_RENDER_END
T_SITEMAP_START=$T_SITEMAP_START
T_SITEMAP_END=$T_SITEMAP_END
T_PROBE_START=$T_PROBE_START
T_PROBE_END=$T_PROBE_END
EOF

# 15. Stop backend
lsof -ti:4001 | xargs kill -9 2>/dev/null || true
echo ""
echo "DONE scale=$N monitor=$MON"
