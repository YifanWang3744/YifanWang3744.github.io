# Portfolio follow-up — 2026-10-03

Implemented all 11 requested updates:
1. Hero displays Software Engineer only.
2. Globe rotates automatically, with shared pause and reduced-motion support.
3. Name marquee moves in one direction; base speed doubled (.028 → .056).
4. Original sea-side Avatar.png restored as Hero background, without modifying the image.
5. About text replaced with the supplied summary and three bullets.
6. Elutions replaced with the supplied Chromium and ControlMaestro descriptions.
7. Columbia coursework remains on one line; narrow screens scroll the course list locally.
8. Skills heading: from backend development to infrastructure.
9. All tools have a small bullet.
10. Phone display omits +1; dialing link retains the international format.
11. Footer location removed.

Validation:
- JavaScript syntax and git diff whitespace checks passed.
- Public package: 12 approved files plus .nojekyll; Avatar byte-for-byte preserved.
- Browser checked at 1440 × 900 and 390 × 844: no page horizontal overflow.
- Desktop course list fits in one line; mobile course list is a local scroll container.
- Globe animation observed running and paused through the existing toggle.
- Marquee transform progressed left on downward and upward page scrolling.
- About and Elutions text inspected visually and through the accessibility tree.

Commit: 881db5e91d491c46c976ce877fbc46b031735f3b
Pages run: https://github.com/YifanWang3744/YifanWang3744.github.io/actions/runs/37142407298
Deployment verification: GitHub Pages run completed successfully for the exact commit. Live browser confirmed the restored image, rotating globe, new About text, Software Engineer title, phone display, and removed footer location. Screenshot: outputs/screenshots/2026-10-03-live-hero.png.

## Second follow-up

- Inspected Dennis Snellenberg’s live globe through the browser: 2.7s phased longitude bands and 5.4s gentle +/-15 degree axis tilt. Implemented the same visual mechanism with shared pause and reduced-motion support.
- Added user-selected subtitle: Backend-focused · Distributed systems.
- Removed Code by Yifan and the three About bullets. Centered summary and My experience button on a shared axis.
- Reworked Elutions into a full-width job header and two platform columns with separate titles/subtitles and horizontal dividers; mobile stacks the platforms.
- About → Experience → Projects → Contact in both navigation variants. Experience section now precedes Projects.
- Browser checks at 1280x720 and 390x844: no horizontal page overflow; platform columns stack on mobile; intro skip focuses the menu correctly after removing the brand link; console reported no errors; globe pauses with the existing motion toggle.
- Syntax, whitespace checks and explicit public package passed.
- Commit: 5f92c01a63e18a02afd45ef22a94a09c882417ab
- Pages run: https://github.com/YifanWang3744/YifanWang3744.github.io/actions/runs/37144432070
- Deployment succeeded for the exact commit; live DOM confirmed subtitle, removed brand, globe mechanism, navigation and section order. Live experience screenshot: outputs/screenshots/2026-10-03-live-experience-layout.png.

## Third follow-up

- Restored Code by Yifan with sliding code/name text and a rotating copyright mark; hover/focus shows Yifan Wang. Reference inspected in the live DOM.
- Fitted Hero subtitle to the Software Engineer width using measured font size, preserving glyph proportions. Desktop widths 233.40/233.38 px; mobile 178.46/178.39 px.
- About summary left aligned; removed The journey so far.
- Elutions follows the education grid with date/location left and stacked work content right. All date/location text: 16px desktop, 14px mobile.
- Replaced project hint with a centered outlined More work on GitHub link to the user profile.
- Removed contact title arrow. Reproduced the reference’s shrinking ellipse and bottom-anchored footer parallax (desktop speed -4; horizontal button speed -1). Motion respects pause/reduced-motion settings; mobile retains the curved boundary without desktop parallax, as in the reference.
- Contact methods use labels, direction icons, larger text and fine rules; two columns on desktop, stacked on mobile.
- Checked 1280x720 and 390x844: no page overflow. Hover visibly shows Yifan Wang. Footer observed mid-scroll at -124px then 0px at the bottom; curve shrinks to 0px.
- Commit a6aa4ed1f31af6842cb578e29abf76212b011a48 deployed successfully through Pages run 37145511703. Live browser confirmed brand, equal title/subtitle widths, missing journey label, GitHub link, 16px experience metadata and updated contact section. Screenshot: outputs/screenshots/2026-10-03-live-contact-redesign.png. Pause check and console check passed.

