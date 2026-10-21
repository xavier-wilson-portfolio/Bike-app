# Revora video kit

Everything used to make Revora's social videos. `bash marketing/video-kit/setup.sh` rebuilds the workspace
under /home/claude (Playwright, app build, frames, logo outro frames).

- `vid/` app screen recordings. `sc/s0..s5.mp4` are 1080x1920 recordings (s0 home, s1 service log, s2 reminders,
  s3 parts deck swipes, s4 photo scan, s5 shopping list). `record.js` / `rec_home.js` re-record them from the
  local build (port 8766) with demo data from `seed.js`. `sfx4.py` holds the foley functions (tap, swipe, hit).
- `film/` calm product film: app in a phone on navy, 3D slide transitions, small labels. Timed to a voiceover.
- `edit/` super edit 1: glitch/RGB split, whip pans, punch zooms, word slams (110 BPM).
- `edit2/` super edit 2: geometric transitions (cube, iris, strips, diagonal, zoom, spin, split, flip, push),
  kinetic word cards, 2x2 grid. `sfx/sfx.py` builds the matching sound effects from the timeline.
- `logoanim/` the approved main outro (append to every video). Renders transparent PNG frames to `out/`.

Each template exposes `render(t)`; `render.js` screenshots every frame, then ffmpeg assembles, appends the
outro and muxes audio. Copy a template to a new folder and change the shot list / words for new videos.
