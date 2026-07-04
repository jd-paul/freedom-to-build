'use client'

import Link from 'next/link'
import { ArrowLeft, Check, Flag, Leaf, RotateCcw, Target } from 'lucide-react'

import {
  HELMET_COLORS,
  inputState,
  useGameStore,
} from '@/components/game/store'

export function GameUI() {
  const started = useGameStore((s) => s.started)
  const summaryOpen = useGameStore((s) => s.summaryOpen)

  return (
    <>
      {/* Top-right controls */}
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 md:right-6 md:top-6">
        <RestartButton />
        <Link
          href="/"
          className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-black/70 text-white transition-colors hover:bg-black/85"
          aria-label="Back to home"
        >
          <ArrowLeft className="h-5 w-5" aria-hidden="true" />
        </Link>
      </div>

      {/* In-game HUD */}
      {started && (
        <>
          <AirQualityMeter />
          <BoroughChecklist />
          <MissionPanel />
        </>
      )}

      {/* Run summary */}
      {summaryOpen && <RunSummary />}

      {/* Title card + menu overlay */}
      {!started && !summaryOpen && <TitleCard />}

      {/* Touch controls — mobile only */}
      <TouchControls />
    </>
  )
}

function RestartButton() {
  const started = useGameStore((s) => s.started)
  const reset = useGameStore((s) => s.reset)
  const resetRun = useGameStore((s) => s.resetRun)

  return (
    <button
      type="button"
      onClick={() => (started ? reset() : resetRun())}
      className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-black/70 text-white transition-colors hover:bg-black/85"
      aria-label="Restart ride"
    >
      <RotateCcw className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}

function AirQualityMeter() {
  const boroughs = useGameStore((s) => s.boroughs)
  const cleaned = boroughs.filter((b) => b.clean).length
  const pct = Math.round((cleaned / boroughs.length) * 100)

  return (
    <div className="absolute left-1/2 top-4 z-10 w-64 -translate-x-1/2 rounded-2xl border-4 border-black bg-[#fdf4ff] p-3 shadow-[4px_4px_0_0_#000] md:top-6 md:w-80">
      <div className="flex items-center justify-between font-sans text-xs font-black uppercase tracking-widest text-black">
        <span>Air Quality</span>
        <span>{pct}%</span>
      </div>
      <div className="mt-2 h-4 overflow-hidden rounded-full border-2 border-black bg-gray-200">
        <div
          className="h-full transition-all duration-500 ease-out"
          style={{
            width: `${pct}%`,
            background:
              'linear-gradient(90deg, #ef4444 0%, #eab308 50%, #22c55e 100%)',
          }}
        />
      </div>
    </div>
  )
}

function BoroughChecklist() {
  const boroughs = useGameStore((s) => s.boroughs)
  const orbsCollected = useGameStore((s) => s.orbsCollected)

  return (
    <div className="absolute left-4 top-20 z-10 w-52 rounded-2xl border-4 border-black bg-[#fdf4ff] p-4 shadow-[4px_4px_0_0_#000] md:left-6 md:top-24">
      <div className="mb-3 flex items-center gap-2 font-sans text-xs font-black uppercase tracking-widest text-black">
        <Leaf className="h-4 w-4 text-green-600" />
        <span>Orbs: {orbsCollected}</span>
      </div>
      <div className="space-y-2">
        {boroughs.map((b) => (
          <div
            key={b.id}
            className={`flex items-center justify-between font-sans text-xs font-bold uppercase tracking-wide ${
              b.clean ? 'text-black/40' : 'text-black'
            }`}
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full border border-black"
                style={{ backgroundColor: b.color }}
              />
              <span className={b.clean ? 'line-through' : ''}>{b.name}</span>
            </div>
            {b.clean && <Check className="h-4 w-4 text-green-600" />}
          </div>
        ))}
      </div>
    </div>
  )
}

function MissionPanel() {
  const mission = useGameStore((s) => s.mission)
  const complete = useGameStore((s) => s.missionComplete)

  return (
    <div className="absolute bottom-4 left-4 z-10 rounded-2xl border-4 border-black bg-[#fdf4ff] p-3 shadow-[4px_4px_0_0_#000] md:bottom-6 md:left-6">
      <div className="flex items-center gap-2 font-sans text-xs font-black uppercase tracking-widest text-black">
        <Target className="h-4 w-4 text-purple-600" />
        <span>Mission</span>
      </div>
      <div className="mt-1 flex items-center gap-2 font-sans text-sm font-bold text-black">
        <span>{mission.description}</span>
        {complete && <Check className="h-4 w-4 text-green-600" />}
      </div>
    </div>
  )
}

function RunSummary() {
  const distance = useGameStore((s) => s.distance)
  const boroughs = useGameStore((s) => s.boroughs)
  const orbsCollected = useGameStore((s) => s.orbsCollected)
  const mission = useGameStore((s) => s.mission)
  const missionComplete = useGameStore((s) => s.missionComplete)
  const resetRun = useGameStore((s) => s.resetRun)

  const cleaned = boroughs.filter((b) => b.clean).length
  const co2 = (distance / 100) * 0.2

  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 p-6">
      <div className="w-full max-w-md rounded-2xl border-4 border-black bg-[#fdf4ff] p-6 text-center shadow-[8px_8px_0_0_#000]">
        <p className="mb-1 font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#a855f7]">
          Run Complete
        </p>
        <h2 className="mb-4 font-sans text-4xl font-black uppercase leading-none tracking-tight text-black">
          Ride Summary
        </h2>

        <div className="grid grid-cols-2 gap-3 text-left">
          <Stat label="Distance" value={`${Math.round(distance)} m`} />
          <Stat
            label="Boroughs cleaned"
            value={`${cleaned} / ${boroughs.length}`}
          />
          <Stat label="Orbs collected" value={String(orbsCollected)} />
          <Stat label="CO₂ saved" value={`${co2.toFixed(2)} kg`} />
        </div>

        <div
          className={`mt-4 rounded-xl border-2 border-black p-3 text-center font-sans text-sm font-black uppercase tracking-widest ${
            missionComplete ? 'bg-green-400 text-black' : 'bg-red-400 text-black'
          }`}
        >
          Mission: {missionComplete ? 'Success' : 'Failed'}
        </div>

        <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <button
            type="button"
            onClick={resetRun}
            className="rounded-xl border-4 border-black bg-[#ef4444] px-10 py-3 font-sans text-sm font-black uppercase tracking-widest text-white shadow-[5px_5px_0_0_#000] transition-transform hover:scale-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Ride again
          </button>
          <Link
            href="/"
            className="rounded-xl border-4 border-black bg-white px-10 py-3 font-sans text-sm font-black uppercase tracking-widest text-black shadow-[5px_5px_0_0_#000] transition-transform hover:scale-105 active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
          >
            Home
          </Link>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border-2 border-black bg-white p-3">
      <p className="font-sans text-[10px] font-bold uppercase tracking-widest text-black/60">
        {label}
      </p>
      <p className="font-sans text-xl font-black text-black">{value}</p>
    </div>
  )
}

