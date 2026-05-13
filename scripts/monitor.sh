#!/usr/bin/env bash
# Sample CPU + RSS for backend (host) + mongo/redis/floci (docker).
OUT=${1:-/tmp/monitor.csv}
INTERVAL=${2:-1}
echo "ts,role,pid,pct_cpu,rss_mb" > "$OUT"

while true; do
  TS=$(date +%s)
  PID=$(lsof -ti:4001 | head -1)
  if [ -n "$PID" ]; then
    LINE=$(ps -p $PID -o %cpu=,rss= 2>/dev/null | awk -v t=$TS -v p=$PID '{printf "%s,backend,%s,%s,%.1f\n", t, p, $1, $2/1024}')
    [ -n "$LINE" ] && echo "$LINE" >> "$OUT"
  fi
  if (( TS % 2 == 0 )); then
    STATS=$(docker stats seo-static-mongo seo-static-redis seo-static-floci --no-stream --format '{{.Name}},{{.CPUPerc}},{{.MemUsage}}' 2>/dev/null)
    while IFS= read -r line; do
      NAME=$(echo "$line" | cut -d',' -f1)
      CPU=$(echo "$line" | cut -d',' -f2 | tr -d '%')
      MEM_RAW=$(echo "$line" | cut -d',' -f3 | awk '{print $1}')
      MEM_MB=$(echo "$MEM_RAW" | awk '/GiB/  { gsub("GiB",""); print $1 * 1024.0; next } /MiB/  { gsub("MiB",""); print $1; next } /KiB/  { gsub("KiB",""); print $1 / 1024.0; next } { print $1 }')
      ROLE=${NAME#seo-static-}
      [ -n "$NAME" ] && echo "$TS,$ROLE,$NAME,$CPU,$MEM_MB" >> "$OUT"
    done <<< "$STATS"
  fi
  sleep $INTERVAL
done
