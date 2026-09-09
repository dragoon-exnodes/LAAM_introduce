import { useEffect, useRef, useState } from "react";
import { CHANNELS } from "../../lib/content";
import { ScrollTrigger } from "../../lib/motion";
import { scrollToY } from "../../lib/scroll";
import { COPY } from "../../lib/i18n";
import { useMediaQuery } from "../../hooks/useMediaQuery";
import { ChannelPanel } from "../channels/ChannelPanel";
import { Reticle } from "../system/Reticle";
import { Eyebrow } from "../ui/Eyebrow";
import { Section } from "./Section";

/** Scroll distance, in viewport heights, spent on each channel while pinned. */
const TRACK_PER_CHANNEL = 0.72;

const TONE_TEXT = {
  signal: "text-signal",
  trace: "text-trace",
  ion: "text-ion",
} as const;

const TONE_BG = {
  signal: "bg-signal",
  trace: "bg-trace",
  ion: "bg-ion",
} as const;

export function HowItWorks() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Section id="how-it-works" className="!pb-0">
      <header className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem] lg:items-end lg:gap-16">
        <div>
          <Eyebrow scramble>{COPY.howItWorks.eyebrow}</Eyebrow>
          <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
            {COPY.howItWorks.heading}
          </h2>
          <p className="reveal mt-6 max-w-2xl text-[length:var(--text-lead)] text-muted">
            {COPY.howItWorks.lead}
          </p>
        </div>

        <FlowStack />
      </header>

      <Steps />

      {/* The console gets its own header rather than running straight on from the
          steps: the four steps above are the ARGUMENT, and what follows is the
          evidence — four shipped screens. Without a break the panels read as a
          fifth step.

          That break is the steps list closing itself (`last:border-b`), and this
          header carries no rule of its own. It used to carry a `border-t` too,
          which put two full-width rules 96px apart with nothing between them —
          the list shutting and the header opening, both saying the same thing. */}
      <div className="reveal mt-20 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow tone="trace">{COPY.howItWorks.surfaces.eyebrow}</Eyebrow>
          <h3 className="mt-5 text-3xl uppercase [font-stretch:112%]">
            {COPY.howItWorks.surfaces.heading}
          </h3>
        </div>
        {/* Saying the data is invented costs nothing and buys two things: it
            answers "is any of this real?" before a visitor has to wonder, and it
            is the honest reason — real sessions are someone's actual work and do
            not belong on a marketing page. */}
        <p className="max-w-sm text-[0.95rem] text-muted">{COPY.howItWorks.surfaces.lead}</p>
      </div>

      {isDesktop ? <PinnedConsole /> : <StackedChannels />}
    </Section>
  );
}

/**
 * The brief's architecture line: data and apps, reached through tools, by LAAM,
 * producing an answer and an action.
 *
 * Third attempt, and the two failures are the reason for this shape.
 *
 * It was first a quiet row of type — too quiet to be worth the space. Then a
 * descending staircase of ruled stages, which was worse: four hairlines and four
 * small labels have no MASS, so at this scale they read as a broken wireframe
 * rather than as a drawing. The lesson is that four short technical labels cannot
 * carry a full-width diagram. There is not enough material in them.
 *
 * So it stops trying to be a diagram and becomes a component: a small, dense,
 * filled stack of four layers, sized to sit beside the section's lead instead of
 * spanning the page under it. That also fixes a layout problem the diagram
 * created — the right half of this header was empty, and a full-width band of
 * hairlines underneath was the page's thinnest element sitting directly below its
 * emptiest space.
 *
 * A stack is the right figure for it too. This is the one place on the page that
 * states the architecture, and architecture is drawn as layers: your systems at
 * the bottom of the reach, the tool layer over them, LAAM over that, and what
 * comes out on top. `LAAM` is the lit layer, keyed off the string because the
 * stage names are product vocabulary and identical in every locale.
 *
 * The first pass at this stack read as a NAV MENU — four equal rows, an accent
 * bar on each, one on a flat tinted ground. That is the visual language of a tab
 * list or a select with an option chosen, so the eye expected the rows to be
 * clickable and none of them are. A form that promises interaction it does not
 * have is a fault, not a matter of taste, and it is fixed by removing what
 * carried the promise:
 *
 *   - the per-row accent bars are gone (they were the list-marker tell, and they
 *     encoded nothing — four identical marks differing only in colour);
 *   - the lit band is a gradient that fades out, not a filled rectangle, so it
 *     reads as light falling on a layer rather than as a selected state;
 *   - the bands are DELIBERATELY UNEQUAL. Menu items are the same height; layers
 *     are not. LAAM's band is taller because it is the layer the other three are
 *     described relative to, which is both the thing that breaks the menu reading
 *     and a true statement about the architecture.
 */
