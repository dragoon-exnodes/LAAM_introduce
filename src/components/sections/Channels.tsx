import { useEffect, useRef, useState } from "react";
import { CHANNELS } from "../../lib/content";
import { ScrollTrigger } from "../../lib/motion";
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
          <Eyebrow scramble>The platform</Eyebrow>
          <h2 className="reveal mt-5 text-[length:var(--text-section)] uppercase">
            Seven channels, one console
          </h2>
        </div>
        <p className="reveal max-w-sm text-[0.95rem] text-muted">
          Every readout below is a route people open daily. Nothing here is a mock-up of a roadmap.
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
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const el = track.current;
    if (!el) return;

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "bottom bottom",
      onUpdate: ({ progress }) => {
        const next = Math.min(CHANNELS.length - 1, Math.floor(progress * CHANNELS.length));
        setIndex((current) => (current === next ? current : next));
      },
    });

    return () => trigger.kill();
  }, []);

  const channel = CHANNELS[index];

  return (
    <div
      ref={track}
      className="relative mt-16"
      style={{ height: `${CHANNELS.length * TRACK_PER_CHANNEL * 100}vh` }}
    >
      <div className="sticky top-[16vh] grid h-[68vh] grid-cols-[1.05fr_0.95fr] gap-8">
        <div className="bracket relative border border-line bg-panel/88">
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
          <ol className="flex flex-wrap gap-x-5 gap-y-2">
            {CHANNELS.map((item, i) => (
              <li key={item.route}>
                <span
                  className={`font-mono text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 ${
                    i === index ? TONE_TEXT[item.tone] : "text-faint"
                  }`}
                >
                  {item.label}
                </span>
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
            <h3 className="mt-5 text-3xl leading-[1.08] text-ink [font-stretch:112%] xl:text-4xl">
              {channel.title}
            </h3>
            <p className="mt-5 max-w-md text-[0.95rem] text-muted">{channel.body}</p>

            {channel.points.length > 0 && (
              <ul className="mt-6 space-y-2 border-t border-line pt-5">
                {channel.points.map((point) => (
                  <li key={point} className="flex gap-3 font-mono text-[length:var(--text-data)] text-faint">
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
      {CHANNELS.map((channel) => (
        <article key={channel.route} className="reveal">
          <span
            className={`font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.22em] ${TONE_TEXT[channel.tone]}`}
          >
            {channel.route}
          </span>
          <h3 className="mt-4 text-2xl leading-[1.12] text-ink [font-stretch:112%]">{channel.title}</h3>
          <p className="mt-4 text-[0.95rem] text-muted">{channel.body}</p>

          {/* Auto height: stacked panels size to their own content rather than
              being cropped by a fixed frame borrowed from the pinned layout. The
              min has to clear PanelFrame's own floor plus the frame chrome, or
              the floor is what decides the height and the panel overflows. */}
          <div className="bracket relative mt-6 min-h-[26rem] border border-line bg-panel/88">
            <ChannelPanel panel={channel.panel} active />
          </div>
        </article>
      ))}
    </div>
  );
}
