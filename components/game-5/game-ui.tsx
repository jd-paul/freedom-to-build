'use client'

import Link from 'next/link'
import { ArrowLeft, RotateCcw } from 'lucide-react'

import {
  HELMET_COLORS,
  inputState,
  useGameStore,
} from '@/components/game-5/store'

export function GameUI() {
  const started = useGameStore((s) => s.started)
  const helmetColor = useGameStore((s) => s.helmetColor)
  const start = useGameStore((s) => s.start)
  const reset = useGameStore((s) => s.reset)
  const setHelmetColor = useGameStore((s) => s.setHelmetColor)

  return (
    <>
      {/* Top-right controls */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-6 md:top-6">
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

      {/* Title card + menu overlay */}
      {!started && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-6">
          <div className="w-full max-w-lg rounded-2xl border-4 border-black bg-[#fff4e6] p-8 text-center shadow-[8px_8px_0_0_#000]">
            <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#d97706]">
              Ride London Clean
            </p>
            <h1 className="mb-2 font-sans text-5xl font-black uppercase leading-none tracking-tight text-black md:text-6xl">
              Sunset Diorama
            </h1>
            <p className="mb-6 font-sans text-sm font-bold uppercase tracking-widest text-black/70">
              A toy-like nature ride at golden hour
            </p>

            {/* Helmet color picker */}
            <div className="mb-8">
              <p className="mb-3 font-sans text-xs font-bold uppercase tracking-widest text-black/60">
                Pick your helmet
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {HELMET_COLORS.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setHelmetColor(value)}
                    title={label}
                    className={`h-10 w-10 rounded-lg border-4 shadow-[3px_3px_0_0_#000] transition-transform hover:scale-110 ${
                      helmetColor === value ? 'border-black' : 'border-transparent'
                    }`}
                    style={{ backgroundColor: value }}
                    aria-label={`Select ${label} helmet`}
                    aria-pressed={helmetColor === value}
                  />
                ))}
              </div>
            </div>

            <p className="mb-6 font-sans text-sm leading-relaxed text-black/80">
              Pedal with <strong className="text-black">WASD</strong> or the{' '}
              <strong className="text-black">arrow keys</strong>. Explore the hills and visit Big Ben at sunset.
            </p>

            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={start}
                className="rounded-xl border-4 border-black bg-[#ef4444] px-10 py-3 font-sans text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0_0_#000] transition-transform hover:scale-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                PLAY
              </button>
              <Link
                href="/"
                className="rounded-xl border-4 border-black bg-white px-10 py-3 font-sans text-sm font-black uppercase tracking-widest text-black shadow-[5px_5px_0_0_#000] transition-transform hover:scale-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
              >
                BACK
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
    'flex h-14 w-14 select-none items-center justify-center rounded-xl border-2 border-black bg-black/70 font-sans text-lg font-bold text-white active:bg-black/90'

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
