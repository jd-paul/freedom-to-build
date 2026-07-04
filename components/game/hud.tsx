'use client'

import Link from 'next/link'
import { ArrowLeft, Keyboard, RotateCcw, Wind } from 'lucide-react'

import { inputState, useGameStore, ZONES } from '@/lib/game-store'

export function GameHud() {
  const started = useGameStore((s) => s.started)
  const cleaned = useGameStore((s) => s.cleaned)
  const lastCleaned = useGameStore((s) => s.lastCleaned)
  const start = useGameStore((s) => s.start)
  const reset = useGameStore((s) => s.reset)

  const cleanedCount = ZONES.filter((z) => cleaned[z.id]).length
  const allClean = cleanedCount === ZONES.length
  const lastZone = ZONES.find((z) => z.id === lastCleaned)

  return (
    <>
      {/* TIPS card — top left, like the reference */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 max-w-xs rounded-xl bg-black/55 p-4 backdrop-blur-sm md:left-6 md:top-6">
        <p className="mb-1 font-sans text-xs font-bold uppercase tracking-[0.25em] text-[#f5c542]">
          Tips
        </p>
        <p className="font-sans text-sm leading-relaxed text-white/90">
          Ride through the glowing amber arches to clear the smog. Turn every borough green to
          finish your shift.
        </p>
      </div>

      {/* Icon chips — top right, like the reference */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-6 md:top-6">
        <div
          className="hidden h-11 w-11 items-center justify-center rounded-xl bg-black/70 text-white md:flex"
          title="WASD or arrow keys to ride"
        >
          <Keyboard className="h-5 w-5" aria-hidden="true" />
          <span className="sr-only">Keyboard controls: WASD or arrow keys</span>
        </div>
        <button
          type="button"
          onClick={reset}
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/70 text-white transition-colors hover:bg-black/85"
          aria-label="Restart ride"
        >
          <RotateCcw className="h-5 w-5" aria-hidden="true" />
        </button>
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-black/70 text-white transition-colors hover:bg-black/85"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      {/* Air quality tracker — bottom left */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-10 rounded-xl bg-black/55 p-4 backdrop-blur-sm md:bottom-6 md:left-6">
        <p className="mb-2 flex items-center gap-2 font-sans text-xs font-bold uppercase tracking-[0.25em] text-white/70">
          <Wind className="h-3.5 w-3.5" aria-hidden="true" />
          Air quality
        </p>
        <ul className="flex flex-col gap-1.5">
          {ZONES.map((zone) => (
            <li key={zone.id} className="flex items-center gap-2 font-sans text-sm text-white/90">
              <span
                aria-hidden="true"
                className={`inline-block h-2.5 w-2.5 rounded-full ${
                  cleaned[zone.id] ? 'bg-[#57c785]' : 'bg-[#e0a13c]'
                }`}
              />
              <span className={cleaned[zone.id] ? 'line-through opacity-60' : ''}>{zone.name}</span>
              <span className="sr-only">{cleaned[zone.id] ? 'clean' : 'polluted'}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Zone cleaned toast */}
      {started && lastZone && !allClean && (
        <div
          key={lastZone.id}
          className="pointer-events-none absolute left-1/2 top-20 z-10 -translate-x-1/2 animate-in fade-in slide-in-from-top-2 rounded-xl bg-black/70 px-5 py-2.5 backdrop-blur-sm"
          role="status"
        >
          <p className="font-sans text-sm text-white">
            <span className="font-bold text-[#57c785]">{lastZone.name}</span> is breathing easy
          </p>
        </div>
      )}

      {/* Start overlay */}
      {!started && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-6">
          <div className="w-full max-w-md rounded-2xl bg-black/75 p-8 text-center backdrop-blur-md">
            <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#f5c542]">
              Eco Ben
            </p>
            <h1 className="mb-3 font-serif text-3xl text-white text-balance">
              Four boroughs are choking in amber smog.
            </h1>
            <p className="mb-6 font-sans text-sm leading-relaxed text-white/80">
              Pedal with <strong className="text-white">WASD</strong> or the{' '}
              <strong className="text-white">arrow keys</strong>. Find each glowing arch and ride
              through it to clean the air.
            </p>
            <button
              type="button"
              onClick={start}
              className="rounded-full bg-[#57c785] px-8 py-3 font-sans text-sm font-bold uppercase tracking-widest text-[#0b1f12] transition-transform hover:scale-105"
            >
              Start riding
            </button>
          </div>
        </div>
      )}

      {/* Victory overlay */}
      {started && allClean && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-6">
          <div className="w-full max-w-md rounded-2xl bg-black/75 p-8 text-center backdrop-blur-md">
            <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#57c785]">
              Shift complete
            </p>
            <h2 className="mb-3 font-serif text-3xl text-white text-balance">
              London is green again.
            </h2>
            <p className="mb-6 font-sans text-sm leading-relaxed text-white/80">
              All four boroughs cleaned. The city breathes because you pedalled.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                type="button"
                onClick={reset}
                className="rounded-full bg-[#57c785] px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest text-[#0b1f12] transition-transform hover:scale-105"
              >
                Ride again
              </button>
              <Link
                href="/"
                className="rounded-full bg-white/15 px-6 py-3 font-sans text-sm font-bold uppercase tracking-widest text-white transition-colors hover:bg-white/25"
              >
                Home
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Touch controls — mobile only */}
      <TouchControls />
    </>
  )
}

function TouchControls() {
  const bind = (key: keyof typeof inputState) => ({
    onPointerDown: (e: React.PointerEvent) => {
      e.preventDefault()
      inputState[key] = true
    },
    onPointerUp: () => {
      inputState[key] = false
    },
    onPointerLeave: () => {
      inputState[key] = false
    },
  })

  const btn =
    'flex h-14 w-14 select-none items-center justify-center rounded-xl bg-black/60 font-sans text-lg font-bold text-white active:bg-black/85'

  return (
    <div className="absolute bottom-4 right-4 z-10 flex items-end gap-2 md:hidden">
      <button type="button" className={btn} {...bind('left')} aria-label="Steer left">
        {'<'}
      </button>
      <div className="flex flex-col gap-2">
        <button type="button" className={btn} {...bind('forward')} aria-label="Pedal forward">
          {'^'}
        </button>
        <button type="button" className={btn} {...bind('backward')} aria-label="Brake">
          {'v'}
        </button>
      </div>
      <button type="button" className={btn} {...bind('right')} aria-label="Steer right">
        {'>'}
      </button>
    </div>
  )
}
