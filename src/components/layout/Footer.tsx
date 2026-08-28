export function Footer() {
  return (
    <footer className="mt-[var(--spacing-section)] border-t border-line">
      <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-5 py-8 sm:px-8 lg:pl-[calc(var(--spacing-rail)+2rem)]">
        <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-faint">
          LAAM — Life AI Assistant Monitoring
        </p>
        <p className="font-mono text-[length:var(--text-eyebrow)] uppercase tracking-[0.18em] text-faint">
          Internal platform · Ennam
        </p>
      </div>
    </footer>
  );
}
