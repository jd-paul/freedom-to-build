import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <p className="mb-6 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
          A cycling game set in London
        </p>
        <h1 className="max-w-4xl font-serif text-5xl font-medium leading-[1.05] tracking-tight text-balance md:text-7xl">
          Ride the city <em className="italic text-primary">clean</em>, one borough at a time.
        </h1>
        <div className="mt-10 grid gap-10 md:grid-cols-[1fr_2fr] md:items-end">
          <div className="flex flex-col gap-6">
            <p className="max-w-sm leading-relaxed text-muted-foreground text-pretty">
              London&apos;s air is thick with amber haze. Saddle up, weave through the streets,
              and pedal polluted districts back to green. No engines. No fumes. Just you and the bike.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                href="/game"
                className="rounded-full bg-primary px-7 py-3 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                Start riding
              </Link>
              <a
                href="#how-it-plays"
                className="text-sm font-medium text-foreground underline underline-offset-4 hover:text-primary"
              >
                How it plays
              </a>
            </div>
          </div>
          <figure className="overflow-hidden rounded-lg border border-border">
            <Image
              src="/images/eco-ben-artstyle.jpg"
              alt="Retro-styled in-game scene of a cargo bike riding along a curving road between hills"
              width={1280}
              height={640}
              priority
              className="h-auto w-full object-cover"
            />
            <figcaption className="border-t border-border bg-card px-4 py-3 text-xs uppercase tracking-widest text-muted-foreground">
              In-game — riding the long way round
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  )
}
