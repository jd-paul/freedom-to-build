const boroughs = [
  { name: 'Hackney Marsh', status: 'clean' },
  { name: 'Camden Lock', status: 'polluted' },
  { name: 'Greenwich Rise', status: 'clean' },
  { name: 'Soho Circus', status: 'polluted' },
  { name: 'Battersea Reach', status: 'polluted' },
  { name: 'Richmond Green', status: 'clean' },
] as const

export function Boroughs() {
  return (
    <section id="boroughs" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            The boroughs
          </p>
          <h2 className="max-w-2xl font-serif text-3xl font-medium tracking-tight text-balance md:text-5xl">
            An air-quality ledger of the city
          </h2>
          <p className="max-w-xl leading-relaxed text-muted-foreground text-pretty">
            Every district keeps its own score. Green means the air is clear.
            Amber means it&apos;s waiting for a rider.
          </p>
        </div>
        <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-card">
          {boroughs.map((borough, index) => (
            <li key={borough.name} className="flex items-center justify-between gap-4 px-6 py-5">
              <div className="flex items-baseline gap-5">
                <span className="w-8 font-serif text-sm text-muted-foreground">
                  {String(index + 1).padStart(2, '0')}
                </span>
                <span className="font-serif text-lg font-medium md:text-xl">{borough.name}</span>
              </div>
              {borough.status === 'clean' ? (
                <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-secondary-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                  Clean air
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 rounded-full bg-accent px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-accent-foreground">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-foreground" aria-hidden="true" />
                  Polluted
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
