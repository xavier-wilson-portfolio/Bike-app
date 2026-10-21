#!/bin/bash
# Recreates the Revora video workspace in a fresh session. Run: bash marketing/video-kit/setup.sh
set -e
K=$(cd "$(dirname "$0")" && pwd)
mkdir -p /home/claude/t && cd /home/claude/t
[ -d node_modules/playwright ] || npm i --silent playwright@1.48.2 three@0.147.0 >/dev/null 2>&1
cat > /home/claude/t/env.sh <<'E2'
export HS=$(ls /opt/pw-browsers/chromium_headless_shell-*/*/headless_shell | head -1)
(curl -s -o /dev/null localhost:8766/ || (cd /home/claude/bike-app/public && setsid nohup python3 -m http.server 8766 >/dev/null 2>&1 </dev/null & sleep 1))
E2
pip install -q numpy scipy soundfile --break-system-packages >/dev/null 2>&1 || true
for d in vid film edit edit2 logoanim; do mkdir -p /home/claude/$d && cp -r "$K/$d/." /home/claude/$d/; done
cd /home/claude/bike-app && python3 build/build.py >/dev/null
# frame folders used by the three templates (film = 620px phone screen, edit/edit2 = full 1080)
for s in s0 s1 s3 s4 s5; do
  mkdir -p /home/claude/film/fr/$s /home/claude/edit/fr/$s /home/claude/edit2/fr/$s
  ffmpeg -y -loglevel error -i /home/claude/vid/sc/$s.mp4 -vf "fps=30,scale=620:1102:flags=lanczos" -q:v 2 /home/claude/film/fr/$s/%04d.jpg
  ffmpeg -y -loglevel error -i /home/claude/vid/sc/$s.mp4 -vf fps=30 -q:v 1 -qmin 1 /home/claude/edit2/fr/$s/%04d.jpg
  cp /home/claude/edit2/fr/$s/*.jpg /home/claude/edit/fr/$s/
done
source /home/claude/t/env.sh
cd /home/claude/logoanim && node render.js && echo "kit ready: outro frames $(ls out | wc -l)"
