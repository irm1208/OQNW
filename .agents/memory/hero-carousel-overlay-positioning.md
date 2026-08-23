---
name: Hero carousel letterbox color matching
description: How the hero carousel's mobile letterbox bars are colored to blend with each slide's own image, and why a single shared background doesn't work
---

The homepage `HeroCarousel` (`artifacts/omniqure/src/pages/HomePage.tsx`) renders 4 slides (content, referral, bundle, video) inside a shared `.hero-carousel` box (`index.css`). All slide assets are ultra-wide (~21:9) and use `object-fit: contain` so they're never cropped. On mobile the box is intentionally slightly taller (16:9) than the images' native ratio, which produces small top/bottom letterbox bars — the box matches the image ratio exactly (21:9) from `min-width: 768px` up, so no letterbox appears there.

**Why per-slide background colors matter:** each slide's image has a different edge/background color baked in (e.g. the content-slide lab photo is medium blue, the referral/bundle photos are near-white/light gray). A single shared background color (e.g. one brand navy) only blends seamlessly with whichever slide happens to match it — on the others the letterbox bars show up as a visibly mismatched colored strip against the image edge.

**How to apply:** each slide's own container background (not a shared `.hero-section`/`.hero-carousel` rule) is set to a `linear-gradient(to bottom, <topEdgeColor>, <bottomEdgeColor>)` sampled directly from that image's actual top and bottom edge pixels (average color of a thin strip, not just a single corner pixel — sample with an image tool like `magick <file> -gravity North -crop <w>x30+0+0 +repage -resize 1x1 txt:-`). Do not put a `!important` background override on a shared class like `.hero-section` — it will silently clobber every slide's per-image gradient with one fixed color. If a new slide/asset is added to this carousel, sample its own top/bottom edge colors the same way rather than reusing another slide's gradient.
