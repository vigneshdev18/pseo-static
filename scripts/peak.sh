#!/usr/bin/env bash
# Compute CPU + RSS peaks per role between two timestamps.
START=$1
END=$2
CSV=${3:-/tmp/monitor.csv}
echo "role,peak_cpu_pct,peak_rss_mb,avg_cpu_pct,avg_rss_mb,samples"
awk -F, -v s=$START -v e=$END '
NR>1 && $1>=s && $1<=e {
  r=$2; cpu=$4; rss=$5;
  gsub(/MiB/,"",rss); gsub(/%/,"",cpu);
  if (cpu>peakC[r]) peakC[r]=cpu;
  if (rss>peakR[r]) peakR[r]=rss;
  sumC[r]+=cpu; sumR[r]+=rss; n[r]++;
}
END {
  for (r in n) {
    printf "%s,%.1f,%.1f,%.1f,%.1f,%d\n", r, peakC[r], peakR[r], sumC[r]/n[r], sumR[r]/n[r], n[r];
  }
}' "$CSV"
