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

export function Channels() {
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <Section id="surfaces" className="!pb-0">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          <Eyebrow scramble>{COPY.channels.eyebrow}</Eyebrow>
          <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
            {COPY.channels.heading}
          </h2>
        </div>
        {/* Two words carried a claim they couldn't keep. "A route" asserted a
            one-to-one mapping the product doesn't have — the monitoring tab
            describes filtering, cost and tool timings that live on /agents and
            /dashboard, not /monitoring. And "mock-up" was the wrong word to
            reach for on a page whose panels ARE mock-ups: the point being made
            is that these surfaces shipped, not that the drawings are real. */}
        {/* Saying the data is invented costs nothing and buys two things: it
            answers "is any of this real?" before a visitor has to wonder, and it
            is the honest reason — real sessions are someone's actual work and do
            not belong on a marketing page. A page that argues for measurement
            cannot leave its own most obvious question unanswered. */}
        <p className="reveal max-w-sm text-[0.95rem] text-muted">
          {COPY.channels.lead}
        </p>
      </header>

      {isDesktop ? <PinnedConsole /> : <StackedChannels />}
    </Section>
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
  const copy = COPY.channels.items[index];

  return (
    <div
      ref={track}
      className="relative mt-16"
      style={{ height: `${CHANNELS.length * TRACK_PER_CHANNEL * 100}vh` }}
    >
      <div className="sticky top-[16vh] grid h-[68vh] grid-cols-[1.05fr_0.95fr] gap-8">
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
          <h3 className="mt-4 text-2xl leading-[1.12] text-ink [font-stretch:112%]">{COPY.channels.items[i].title}</h3>
          <p className="mt-4 text-[0.95rem] text-muted">{COPY.channels.items[i].body}</p>

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