## Fourth follow-up

- Intro sequence now starts Hello → 你好 → Bonjour.
- Fade out the departing Code by text completely during the brand slide, removing the clipped glyph beside ©. Browser confirmed Code by opacity 0 on hover and a clean Yifan Wang display.
- Shortened About summary into three balanced lines preserving experience, backend/distributed systems and C#/.NET/C++/React. Lines use equal widths with justified spacing and fit available width. Desktop lines 304.99px each; 390px viewport lines 271px each.
- Contact links retain the label/rule design at a smaller size, matching the measured title-first-line width (693.19px desktop; 227.97px mobile).
- Version metadata centered on the viewport: desktop center 632.5px / page center 632.5px; mobile 187.5px / 187.5px.
- Replaced modal menu/button with a permanent labeled rail: Home, About, Experience, Projects, Skills, Contact. All six jumps and highlights verified. Manual scrolling from Skills to Contact updates the current section. Links transfer keyboard focus to the section.
- Checked desktop 1280x720 and mobile 390x844 and 320x740; no horizontal page overflow or navigation overlap. Console check clean.
- Fresh-load browser timing check observed Hello, then 你好 after 450ms; Skip intro still focuses the brand.
- Commit: 833c2e8f370ecfc2ff0bb6251ea9b7d0b9d97c61. Pages run: https://github.com/YifanWang3744/YifanWang3744.github.io/actions/runs/37146679715.
- Deployment succeeded for the exact commit; live browser verified the new summary, rail, absent menu button, equal contact/title widths and centered version. Screenshot: outputs/screenshots/2026-10-03-live-section-rail-contact.png.

## Fifth follow-up

- All nine intro greeting slots now use one shared 240ms duration; 你好 remains second.
- Rail is hidden on Home and Contact. Individual items fade over a 60px interval as their midpoint crosses the white-content boundaries. Observed at scrollY 320: opacities 0, 0, 0, 0, .283333, .916667; all 1 in About; all 0 in Contact. Marks are left of left-aligned labels.
- About summary uses two naturally spaced desktop lines, each 504.27px wide. Word spacing is 0px; small font-size fitting equalizes their endpoints (16.31px/16px). Mobile wraps naturally at 15px without squeezing into two unreadable lines.
- Chromium and ControlMaestro share two columns within the right content area. Chromium left 480.22px equals Elutions left; ControlMaestro right 1120px equals the row boundary. Mobile stacks the platforms.
- Desktop/mobile checked; no page overflow; console check clean; JavaScript syntax and whitespace checks passed.
- Final greeting visibility ends when the curtain starts exiting, so the exit does not extend its duration. Browser at 2250ms confirmed intro is-leaving and greeting visibility hidden. Final commit: 8c7f7d5a138af9553b69b7c336edce6083dffffb (includes c1d7967). Pages run: https://github.com/YifanWang3744/YifanWang3744.github.io/actions/runs/37147878117.
- Final Pages deployment succeeded for 8c7f7d5. Live verified Home/Contact rail opacities all 0; About lines both 504.27px with word spacing 0px; platform columns rendered as intended. Screenshot: outputs/screenshots/2026-10-03-live-right-platform-columns.png.

## Sixth follow-up

