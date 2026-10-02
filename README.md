# Yifan Wang — Portfolio

A static, single-page portfolio inspired by Dennis Snellenberg’s typography,
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

- `index.html`: Hero, About, Projects, Experience & Education, Skills, Contact.
- `dist/portfolio.css`: Layout, responsive styles, curves, transitions, and
  `prefers-reduced-motion` behavior; fonts use the system sans-serif stack.
- `dist/portfolio.js`: Multilingual intro (including 你好), moving name,
  scroll reveals, native modal navigation, and a small contact-button effect.
- `dist/projects.html`, `experience.html`, `skills.html`, `photography.html`:
  Compatibility redirects with ordinary fallback links.
- `_config.yml`: Excludes planning notes, packaging tools, and unused legacy
  source files from the existing GitHub Pages Jekyll build.

Projects use native `details`/`summary`, so they work without JavaScript.
The intro plays on a full page load, can be skipped with Escape or its button,
and has an independent four-second cleanup timer. The menu supports Escape,
backdrop dismissal, keyboard focus containment, and return focus. Initial
hash links remain at their destination after the intro. Use **Pause motion**
to stop the moving name and scroll effects; reduced-motion preferences show
a short “Hello · 你好” greeting and static content.

The old compiled Tailwind files and scripts are preserved for reference but
are no longer loaded. Existing untracked user styles and the local resume
have not been overwritten or added to the new site.

## Photography and public assets

The 35 photography files listed in `outputs/portfolio-redesign-plan.md` stay
on disk, are removed from the Git index, and have exact `.gitignore` rules.
Project screenshots and the favicon remain tracked. Photography is not used
by any page, including the Hero and the old photography URL.

For an explicit public-only package:

```sh
python3 scripts/package_site.py
```

This writes `outputs/site/` using an allowlist of 11 public files, plus
`.nojekyll`. It never copies photography, the local resume, internal notes,
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
disclosures, menu focus and Escape, hash navigation, old URL redirects,
pause/resume, and missing-script fallbacks. The reduced-motion branch was
also checked using a temporary local response fixture; this is distinct
from an independent operating-system preference test.

See `outputs/portfolio-redesign-validation.md` for evidence, limitations,
and release status. Validation screenshots and the packaging output remain
local and are ignored by Git.
