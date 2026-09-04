import { COPY } from "../../lib/i18n";

export function Footer() {
  return (
    <footer className="mt-[var(--spacing-section)] border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8 lg:pl-[calc(var(--spacing-rail)+2rem)]">
        {/* The product expands its own acronym two ways: the README says "Life AI
            Assistant Monitoring", the app's <title> says "Local AI Agent
            Monitoring". The second is the one worth printing — every word of it
            is load-bearing and it restates this page's positioning in four words,
            while "Life" carries no meaning and "Assistant" is vaguer than "Agent"
            on a page headed "Every agent. Every machine." */}
        <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-muted">
          {COPY.footer.wordmark}
        </p>
        {/* The only outbound link on the page, so it carries the hover treatment
            the nav links use rather than inventing a second one — and it moves the
            underline onto the word itself, since "Internal platform" is not part
            of what you are clicking through to. */}
        <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-muted">
          {COPY.footer.org} ·{" "}
          <a
            href="https://ennam.vn/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line-bright underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-ink hover:decoration-signal"
          >
            Ennam
          </a>
        </p>
      </div>
    </footer>
  );
}
