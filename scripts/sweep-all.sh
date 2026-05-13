#!/usr/bin/env bash
# Drive 3 scales with 5-min cool periods between.
set -e
ROOT=/Users/riyuk/Desktop/Projects/zintlr-seo-static
COOL=${COOL_SECS:-300}
mkdir -p "$ROOT/docs/sweep-runs"

SCALES=(10000 50000 100000)

FIRST=1
for N in "${SCALES[@]}"; do
  if [ $FIRST -eq 0 ]; then
    echo ""
    echo "===== COOL ${COOL}s before scale=$N ====="
    sleep $COOL
  fi
  FIRST=0
  echo ""
  echo "===== RUNNING scale=$N ====="
  LOG="$ROOT/docs/sweep-runs/${N}.log"
  "$ROOT/scripts/run-sweep.sh" $N 2>&1 | tee "$LOG"
done

echo ""
echo "===== ALL SCALES DONE ====="
