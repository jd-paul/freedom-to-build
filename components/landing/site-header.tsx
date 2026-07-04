import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-border">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl font-semibold tracking-tight">
          Eco Ben
        </Link>
        <nav aria-label="Main" className="flex items-center gap-6">
          <a
            href="#how-it-plays"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            How it plays
          </a>
          <a
            href="#boroughs"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground sm:inline"
          >
            The boroughs
          </a>
          <Link
            href="/game"
            className="rounded-full bg-primary px-5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Play the game
          </Link>
        </nav>
      </div>
    </header>
  )
}
