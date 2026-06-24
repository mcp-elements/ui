#!/usr/bin/env bash
# Voiceover for the mcp-elements product demo via Amazon Polly (generative engine).
# Script is written to be SPOKEN, not read: contractions, short sentences, and
# em-dashes / ellipses for natural human pacing (generative engine ignores SSML).
# Requires: aws CLI (polly:SynthesizeSpeech), ffmpeg.
# Swap voice: VOICE=Matthew bash narrate-polly.sh
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="${1:-$HERE/out/audio}"
VOICE="${VOICE:-Ruth}"
ENGINE="${ENGINE:-generative}"
GAP="${GAP:-0.45}"
mkdir -p "$OUT"

LINES=(
  "01-hook|Okay — if you've ever built an MCP host, you know the pain. Every single one rebuilds the same trust UI from scratch."
  "02-primitives|Consent dialogs. Tool-call cards. Scope inspectors. Schema-driven forms. mcp-elements ships all of them — the trust and execution pieces every other stack makes you hand-assemble."
  "03-demo|Here's a tool call running live… idle, to running, to done — with the result right there. An OAuth consent dialog, with every scope spelled out in plain English. And the whole thing re-themes in a single click."
  "04-own|Thirty-eight components. React, Angular, or Vue — same primitives, one design system. And it's copy-paste: the code lands in your repo. You own it. No black box. No lock-in."
  "05-cta|So… npx mcp-elements add, and you're building. It's MIT, and it's on npm today. mcp-elements dot dev — go build something."
)

echo "voice=$VOICE engine=$ENGINE → $OUT"
silence="$OUT/.gap.m4a"
ffmpeg -y -f lavfi -i "anullsrc=channel_layout=mono:sample_rate=44100" -t "$GAP" -c:a aac "$silence" -loglevel error
concat="$OUT/.concat.txt"; : > "$concat"

for entry in "${LINES[@]}"; do
  name="${entry%%|*}"; text="${entry#*|}"
  mp3="$OUT/$name.mp3"; m4a="$OUT/$name.m4a"
  aws polly synthesize-speech --engine "$ENGINE" --voice-id "$VOICE" \
    --output-format mp3 --text "$text" "$mp3" >/dev/null
  ffmpeg -y -i "$mp3" -ac 1 -ar 44100 -c:a aac "$m4a" -loglevel error
  rm -f "$mp3"
  dur=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$m4a")
  printf "  %-12s %5.1fs  %s…\n" "$name" "$dur" "$(echo "$text" | cut -c1-44)"
  echo "file '$m4a'" >> "$concat"; echo "file '$silence'" >> "$concat"
done

ffmpeg -y -f concat -safe 0 -i "$concat" -c copy "$OUT/narration.m4a" -loglevel error
total=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/narration.m4a")
rm -f "$concat" "$silence"
printf "\n✓ narration.m4a  %.1fs (voice=%s)\n" "$total" "$VOICE"