function TitleCard() {
  const helmetColor = useGameStore((s) => s.helmetColor)
  const start = useGameStore((s) => s.start)
  const setHelmetColor = useGameStore((s) => s.setHelmetColor)
  const mission = useGameStore((s) => s.mission)

  return (
    <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/50 p-6">
      <div className="w-full max-w-lg rounded-2xl border-4 border-black bg-[#fdf4ff] p-8 text-center shadow-[8px_8px_0_0_#000]">
        <p className="mb-2 font-sans text-xs font-bold uppercase tracking-[0.3em] text-[#a855f7]">
          Ride London Clean
        </p>
        <h1 className="mb-2 font-sans text-5xl font-black uppercase leading-none tracking-tight text-black md:text-6xl">
          Eco Ben
        </h1>
        <p className="mb-6 font-sans text-sm font-bold uppercase tracking-widest text-black/70">
          A chunky voxel ride through the city
        </p>

        {/* Mission preview */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-xl border-2 border-black bg-white px-4 py-2">
          <Flag className="h-4 w-4 text-purple-600" />
          <span className="font-sans text-xs font-black uppercase tracking-widest text-black">
            Mission: {mission.description}
          </span>
        </div>

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
          <strong className="text-black">arrow keys</strong>. Find the glowing
          arches, collect clean-air orbs, and dodge the smog clouds.
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
