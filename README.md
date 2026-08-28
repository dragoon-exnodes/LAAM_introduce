# LAAM — introduction site

A single-page site introducing **LAAM (Life AI Assistant Monitoring)** to partners.
Content comes from `../docs/laam-web-content-brief.md`; nothing on the page claims a
capability that brief doesn't back.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # → dist/
npm run preview
```

## Stack

Vite · React 19 · TypeScript · Tailwind CSS v4 · GSAP (ScrollTrigger) · Lenis ·
`@splinetool/runtime`.

## Design direction

The premise is that the page is not *about* a console — it **is** one. LAAM's whole
proposition is that something is being observed, so the page observes something, and
every device on it earns its place against that idea.

- **Colour is semantic, not decorative.** The whole scale is cool, the way a real
  readout is, and *saturation* carries the meaning: electric cyan
  (`--color-signal` `#00E1FF`) is something happening **now**; azure
  (`--color-trace` `#4FBEFF`) is something already recorded; violet
  (`--color-ion`) belongs to the voice surface; rose (`--color-alert`) means a run
  went quiet. Everything else is housing.
- **One colour is reserved.** Acid lime (`--color-free` `#E8FF54`) is spent on a
  single claim — *this costs nothing* — and appears nowhere else: the hero eyebrow,
  the scope's cost readout, the chat channel's status, and the `$0` status fact.
  Used this sparingly it lands every time. Used as the primary it would have made
  the page the acid-green-on-black look that every AI-generated site is currently
  wearing.
- **Type**: Archivo at expanded width for display, IBM Plex Sans for body, IBM Plex
  Mono for anything that is data — timers, session ids, route names. The headline
  arrives by *widening*: Archivo is variable, so the letters settle into their frame
  rather than sliding up like everything else.
- **Section markers are the product's real route names** (`/monitoring`, `/chat`,
  `/workflows`). They carry information; `01 / 02 / 03` would not, because the
  surfaces are not a sequence.

### The four signature moments

1. **Boot sequence, and its CRT power-down** — the console powers on before it shows
   anything: a counter to 100, channels reporting online. Then it *switches off*:
   the panel collapses vertically onto a single bright line, the line blooms, and
   wipes. A curtain lift was the first attempt and read as a generic page
   transition; a monitor powering down is the one exit that belongs to a page
   pretending to be a monitor. On the way out the wordmark **flies to the exact box
   it will occupy in the nav** (a FLIP measured at exit time, when fonts and layout
   have settled), so the mark is never re-drawn — it lands. The hero is released the
   instant the collapse begins, so it animates in *behind* the shrinking panel
   rather than after a beat of empty screen.

   It is also functional: it holds the first frames until `document.fonts.ready` so
   the hero never reflows mid-reveal. Any click or key skips it, and a failsafe
   dismisses it if a font request stalls.
2. **The hero scope** — the Spline robot is the subject under observation, framed by
   brackets with a live readout over it. Pointer parallax puts the scope and the grid
   at different depths.
3. **Measurement reticles** — crosshairs with a live coordinate readout, but *only*
   inside instrument viewports. The native cursor is never replaced; a site-wide
   custom cursor trades real usability for novelty, and the gesture only means
   anything where the page is explicitly claiming to observe.
4. **The seven-channel console** — the middle of the page is not a bento of cards.
   A single console stays pinned while seven channels advance through it, each with a
   bespoke live readout: a session list with ticking timers, a chat thread that types
   its answer after a tool call, an animated voice waveform, a held workflow run, the
   connector grid, search hits, and the access log.

Supporting texture: a scroll-position calibration rail down the left edge, a
perpetual telemetry ribbon whose timers genuinely tick, mono labels that decode
character by character on first view, an aurora band on the boot screen and the
closing call to action, and a film-grain and vignette pass so the dark fields read
as photographed rather than filled.

### On the background shader

`AuroraField` is the **only** ambient WebGL on the page, and it took two wrong turns
to get there. A molten-metal/plasma field was tried first: beautiful in isolation,
but organic and swirling, which reads as a second, different site layered under a
page whose whole language is orthogonal and measured. A hand-drawn radar sweep came
next, on the theory that a scope is on-theme — but a sweep is a *diagram*, and a
shader-drawn diagram competes with the page's real diagrams and loses; it read as a
cheap game HUD.

Aurora works because it is atmosphere rather than subject: light arriving from
above, with nothing in it to read as crude and nothing it is trying to explain. It
appears in exactly two places — behind the boot screen and behind the closing call
to action — so the first and last frames of the page rhyme.

Two deliberate departures from the React Bits original: the band is **masked at both
edges** (it otherwise terminates hard against the panel border and reads as a
gradient pasted on rather than light in air), and the default violet/green stops are
replaced with cool-palette ones, because violet in this system means the voice
surface and a large violet field would borrow that meaning.

`ogl` (~15 kB) is dynamically imported, so it never enters the initial payload; if
it has not arrived the page simply has no aurora and nothing waits on it.

