---
name: Hero carousel overlay positioning
description: Why the hero carousel's prev/next arrows are top-anchored instead of vertically centered
---

The homepage `HeroCarousel` (`artifacts/omniqure/src/pages/HomePage.tsx`) has one slide (`HeroContentSlide`) whose headline/CTA text is bottom-anchored (`alignItems: flex-end`) and spans nearly the full carousel width on narrow viewports, since the arrow buttons' edge offset (~10-14px) is close to the text container's own horizontal padding.

**Why:** vertically-centered (`top: 50%`) arrows collided with that bottom-anchored text on mobile/tablet widths, since there wasn't enough horizontal gap between the arrow and text start at those breakpoints. Moving arrows vertically doesn't fix a horizontal (x-axis) overlap unless it moves them out of the text's y-band entirely.

**How to apply:** the arrows are now pinned to the top corners (`top: 10px`, no vertical centering) via the `.hero-carousel-arrow` class in `index.css`, keeping them clear of the bottom-anchored text on every breakpoint regardless of horizontal spacing. The dots row also got extra bottom clearance (`.hero-carousel-dots`) to avoid touching the CTA button beneath it. If more slides are added to this carousel, keep any slide-specific text bottom-anchored (not top/center) so it doesn't collide with the top-pinned arrows.

**Image-aspect trap:** the marketing image/video slides (referral, bundle, video) are baked ultra-wide ~21:9 assets, but `.hero-carousel` forces `min-height: 380px` on mobile which fights its own `aspect-ratio: 16/9`, producing a near-square box. `object-fit: cover` on a near-square box with a 21:9 asset crops/zooms in dramatically, cutting off baked-in text (looked "blown up"/zoomed on mobile). Fixed by using `object-fit: contain` for these image/video slides so the full asset always stays visible (letterboxed with the slide's brand background color) regardless of container aspect — never use `cover` for slides with baked-in text/graphics at a fixed aspect ratio different from the carousel container.
