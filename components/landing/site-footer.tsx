import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-16 md:py-24">
        <div className="flex flex-col items-start gap-6">
          <h2 className="max-w-3xl font-serif text-4xl font-medium leading-tight tracking-tight text-balance md:text-6xl">
            The haze won&apos;t lift itself. <span className="text-primary">Get on the bike.</span>
          </h2>
          <Link
            href="/game"
            className="rounded-full bg-primary px-8 py-3.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Play Eco Ben
          </Link>
        </div>
        <div className="flex flex-col justify-between gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>Eco Ben — a game about riding London clean.</p>
          <p>Green for clean. Amber for work to do.</p>
        </div>
      </div>
    </footer>
  )
}
