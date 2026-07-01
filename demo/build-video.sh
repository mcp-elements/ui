#!/usr/bin/env bash
# Assemble the mcp-elements product demo from its parts. Requires: ffmpeg.
# Scenes (timed to the VO segments in out/audio/):
#   A title card → B UI montage (crossfades) → C "real components" reveal → D end card
# Produces out/mcp-elements-demo.mp4.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT="$HERE/out"; A_DIR="$OUT/audio"; F="$OUT"; W="$(mktemp -d)"
ENC=(-c:v libx264 -pix_fmt yuv420p -r 30 -preset medium)
GAP=0.45
dur(){ ffprobe -v error -show_entries format=duration -of csv=p=0 "$1"; }

A=$(echo "$(dur "$A_DIR/01-hook.m4a") + $GAP" | bc)
B=$(echo "$(dur "$A_DIR/02-primitives.m4a") + $GAP + $(dur "$A_DIR/03-demo.m4a") + $GAP" | bc)
C=$(echo "$(dur "$A_DIR/04-own.m4a") + $GAP" | bc)
D=$(echo "$(dur "$A_DIR/05-cta.m4a") + $GAP" | bc)
printf "scenes  A=%.2f  B=%.2f  C=%.2f  D=%.2f\n" "$A" "$B" "$C" "$D"

# --- Scene A: title card ---
ffmpeg -y -loop 1 -i "$F/card-title.png" -t "$A" \
  -vf "scale=1280:720,fade=t=in:st=0:d=0.5,fade=t=out:st=$(echo "$A-0.5"|bc):d=0.5" "${ENC[@]}" -an "$W/A.mp4" -loglevel error

# --- Scene B: 4-frame crossfade montage with slow zoom ---
X=0.6; N=4
d=$(echo "scale=4; ($B + ($N-1)*$X)/$N" | bc)          # per-clip length
# Light, fast motion: gentle scale-in via the eval'd scale filter (no high-res zoompan).
zp="format=yuv420p,fps=30,scale=1280:720,zoompan=z='min(zoom+0.0009,1.10)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=30,setsar=1"
o1=$(echo "1*($d-$X)"|bc); o2=$(echo "2*($d-$X)"|bc); o3=$(echo "3*($d-$X)"|bc)
ffmpeg -y \
  -loop 1 -t "$d" -i "$F/shot-hero.png" \
  -loop 1 -t "$d" -i "$F/shot-mcp2.png" \
  -loop 1 -t "$d" -i "$F/shot-toolcall.png" \
  -loop 1 -t "$d" -i "$F/shot-consent2.png" \
  -filter_complex "\
[0:v]$zp[v0];[1:v]$zp[v1];[2:v]$zp[v2];[3:v]$zp[v3];\
[v0][v1]xfade=transition=fade:duration=$X:offset=$o1[x1];\
[x1][v2]xfade=transition=fade:duration=$X:offset=$o2[x2];\
[x2][v3]xfade=transition=fade:duration=$X:offset=$o3,fade=t=in:st=0:d=0.4[vb]" \
  -map "[vb]" "${ENC[@]}" -an "$W/B.mp4" -loglevel error

# --- Scene C: "real components" reveal (slow zoom on the playground frame) ---
ffmpeg -y -loop 1 -t "$C" -i "$F/shot-play.png" \
  -vf "format=yuv420p,fps=30,scale=1280:720,zoompan=z='min(zoom+0.0007,1.09)':d=1:x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':s=1280x720:fps=30,setsar=1,fade=t=in:st=0:d=0.5,fade=t=out:st=$(echo "$C-0.5"|bc):d=0.5" \
  "${ENC[@]}" -an "$W/C.mp4" -loglevel error

# --- Scene D: end card ---
ffmpeg -y -loop 1 -i "$F/card-end.png" -t "$D" \
  -vf "scale=1280:720,fade=t=in:st=0:d=0.5,fade=t=out:st=$(echo "$D-0.6"|bc):d=0.6" "${ENC[@]}" -an "$W/D.mp4" -loglevel error

# --- Concat + mux narration ---
printf "file '%s/A.mp4'\nfile '%s/B.mp4'\nfile '%s/C.mp4'\nfile '%s/D.mp4'\n" "$W" "$W" "$W" "$W" > "$W/list.txt"
ffmpeg -y -f concat -safe 0 -i "$W/list.txt" "${ENC[@]}" "$W/video.mp4" -loglevel error
ffmpeg -y -i "$W/video.mp4" -i "$A_DIR/narration.m4a" \
  -map 0:v -map 1:a -c:v copy -c:a aac -movflags faststart -shortest "$OUT/mcp-elements-demo.mp4" -loglevel error
rm -rf "$W"
printf "✓ mcp-elements-demo.mp4  %.1fs → %s\n" "$(dur "$OUT/mcp-elements-demo.mp4")" "$OUT"
