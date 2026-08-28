type Props = {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
};

export function Button({ href, children, variant = "solid" }: Props) {
  // Full width while stacked on a phone, intrinsic once they sit side by side.
  const base =
    "group relative inline-flex w-full items-center justify-center gap-2.5 px-6 py-3.5 font-mono text-[length:var(--text-data)] uppercase tracking-[0.16em] transition-colors duration-[var(--duration-fast)] sm:w-auto sm:justify-start";

  if (variant === "ghost") {
    return (
      <a href={href} className={`${base} border border-line text-muted hover:border-line-bright hover:text-ink`}>
        {children}
      </a>
    );
  }

  return (
    <a href={href} className={`${base} overflow-hidden bg-signal text-void hover:text-void`}>
      {/* Fill wipe: the button reads as a switch being thrown, not a bouncing pill. */}
      <span className="absolute inset-0 origin-left scale-x-0 bg-ink transition-transform duration-[var(--duration-normal)] ease-[var(--ease-out-expo)] group-hover:scale-x-100" />
      <span className="relative">{children}</span>
      <span className="relative" aria-hidden="true">
        →
      </span>
    </a>
  );
}
