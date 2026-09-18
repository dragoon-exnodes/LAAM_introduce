import { COPY } from "../../lib/i18n";

export function Footer() {
  return (
    <footer className="mt-[var(--spacing-section)] border-t border-line">
      {/* Centred on a phone, left on everything wider. Below `lg` this is a
          single stacked column with nothing to its right to balance against,
          so a flush-left block reads as accidentally offset rather than
          deliberately aligned; centring it reads as composed. It reverts to
          left the moment the two-column split at `lg` gives the block
          something to sit beside. */}
      <div className="mx-auto grid max-w-[1400px] gap-6 px-5 py-10 text-center sm:px-8 sm:text-left lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:pl-[calc(var(--spacing-rail)+2rem)]">
        <div>
          {/* The product expands its own acronym two ways: the README says "Life
              AI Assistant Monitoring", the app's <title> says "Local AI Agent
              Monitoring". This prints the second, and the reason it used to
              give — that it "restates this page's positioning" — expired when
              the page stopped being about watching agents. It stays anyway, on
              a stronger ground: it is the product's own name, pinned by a CTO
              decision that says explicitly not to change the UI strings to
              match a document (`decisions/laam-name-expansion`, 2026-06-23). A
              name outliving the sentence that first justified it is normal;
              renaming a shipped product to tidy a landing page is not. */}
          <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-muted">
            {COPY.footer.wordmark}
          </p>
          {/* `mx-auto` only earns its keep while the paragraph is centred: a
              multi-line block with `text-center` alone still sits flush left,
              so its centred TEXT reads as adrift inside a left-anchored box.
              Cancelled at `sm`, where the surrounding text goes back to
              left-aligned and a centred box would be the thing adrift. */}
          <p className="mx-auto mt-3 max-w-[56ch] text-[0.9rem] text-muted sm:mx-0">
            {COPY.footer.tagline}
          </p>
        </div>

        {/* The only outbound link on the page, so it carries the hover treatment
            the nav links use rather than inventing a second one. "Ennam SJC",
            matching the nav's own "by Ennam SJC" — the maker's full name, not
            the shorthand this link used to carry on its own. */}
        <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-muted">
          <a
            href="https://ennam.vn/"
            target="_blank"
            rel="noreferrer"
            className="underline decoration-line-bright underline-offset-4 transition-colors duration-[var(--duration-fast)] hover:text-ink hover:decoration-signal"
          >
            Ennam SJC
          </a>
        </p>
      </div>
    </footer>
  );
}
