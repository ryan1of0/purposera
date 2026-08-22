import Link from "next/link";
import { LogoMark, Wordmark } from "./Logo";

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <div className="flex items-center gap-2.5">
          <LogoMark className="h-6 w-6" />
          <Wordmark className="text-small" />
        </div>

        <p className="max-w-sm text-sm leading-relaxed text-muted">
          Start with the mission. The team, the skills and the first move follow from it.
        </p>

        <div className="flex items-center gap-5 text-sm text-muted">
          <Link href="/how-it-works" className="transition-colors hover:text-ink">
            How it works
          </Link>
          <Link href="/about" className="transition-colors hover:text-ink">
            About
          </Link>
        </div>
      </div>
    </footer>
  );
}
