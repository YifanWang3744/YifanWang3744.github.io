# Local portfolio polish — 2026-10-04

Implemented the approved audit items 1, 2, 4, 5, and 6. Item 3 was left unchanged. No commit, push, or deployment was performed.

## Changes

- Mobile About me Hero subtitle uses 14px text with natural wrapping. Desktop still fits the profession title width.
- Responsive WebP Hero images at 900, 1600, and 2304px; the original photo and PNG fallback remain intact. The 1600px version is about 83KB versus the original 2.9MB.
- Transparent responsive WebP versions of the Titanium main panel at 640, 1280, and 2084px. The 1280px version is about 134KB versus the original 2.4MB. Other original transparent layers and hover behavior remain intact.
- The full lifecycle opens with “From high-level architecture design to production delivery.” CI/CD remains in the following description, which separates the completed beta delivery from ongoing responsibilities.
- Separate canonical URLs and page-specific Open Graph/Twitter titles and descriptions. Shared 1200×630 JPEG preview uses the approved sea-side photo.
- Removed unused component styles and 76 overridden declarations. Stylesheet reduced from 41,302 to 36,467 bytes. Computed styles compared against the pre-cleanup stylesheet at 1440×900, 768×1024, and 390×844 on both pages: no differences, excluding animated globe geometry.
- Motion element references are cached and layout reads occur before animation writes. Continuous requestAnimationFrame work stops when the moving name and Titanium scene are outside the viewport; scrolling restarts it. Globe rotation pauses outside the viewport.
- Packaging allowlist includes all new public assets. README reflects the current pages and behavior.

## Verification

- JavaScript syntax checks and git diff whitespace checks passed.
- Public-only package contains 25 explicitly allowed files and .nojekyll. It does not package the local resume or internal outputs.
- Local resource references in both pages and CSS resolve; canonical, Open Graph URL, card type, and image dimensions checked.
- All optimized main-panel images retain an RGBA transparent channel. Sharing image is exactly 1200×630.
- Desktop and mobile page views inspected: no horizontal page overflow. Mobile Hero subtitle measured at 14px.
- Desktop build paragraph top aligns with the main Titanium panel, including during hover.
- Keyboard project expansion, rail navigation, two-page transitions, and reload returning to Home checked.
- Offscreen name/scene transforms remain unchanged; visible scene alignment and scroll motion resume.
- Both pages show “Copied” and the small status toast after contact-button activation. Contact icons remain unchanged as requested.
- Build heading retains 900ms first-line and 1800ms later-line durations.
- Forced local JavaScript reduced-motion fixture: intro completes, all content visible, no scene transform or playing title animation. This is not an OS-level reduced-motion test.
- No errors/warnings observed in the checked build-page browser console.

## Local previews and evidence

- http://localhost:8765/
- http://localhost:8765/what-i-build/
- Screenshots: outputs/screenshots/polish-about-mobile.png, polish-build-desktop.png, polish-build-mobile.png.
- Sharing preview: dist/assets/social-preview.jpg.

External social platforms can fetch the new sharing metadata only after these local changes are eventually published. No Safari/Firefox-specific regression run was performed.

## Mobile Hero proportion update

- Scoped to max-width:700px, affecting only the About me Hero.
- Hero 85svh (minimum 560px), tighter photo crop, smaller location badge,
  approximately 15% larger moving name, and reduced spacing to the role.
- Desktop 1440×900 computed Hero styles match the before-change baseline exactly.
- Mobile 320×568, 375×667, 390×844, and 412×915 checked with no horizontal overflow or overlapping Hero elements.
- Local screenshot: outputs/screenshots/mobile-hero-proportions.png.
- Changes remain local only.
