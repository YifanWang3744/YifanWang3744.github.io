# Yifan Wang — Portfolio

A static, two-page portfolio inspired by Dennis Snellenberg’s typography,
spacing, and motion, with Yifan’s own professional content. No build step,
package installation, external fonts, or runtime libraries are required.

## Local preview

From the repository root:

```sh
python3 -m http.server 8765 --bind 127.0.0.1
```

Open [the local preview](http://127.0.0.1:8765). Use an HTTP server rather than
opening the HTML directly from disk.

## Files and behavior

- `index.html`: About me page, retaining Hero, About, Experience & Education, Projects, Skills, Contact.
- `what-i-build/index.html`: What I build page, with an editorial introduction,
  three capability columns, and Contact.
- `dist/page-transitions.js`: Same-origin native page navigation with a curved
  black curtain, destination title, and incoming page motion.
- `dist/portfolio.css`: Layout, responsive styles, curves, transitions, and
  `prefers-reduced-motion` behavior; fonts use the system sans-serif stack.
- `dist/portfolio.js`: Multilingual intro (including 你好), moving name,
  scroll reveals, a scroll-fading section rail, and a small contact-button effect.
- `dist/projects.html`, `experience.html`, `skills.html`, `photography.html`:
  Compatibility redirects with ordinary fallback links.
- `_config.yml`: Excludes planning notes, packaging tools, and unused legacy
  source files from the existing GitHub Pages Jekyll build.

Projects show their original full descriptions and GitHub links even when collapsed. The technology stack uses native `details`/`summary`, so it works without JavaScript. The +/− indicator distinguishes expansion from external links.
The multilingual intro plays on a fresh About me load, can be skipped with Escape,
and has an independent four-second cleanup timer. Its second greeting is 你好.
What I build uses a short page-title intro. Transitions between the two pages
skip the greetings, and native links remain functional without JavaScript.
Reduced motion bypasses the transition, and browser Back/Forward restores
the page without leaving an overlay or inert content.
The right-side rail uses centered short marks, with a longer bold current mark.
On screens up to 700px wide, the rail is hidden and About me sections use
20px left and right padding instead of reserving space for the rail.
Hovering or focusing any mark replaces it with the section name; the current
section name uses the same regular weight. Links
jump directly and transfer keyboard focus to the destination. Initial
hash links remain at their destination after the intro. Reduced-motion preferences show
a short “Hello · 你好” greeting and static content.

The old compiled Tailwind files and scripts are preserved for reference but
are no longer loaded. Additional user styles and the resume are preserved in
the repository; the current pages do not load these styles or link to the resume.

## Photography and public assets

The sea-side `dist/assets/Avatar.png` is the approved Hero background. The
other 34 photography files remain local with exact `.gitignore` rules.
Project screenshots and the favicon remain tracked. The old photography URL
redirects to the home page. The name scrolls in one direction at twice its
previous base speed. Its reduced type scale uses 11vw on desktop and 27.6vw (92–120px) on mobile,
with normal letter spacing. The bottom-left Scroll to explore link is removed. The Hero location badge and rotating globe are restored. The profession arrow is restored above the role text; the Pause motion control
remains removed.
The top navigation contains About me and What I build. Within About me,
page sections place About and Experience before Projects.
Both pages share a decorative comet indicator: hovering or focusing a navigation
link moves the current-page dot with a short fading tail and a soft spring finish.
Leaving the navigation returns the dot to the current page. Native links stay
functional, and reduced motion uses an immediate dot update without a trail.
The spring runs only while moving and stops when the navigation leaves the viewport.
The Hero subtitle is “Backend-focused · Distributed systems”.
Hovering, focusing, or tapping the Hero location badge plays a decorative UFO flyby.
Its continuous path joins entry, one orbit, and departure with matching tangents
and distance-based movement. Repeated triggers do not restart a flight in progress.
The effect scales with the globe, stops outside the viewport or in a hidden tab,
and is skipped when reduced motion is requested.

For an explicit public-only package:

```sh
python3 scripts/package_site.py
```

This writes `outputs/site/` using an explicit public-file allowlist, plus
`.nojekyll`. It includes only the approved Avatar photo and never copies the other photos,
the local resume, internal notes,
or unused styles. The script only replaces its own generated output folder.
Do not upload the raw working directory: `.gitignore` controls Git tracking,
not arbitrary upload tools.

## Deployment

The configured remote is `YifanWang3744/YifanWang3744.github.io`, with `main`
as the publishing branch in the observed `pages build and deployment`
records. This redesign keeps `index.html` at the root and uses relative
asset paths. No new hosting service or workflow is introduced. Detailed
Pages settings were not readable from the signed-out browser during
implementation; verify the deployed commit through the existing Pages run.

After pushing the intended commit to `main`, wait for GitHub’s existing
Pages deployment, check the [live portfolio](https://yifanwang3744.github.io/),
and confirm the removed photographs are absent from the current branch and
the new deployment. Historical Git commits are not rewritten.

## Verification

```sh
node --check dist/portfolio.js
git diff --check
python3 scripts/package_site.py
```

Browser checks cover desktop (1440×900), tablet (768×1024), and mobile
(390×844), the complete intro and Chinese greeting, keyboard project
disclosures, page navigation and Escape, hash navigation, old URL redirects,
clipboard feedback, and missing-script fallbacks. The reduced-motion branch was
also checked using a temporary local response fixture; this is distinct
from an independent operating-system preference test.

See `outputs/portfolio-redesign-validation.md` for evidence, limitations,
and release status. Validation screenshots and the packaging output remain
local and are ignored by Git.

The restored brand slides from “Code by Yifan” to “Yifan Wang” on hover or
keyboard focus. The Hero subtitle fits the title width at each viewport size.
Experience dates share one column and a larger font. More work on GitHub
opens the profile. The footer uses a shrinking elliptical boundary and
bottom-anchored desktop parallax; reduced-motion preferences
show the contact content without movement. Contact links use labeled rows.

The About summary uses two balanced desktop lines with natural word spacing,
and wraps naturally on mobile. The contact-method
grid matches the width of “Let’s build something”; version metadata is centered
on the page. The old modal menu and circular menu button have been removed.

Every intro greeting uses the same 240ms duration. Section rail marks reveal regular-weight labels on hover; individual links fade over 60px as they cross
white-section boundaries and remain hidden over Home/Contact. Chromium and
ControlMaestro stack compactly inside the right-side work-content column.

Reloading resets the page to Home and clears the old section hash; direct
section URLs still work on a fresh navigation. Browser scroll restoration
is managed explicitly. Work platform descriptions now stack with 20px between
them. The selected date/content layout uses roughly a 1:2 ratio with 20px
dates and 16px locations on desktop. Muted platform descriptions sit on the line below their names. Chromium has two concise bullets,
including the selected backend-infrastructure summary. Navigation rows are
18px apart, with 6px inactive marks and 10px centered active marks.

The What I build illustration uses five original transparent PNG layers downloaded
from the ControlMaestro Titanium product page, rather than a screenshot. Panels
flatten and expand on hover (1.3s), reset on exit (.8s), and the main panel follows
horizontal pointer movement by up to 7px. The landscape mask clips the whole
layered scene as it moves during scrolling, independently of hover transforms.
Reduced-motion preferences keep the illustration static. About me retains the
sea-side Avatar background.

Both pages provide Open Graph and Twitter sharing metadata, with a shared
1200×630 sea-side preview image and a separate canonical URL for each page.
The tab title remains “Yifan Wang · Software Engineer” on both pages.
The Hero uses responsive WebP versions of the approved photo with a PNG
fallback. The Titanium main panel uses transparent responsive WebP versions;
the other original PNG layers are retained. The public-file package includes
these assets. Mobile Hero subtitles use readable 14px text with natural wrapping.

Motion reads layout before writing styles, caches its element references, and
only maintains a continuous animation loop while the moving name or Titanium
scene is near the viewport. Scrolling resumes the loop. Globe rotation pauses
outside the viewport; reduced-motion behavior remains available.

The current polishing changes are local only. See
`outputs/portfolio-polish-validation-2026-10-04.md` for the latest validation.

On screens up to 700px wide, the About me Hero uses 85svh with a 560px
minimum for compact phones. The mobile photo crops more sky, the location
badge is smaller, and the larger moving name sits closer to the profession.
Desktop Hero proportions remain unchanged.
