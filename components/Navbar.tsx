import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";

const LINKS = [
  { href: "/how-it-works", label: "How it works" },
  { href: "/about", label: "About" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/70 bg-paper/85 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-8"
      >
        <Link
          href="/"
          className="flex items-center gap-2.5 rounded-lg transition-opacity hover:opacity-70"
        >
          <LogoMark className="h-7 w-7" />
          <Wordmark />
          <span className="sr-only">PURPOSERA home</span>
        </Link>

        <div className="flex items-center gap-1 sm:gap-2">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hidden rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:text-ink sm:block"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#start"
            className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper transition-colors hover:bg-ink-soft"
          >
            Get started
          </Link>
        </div>
      </nav>
    </header>
  );
}