function FlowStack() {
  const flow = COPY.howItWorks.flow;

  return (
    <ol className="reveal bracket relative overflow-hidden border border-line bg-panel-2">
      {flow.map((node) => {
        const lit = node === "LAAM";
        return (
          <li
            key={node}
            className={`relative border-t border-line px-5 first:border-t-0 ${lit ? "py-7" : "py-4"}`}
          >
            {/* Light, not a fill. A flat tinted rectangle behind one row of four
                is the selected-option state of a menu, which is precisely the
                reading this had to lose; a gradient that fades out across the
                band reads as illumination instead, and it is the same light the
                rest of the page uses. */}
            {lit && (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-gradient-to-r from-signal/22 via-signal/8 to-transparent"
              />
            )}
            <span
              className={`relative font-mono text-[length:var(--text-data)] uppercase ${
                lit ? "tracking-[0.3em] text-signal" : "tracking-[0.14em] text-ink"
              }`}
            >
              {node}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

/**
 * Ask → Understand → Answer → Act.
 *
 * A numbered spine rather than four cards side by side. Two reasons, and the
 * first is the one that licenses the numerals at all: this content genuinely IS
 * a sequence, so 01–04 encodes something. (A four-column grid would say the
 * opposite — that they happen in parallel.)
 *
 * The second is that each step carries a different shape of evidence: three
 * example questions, a six-item capability list, a two-turn dialogue. A grid of
 * equal cells has to flatten those into one shape; a spine lets each step be as
 * long as it actually is.
 *
 * The numeral is set in the display face at display size, ghosted back to the
 * hairline colour. It is a structural mark, not a label — which is why it is not
 * the small tracked-out mono the rest of the page uses for labels, and why it
 * recedes rather than competing with the step title beside it.
 */
function Steps() {
  const list = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);

  /**
   * Which step the reader is on, and nothing else.
   *
   * A looping gradient shimmer on all four numerals was the obvious way to
   * "animate the numbers" and it is the wrong one twice over. The numerals are
   * deliberately recessive structural marks, so lighting them all pulls the eye
   * off the step titles and inverts the hierarchy; and a permanent loop would be
   * a fifth ambient animation on a page that already runs the constellation, the
   * layer slab, the inquiry ribbon and the grain. `frontend-design` names that
   * exact failure — scattered non-user-triggered effects read as decoration.
   *
   * Tied to scroll position instead, the same motion means something: these
   * numerals mark a SEQUENCE, so the one you are reading is lit and the others
   * are not. That is motion clarifying flow rather than competing with it.
   *
   * `start: top 55%` / `end: bottom 55%` makes exactly one step active at a time
   * — the steps tile the list with no gaps, so the 55% line is inside exactly one
   * of them.
   */
  useEffect(() => {
    const items = list.current?.children;
    if (!items) return;

    const triggers = [...items].map((el, i) =>
      ScrollTrigger.create({
        trigger: el as HTMLElement,
        start: "top 55%",
        end: "bottom 55%",
        onToggle: (self) => {
          if (self.isActive) setActive(i);
        },
      }),
    );

    return () => triggers.forEach((t) => t.kill());
  }, []);

  return (
    <ol ref={list} className="mt-20">
      {COPY.howItWorks.steps.map((step, i) => {
        const on = i === active;
        return (
        <li
          key={step.title}
          className="reveal group relative grid gap-x-8 gap-y-5 border-t border-line py-12 last:border-b sm:grid-cols-[5.5rem_1fr]"
        >
          {/* The spine: a hairline down the numeral gutter. It runs the full
              height of the row, so the four rows read as one continuous
              instrument rather than four stacked blocks — and it stops at the
              last step, because the sequence does. */}
          <span
            aria-hidden="true"
            className="absolute left-[6.5rem] top-0 hidden h-full w-px bg-line sm:block"
          />
          {/* The live segment fills down the step you are on. `scaleY`, not
              height: this project's style rules keep motion on compositor
              properties, and animating height here would relayout the row on
              every frame. */}
          <span
            aria-hidden="true"
            className="absolute left-[6.5rem] top-0 hidden h-full w-px origin-top bg-signal transition-transform duration-[600ms] ease-[var(--ease-out-expo)] sm:block"
            style={{ transform: on ? "scaleY(1)" : "scaleY(0)" }}
          />

          {/* Two numerals stacked, cross-fading. A gradient fill cannot be
              transitioned — `background-image` has no interpolation — so the lit
              copy sits over the resting one and only their opacities move.
              The gradient runs signal → the resting colour rather than signal →
              signal: the numeral reads as lit from above and settles back into
              the page, which is the same light the rest of this site uses. */}
          <span className="relative font-display text-5xl font-bold leading-none tabular-nums [font-stretch:118%] sm:text-6xl">
            <span
              className="block transition-opacity duration-[600ms] text-line-bright"
              style={{ opacity: on ? 0 : 1 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <span
              aria-hidden="true"
              className="absolute inset-0 block bg-gradient-to-b from-signal to-line-bright bg-clip-text text-transparent transition-opacity duration-[600ms]"
              style={{ opacity: on ? 1 : 0 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>
          </span>

          <div className="max-w-3xl">
            <h3 className="text-2xl uppercase">{step.title}</h3>
            <p className="mt-4 max-w-[62ch] text-[0.95rem] text-muted">{step.body}</p>

            {"examples" in step && step.examples && (
              <ul className="mt-6 space-y-2.5">
                {step.examples.map((example) => (
                  <li key={example} className="text-[1.05rem] leading-snug text-ink">
                    {example}
                  </li>
                ))}
              </ul>
            )}

            {"capabilities" in step && step.capabilities && (
              <ul className="mt-7 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                {step.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="flex gap-3 text-[0.9rem] text-ink/90"
                  >
                    <span className="mt-[0.55em] h-1 w-1 shrink-0 bg-trace" aria-hidden="true" />
                    {capability}
                  </li>
                ))}
              </ul>
            )}

            {"note" in step && step.note && (
              <p className="mt-7 max-w-[62ch] border-l border-trace-dim pl-5 text-[0.9rem] text-muted">
                {step.note}
              </p>
            )}

            {/* The most persuasive content in the section: a request, and the
                thing that stops before it can be taken back. It gets the lit
                ground the surrounding prose does not. */}
            {"dialogue" in step && step.dialogue && (
              <dl className="mt-7 divide-y divide-line border border-line bg-panel-2">
                {step.dialogue.map((turn) => (
                  <div key={turn.ask} className="p-5 sm:p-6">
                    <dt className="text-[1.05rem] leading-snug text-ink">{turn.ask}</dt>
                    <dd className="mt-2.5 flex gap-3 text-[0.9rem] text-trace">
                      <span aria-hidden="true">→</span>
                      {turn.result}
                    </dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </li>
        );
      })}
    </ol>
  );
}

/**
 * The console holds still while the channels advance through it.
 *
 * Pinning is CSS `sticky` rather than a GSAP pin: sticky needs no pin-spacer, so
 * it cannot desynchronise from Lenis's scroll position, and the section keeps
 * its natural height. ScrollTrigger is used only to read progress.
 */
function PinnedConsole() {
  const track = useRef<HTMLDivElement>(null);
  const trigger = useRef<ReturnType<typeof ScrollTrigger.create> | null>(null);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: ({ progress }) => {
        const next = Math.min(CHANNELS.length - 1, Math.floor(progress * CHANNELS.length));
        setIndex((current) => (current === next ? current : next));
      },
    });
    trigger.current = st;

    return () => {
      trigger.current = null;
      st.kill();
    };
  }, []);

  /**
   * Clicking a tab scrolls to that channel rather than setting the index.
   *
   * `index` is DERIVED from scroll position — the trigger above recomputes it on
   * every update — so assigning it directly would be overwritten by the next
   * frame, and the tab would flash and snap back. Moving the page instead leaves
   * one source of truth and lets the same code path do the work whether the
   * visitor scrolled or clicked.
   *
   * The trigger reports its own start and end in scroll pixels, so the band that
   * maps to channel i is [i/N, (i+1)/N] of that span; aiming at the middle keeps
   * the landing clear of the boundary, where a pixel either way would select the
   * neighbour.
   */
  const goToChannel = (i: number) => {
    const st = trigger.current;
    if (!st) return;
    scrollToY(st.start + (st.end - st.start) * ((i + 0.5) / CHANNELS.length));
  };

  const channel = CHANNELS[index];
  // Structure and language are two lists zipped by index: CHANNELS holds what is
  // the same in every locale (route, panel, tone), COPY holds what is not.
  const copy = COPY.howItWorks.items[index];

  return (
    <div
      ref={track}
      className="relative mt-16"
      style={{ height: `${CHANNELS.length * TRACK_PER_CHANNEL * 100}vh` }}
    >
      {/* `h-[68vh]` alone made the console a fraction of the screen, and the
          panels inside it are not fractions of anything: the workflow canvas
          carries a 25rem floor because its node positions are percentages while
          node heights are pixels, so below that they overlap. Add the frame
          header, the info strip and the caption and the tallest panel needs about
          597px — which 68vh only reaches at a viewport 878px tall. Every shorter
          screen (iPad Pro 11" landscape at 834, and any 768 or 800px laptop) was
          pushing that caption out through the bottom border. The floor is stated
          here, once, rather than by trimming the panel that happens to be tallest
          today. */}
      <div className="sticky top-[16vh] grid h-[68vh] min-h-[38rem] grid-cols-[1.05fr_0.95fr] gap-8">
        <div className="bracket relative border border-line bg-panel/50">
          <Reticle />
          {CHANNELS.map((item, i) => (
            <div
              key={item.route}
              aria-hidden={i !== index}
              className={`absolute inset-0 transition-opacity duration-500 ease-[var(--ease-out-expo)] ${
                i === index ? "opacity-100" : "pointer-events-none opacity-0"
              }`}
            >
              <ChannelPanel panel={item.panel} active={i === index} />
            </div>
          ))}
        </div>

        <div className="flex flex-col py-2">
          {/* Buttons, not a labelled tablist. A real `tablist` would promise that
              these control which panel is shown, and they do not — the scroll
              position does, and these move the scroll. `aria-current` says which
              one you are on without claiming a relationship that isn't there. */}
          <ol className="flex flex-wrap gap-x-5 gap-y-2">
            {CHANNELS.map((item, i) => (
              <li key={item.route}>
                <button
                  type="button"
                  onClick={() => goToChannel(i)}
                  aria-current={i === index ? "true" : undefined}
                  className={`cursor-pointer font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 hover:text-ink focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-signal ${
                    i === index ? TONE_TEXT[item.tone] : "text-muted"
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ol>

          {/* Keyed so each channel's copy animates in rather than swapping in place. */}
          <div
            key={channel.route}
            className="mt-10 flex-1 animate-[channel-in_520ms_var(--ease-out-expo)_both]"
          >
            <span
              className={`font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.22em] ${TONE_TEXT[channel.tone]}`}
            >
              {channel.route}
            </span>
            <h3 className="mt-5 text-3xl leading-[var(--leading-channel)] text-ink [font-stretch:112%] xl:text-4xl">
              {copy.title}
            </h3>
            <p className="mt-5 max-w-md text-[0.95rem] text-muted">{copy.body}</p>

            {copy.points.length > 0 && (
              <ul className="mt-6 space-y-2 border-t border-line pt-5">
                {copy.points.map((point) => (
                  <li key={point} className="flex gap-3 font-mono text-[length:var(--text-data)] text-muted">
                    <span aria-hidden="true" className="text-faint">
                      ›
                    </span>
                    {point}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="font-mono text-[10px] tabular-nums text-faint">
              {String(index + 1).padStart(2, "0")} / {String(CHANNELS.length).padStart(2, "0")}
            </span>
            <span className="relative h-px flex-1 bg-line" aria-hidden="true">
              <span
                className={`absolute inset-y-0 left-0 transition-[width] duration-500 ease-[var(--ease-out-expo)] ${TONE_BG[channel.tone]}`}
                style={{ width: `${((index + 1) / CHANNELS.length) * 100}%` }}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Below the pin breakpoint the console has nowhere to stand still — so it doesn't. */
function StackedChannels() {
  return (
    <div className="mt-14 space-y-16 pb-[var(--spacing-section)]">
      {CHANNELS.map((channel, i) => (
        <article key={channel.route} className="reveal">
          <span
            className={`font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.22em] ${TONE_TEXT[channel.tone]}`}
          >
            {channel.route}
          </span>
          <h3 className="mt-4 text-2xl leading-[1.12] text-ink [font-stretch:112%]">{COPY.howItWorks.items[i].title}</h3>
          <p className="mt-4 text-[0.95rem] text-muted">{COPY.howItWorks.items[i].body}</p>

          {/* Auto height: stacked panels size to their own content rather than
              being cropped by a fixed frame borrowed from the pinned layout. The
              min has to clear PanelFrame's own floor plus the frame chrome, or
              the floor is what decides the height and the panel overflows.

              `grid`, though, not a plain box — the same min-height trap the panel
              chrome documents, one level up. PanelFrame is `h-full`, and a
              percentage height cannot resolve against a parent carrying only a
              MIN height, so it fell back to its own 19rem floor and sat 112px
              short of this frame: dead space under every stacked panel, worst on
              the connectors fan, where nine strands were crammed into two thirds
              of the box they had been given. A grid's single child stretches to
              the track, so the panel takes the whole 26rem and still grows past
              it when its content needs more. */}
          <div className="bracket relative mt-6 grid min-h-[26rem] border border-line bg-panel/50">
            <ChannelPanel panel={channel.panel} active />
          </div>
        </article>
      ))}
    </div>
  );
}