- Refresh resets Home: browser scroll restoration set to manual; reload clears the old hash; intro completion resets top when no initial deep link. Browser verified Experience before reload at hash #experience/scrollY1185, then empty hash/scrollY0. Direct section navigation is preserved.
- Platform descriptions stack again with a compact 20px gap, 12px list margin and 10px between bullets.
- Navigation labels hidden by default. Marks are 8px/2px inactive and 24px/3px active, extending symmetrically around shared center x1195. Inactive About hovered while Experience remains current: label opacity1/font-weight400, mark opacity0.
- Date/content layout choices offered: strengthen left column (recommended), 40/60 balance, or move company/school titles into left column. User selection pending; existing column ratio preserved.
- Commit 87d4b27ed60ab6f6edf465d88ea025dfca65e735 deployed successfully (Pages run 37148813784). Live reload verified #experience/scrollY1185 → empty hash/scrollY0. Live stack gap20px and marks8/24px confirmed. Screenshot: outputs/screenshots/2026-10-03-live-compact-stack-mark-nav.png.

## Seventh follow-up

- Selected layout 1: stronger date/location column, approximately 1:2 date/content ratio; dates 20px and locations 16px desktop.
- Navigation compacted to 18px rows, 6px inactive marks and 10px active marks centered on the same axis. Existing hover labels and white-background fades preserved.
- Platform headings use inline, baseline-aligned names and muted descriptions, with natural mobile wrapping.
- Chromium now has two bullets: customer-evaluation beta release and the user-selected A infrastructure summary.
- Desktop 1280x720 and mobile 390x844 inspected; mobile document width equals viewport content width (375px), with no horizontal page overflow.
- Commit f81b343ec14f830184b48a5e03b5416559cb0ef2 deployed successfully; Pages run 37149855155. Live desktop screenshot confirms selected A copy, inline platform headings, larger left dates, and compact rail: outputs/screenshots/2026-10-03-live-refined-experience.png.

## Eighth follow-up

- Current section mark now reveals its name on hover/focus, using the same layout as other section labels with weight 600.
- Removed Hero arrow, location badge and globe, and Pause motion button and related JavaScript listeners. Reduced-motion system preference still controls animation.
- Desktop role naturally starts at the former arrow position; mobile role moved up 60px to compensate for its bottom anchoring.
- Local browser verified active label opacity 1 / weight 600 and mark opacity 0 on hover. Mobile home checked without horizontal overflow; console error check clean. Syntax, packaging and whitespace checks passed.
- Commit 698c6a55c18e008bc99bc76c1f773611e90fa981 deployed successfully (Pages run 37150828540). Live homepage confirms removed elements and profession top at 26% of hero. Screenshot: outputs/screenshots/2026-10-03-live-simplified-home.png.

## Ninth follow-up

- Removed visible Skip intro button and its event/focus references. Intro timing, Escape exit, and cleanup timer preserved.
- Restored original Wisconsin location badge and rotating globe; confirmed animation state running.
- Current navigation label now uses the same regular weight 400 as other labels.
- Platform descriptions return to separate lines, 4px below their names.
- Built three local HTML Tools proposals and rendered actual screenshots: A compact tag cards, B editorial rows, C two-column panels. Production Tools layout awaits selection.
- Local console clean; JavaScript syntax and whitespace checks passed.
- Commit 84dfb8780a6847debabdad6aa4f6b05c0d7860db deployed successfully (Pages run 37151266526). Live homepage verified restored badge/globe and absent intro button; screenshot outputs/screenshots/2026-10-03-live-restored-globe.png.

## Tenth follow-up

- Restored the diagonal arrow above Software Engineer and removed the temporary mobile role offset.
- Tools remains the existing four-column list; none of the proposed options applied.
- Measured Dennis live site: 192px/192px font/line height at 1280px width, 144px/144px at 390px mobile. Applied 15vw desktop / 144px mobile and normal letter spacing. Marquee wrapper permits descenders while Hero clips horizontal content.
- Desktop and mobile inspected; arrow present, expected fonts confirmed, mobile no horizontal page overflow.
- Commit 4d29c98e3cab004ac3a0e88da2dbfaafd87cebc6 deployed successfully (Pages run 37152270346). Live confirmed arrow present and marquee 192px at 1280px viewport. Screenshot outputs/screenshots/2026-10-03-live-reference-marquee-arrow.png.

## Eleventh follow-up

