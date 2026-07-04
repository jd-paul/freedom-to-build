const steps = [
  {
    number: '01',
    title: 'Explore the streets',
    body: 'Steer your bike through a stylised London — past terraces, parks and the river — using just the arrow keys.',
  },
  {
    number: '02',
    title: 'Find the amber zones',
    body: 'Polluted districts glow amber under a heavy haze. The further you ride, the more of the city you uncover.',
  },
  {
    number: '03',
    title: 'Ride them green',
    body: 'Pass through the clean-air gates in each zone. Every gate you clear lifts the haze and turns the district green.',
  },
]

export function HowItPlays() {
  return (
    <section id="how-it-plays" className="border-b border-border">
      <div className="mx-auto max-w-6xl px-6 py-16 md:py-24">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            How it plays
          </p>
          <h2 className="max-w-2xl font-serif text-3xl font-medium tracking-tight text-balance md:text-5xl">
            Three simple rules of the road
          </h2>
        </div>
        <ol className="grid gap-px overflow-hidden rounded-lg border border-border bg-border md:grid-cols-3">
          {steps.map((step) => (
            <li key={step.number} className="flex flex-col gap-4 bg-card p-8">
              <span className="font-serif text-4xl text-primary">{step.number}</span>
              <h3 className="font-serif text-xl font-medium">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground text-pretty">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
