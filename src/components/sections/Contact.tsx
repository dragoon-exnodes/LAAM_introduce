import { Button } from "../ui/Button";
import { Eyebrow } from "../ui/Eyebrow";
import { AuroraField } from "../system/AuroraField";
import { Section } from "./Section";
import { COPY } from "../../lib/i18n";

export function Contact() {
  return (
    <Section id="contact" className="!py-0">
      <div className="reveal bracket relative overflow-hidden border border-line bg-panel/45 px-6 py-16 text-center sm:px-12 lg:py-24">
        {/* Light falls from just above the panel's top edge, so the CTA reads as
            the one lit surface at the end of a dark page. */}
        {/*
         * The mask fades the BOTTOM only. Fading the top as well pushed the band
         * away from the panel's edge and left a dead strip above it; the light is
         * meant to arrive from outside the frame, so it has to reach the edge.
         * Stops are deliberately kept inside the cool palette — a violet band would
         * borrow the colour this system reserves for the voice surface.
         */}
        <AuroraField
          colorStops={["#0b6fa8", "#00e1ff", "#4fbeff"]}
          opacity={0.55}
          speed={0.45}
          amplitude={0.9}
          blend={0.6}
          className="[mask-image:linear-gradient(to_bottom,black,black_30%,transparent_85%)]"
        />
        <div
          className="grid-field pointer-events-none absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_at_50%_50%,black,transparent_72%)]"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-2xl">
          <Eyebrow tone="signal">{COPY.contact.eyebrow}</Eyebrow>
          <h2 className="mt-6 text-[length:var(--text-section)] uppercase">
            {COPY.contact.heading}
          </h2>
          <p className="mt-6 text-[length:var(--text-lead)] text-muted">
            <span className="text-ink">{COPY.contact.lead.ink}</span> {COPY.contact.lead.rest}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <Button href={`mailto:contact@ennam.vn?subject=${encodeURIComponent(COPY.contact.mailSubject)}`}>
              {COPY.contact.primary}
            </Button>
            <Button href="#top" variant="ghost">
              {COPY.contact.secondary}
            </Button>
          </div>
        </div>
      </div>
    </Section>
  );
}
