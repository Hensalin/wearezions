# We Are Zion: SIGNAL-style cinematic site

Static site (HTML5, CSS3, vanilla JS, GSAP + ScrollTrigger, Lenis, Bootstrap Icons). No build step.
Layout, type and motion follow the SIGNAL reference (signalfest.framer.website); all content comes from wearezion.co.

## Run locally

```bash
cd we-are-zion-website
python -m http.server 8080
# open http://localhost:8080
```
Internet is needed for GSAP, Lenis, fonts, icons, and the hotlinked We Are Zion images and video.

## Hero video
The hero uses the 1080p video currently playing on wearezion.co, linked directly from its Wix video host
(see `<source>` in `index.html`, `#heroVideo`). To use a local file instead, put it in `assets/videos/` and change that `src`.

## Reels and video gallery
`js/reels-data.js` drives the gallery. It currently lists the real YouTube films from wearezion.co "Creatives".
wearezion.co does not expose Instagram reel URLs or files, so add real ones there (instructions in the file):
`{ type:'instagram', code:'...' }` or `{ type:'mp4', src:'assets/videos/reel.mp4', poster:'...' }`.

## Structure
- `index.html`: markup and content
- `css/style.css`: tokens, layout, responsive, reduced-motion
- `js/script.js`: Lenis, GSAP choreography, drag belt, reels player, Bible plans, countdown
- `js/reels-data.js`: reels list
- `_original/`: the previous version of index.html, style.css, script.js
- `_to_delete/`: leftover temp files, safe to delete

## Notes
- Fonts and palette follow SIGNAL (Anton, Be Vietnam Pro, Fragment Mono; paper, ink, red #ff1f2d). Change them in `:root`.
- The countdown targets the next Sunday 09:30 AM IST (the Main service time on wearezion.co).
- `prefers-reduced-motion` disables Lenis and GSAP and shows a static layout.