- Further reduced marquee from 15vw to 11vw desktop (192px → 140.8px at 1280px), and from 144px to clamp(80px,24vw,104px) mobile (93.6px at 390px).
- Removed Scroll to explore and its empty Hero bottom wrapper.
- Initial live check exposed cached CSS (old 192px font despite new HTML). Added stylesheet query version 20261003-11. Final commit 6b214d9e328fc48193759d94ac2d29a539934ff3 deployed successfully (Pages run 37152757120). Live confirmed actual font140.8px and no scroll prompt. Screenshot outputs/screenshots/2026-10-03-live-smaller-marquee.png.

## Twelfth follow-up — two portfolio pages

- All existing sections retained at `/` as About me. Top navigation now has About me and What I build, with current-page indicator; available on mobile as well.
- New `/what-i-build/` page follows Dennis About's measured layout: 68vw title/feature container, 84vw image/service rows, 6.125vw headline, blue rotating globe on the rule, 35/65 intro/photo split, three services and final image/text feature.
- Resume content translated into backend systems, real-time applications, full delivery lifecycle, and the workforce microservices project. Existing user-approved Chromium beta details retained. Only approved Avatar/project image assets used; resume itself remains local.
- Native page navigation uses 600ms upward black curtain, destination label, and 800ms curved lift with incoming page motion. Session state skips multilingual greetings during transitions; reduced-motion and no-JS links use native navigation. Back/Forward resets overlays.
- Local desktop reciprocal navigation and browser Back confirmed; clean console. Mobile 390x844 and 320x740 checked with no horizontal page overflow. Contact section remains usable.
- Final transition check confirms curtain hidden, incoming `#page` transform reset to none (preserving the fixed section rail), focused heading has no mouse outline, and both approved images load. Verified 27 local links/assets/fragments across both documents.
- Commit c7c8e921d0aa611f4608afbab21d75d0ffdf8543 deployed successfully (Pages run 37154066455). Live top navigation and animated transition verified; destination heading78.4px, current-page indicator correct, curtain hidden and page transform none after arrival; console clean. Screenshots: outputs/screenshots/2026-10-03-live-what-i-build.png and 2026-10-03-live-page-transition.png.

## Thirteenth follow-up — product illustration and scroll crop

- Replaced What I build's Avatar with the exact user-supplied ControlMaestro Titanium screenshot from the linked product page. New approved public asset: dist/assets/controlmaestro-titanium.png. About me's original Avatar remains.
- Inspected Dennis About image: fixed overflow-hidden window, oversized inner image, data-scroll-speed -2; observed internal y transform 0 → 144px as the page scrolled.
- Added a fixed landscape product-image window and oversized layer with smoothly scrubbed vertical offset, masking the portions outside its bounds. Fits the graphic horizontally and clips the attachment's stray text at its left edge; reduced-motion/print static.
- Local desktop verified new image loaded (1456px wide), mask overflow hidden, and inner transform -81.6px → -0.7px at scroll480px. Mobile390px checked: no horizontal overflow and positive offset after scrolling through the image. Console clean; syntax, packaging and whitespace checks passed.
- Commit 636484b3ff65472fb6a93f3b3b54ab998693b782 deployed successfully (Pages run 37154825646). Live confirmed product asset loaded and clipped parallax transform changed -81.6px → -0.7px after scrolling480px. Screenshot outputs/screenshots/2026-10-03-live-controlmaestro-scroll-image.png.

## Original Titanium interactive assets
Replaced the screenshot with five original transparent PNGs downloaded from https://elutions-controlmaestro.com/platforms/controlmaestrotitanium/. Source interaction inspection confirmed 16/-25/7 degree resting panel rotations, 1.3s hover flattening, .8s reset, and ±7px main-panel pointer tracking. Recreated these with local CSS/JS while retaining independent whole-scene scroll clipping. Desktop browser checks confirmed all five image dimensions, hover matrices, pointer tracking and exit reset; mobile 390px has no horizontal overflow and no console errors. Packaging includes all five original assets.