## Structure

```
src/
  components/
    system/    BootSequence · AuroraField · Reticle · Grain + Vignette
    layout/    Nav · Rail (scroll-position calibration rail) · Footer
    hero/      Hero · SplineStage · ScopeReadout · TelemetryRibbon
    channels/  PanelFrame · ChannelPanel (router) + 7 bespoke readouts
    sections/  Section (reveal wrapper) · Problem · Channels · Workflows
               WorkflowDiagram · Evidence · Status · Contact
    ui/        Button · Eyebrow · ScrambleText
  hooks/       useReducedMotion · useMediaQuery
  lib/         motion.ts (GSAP setup + helpers) · content.ts (all copy)
               telemetry.ts (deterministic session data)
  styles/      tokens.css (@theme design tokens)
```

All copy lives in `lib/content.ts` so components stay presentational and text edits
never touch layout code. Telemetry values are fixed seeds, not random — the ribbon
must look identical on every visit, and the only thing that genuinely moves is
elapsed time.

## Content provenance

Every product **claim** on this page was checked against the LAAM repo. So was the
vocabulary inside the console panels — tool names, node kinds, status unions, audit
actions, template ids and the demo question are the real ones, and several were
wrong in an earlier draft:

| Was | Is | Why it mattered |
|---|---|---|
| `stuck` as a stored status | `running \| idle \| done`, with `stuck` **derived** from `LAAM_STUCK_MIN` | Misrepresented the data model |
| Search showing message-body excerpts | Three groups of **pointers**; conversations are matched by title and never returned as raw text | Would have claimed a privacy posture the product deliberately does not take |
| Read/write shown per connector | Declared **per tool**; what differs is whether a write is `workflowSafe` behind a recipient allowlist (5 of them are) | Misrepresented the safety model |
| `role_changed` | `role_change` | Wrong audit action name |
| Invented workflow "Daily ops digest" | The shipped `multi-source-report-email` with its real node ids | — |
| Colleagues' real handles in fabricated audit rows | Generic handles | Fake permission records should not name identifiable people |

The remaining fabricated values are the illustrative numbers themselves — elapsed
times, tool counts, the sparkline. Replacing those with a real export would be the
single highest-value content upgrade left.

⚠️ **The contact address is a placeholder.** `Contact.tsx` points at
`hello@exnodes.vn`; the domain is right but the mailbox was never verified, and it
is the primary call to action on the site. Replace it before publishing.

## Decisions worth knowing before you edit

**The 3D scene is opt-in, not default.** The Spline scene is 1.3 MB on top of its
runtime. `SplineStage` loads it only when the screen is ≥1024px, the pointer is
fine, motion is not reduced, and the frame is near the viewport. Every other visitor
gets the radar fallback, which is a finished picture rather than a placeholder. This
keeps the initial payload at ~121 kB gzipped.

**Content is visible by default; GSAP hides it.** `.reveal` carries no `opacity: 0`
in CSS. The hidden start state is applied by `revealOnScroll` in a layout effect,
and only when it will actually animate. If the script fails, or the visitor prefers
reduced motion, the page reads normally instead of showing empty sections — an
earlier version relied on a CSS media query to un-hide and left 30 elements
invisible when the two disagreed.

**Lenis is configured with `anchors: true`.** Lenis drives the scroll position and
ScrollTrigger measures from its `scroll` event. A native anchor jump moves the
document without emitting that event, which leaves every ScrollTrigger measuring a
stale position — `anchors` routes in-page links back through Lenis.

**Spline gets a fresh canvas per attempt.** A disposed WebGL context cannot be
re-attached, and StrictMode mounts effects twice. The canvas is created imperatively
inside the loader effect and removed on cleanup. Relatedly, the loader is keyed on a
latching `shouldLoad` flag rather than the phase it sets — an effect that both
depends on and updates one state value tears down its own canvas.

**The channel console is pinned with CSS `sticky`, not a GSAP pin.** Sticky needs no
pin-spacer, so it cannot desynchronise from Lenis's scroll position and the section
keeps its natural height. ScrollTrigger is used only to *read* progress and pick the
active channel. Below `lg` there is nowhere for a console to stand still, so the
channels render as a normal stacked list with auto-height panels.

**The hero section is clipped.** The parallax grid is deliberately oversized
(`-inset-16`) so it has room to travel; without `overflow-hidden` on the section it
widens the document and puts a horizontal scrollbar on phones.

## Quality floor

Responsive from 320px up · no horizontal page overflow (the workflow diagram scrolls
inside its own container) · visible keyboard focus · skip link.

**Reduced motion is a real path, not a token gesture.** The boot sequence is skipped
entirely, the 3D scene never loads, the ribbon and waveform freeze, reticles are
disabled, mono labels render their final text, and every reveal is visible. Verified
by stubbing the media query and asserting zero hidden elements.

Initial payload ~127 kB gzipped JS + 8 kB CSS; the 1.3 MB 3D scene and its runtime
are lazy chunks that most visitors never request.
