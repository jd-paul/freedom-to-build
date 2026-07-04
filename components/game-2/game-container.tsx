'use client'

import dynamic from 'next/dynamic'

import { GameUI } from '@/components/game-2/game-ui'

const GameScene = dynamic(
  () => import('@/components/game-2/scene').then((m) => m.GameScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#7dd3fc]">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-white/80">
          Building valley…
        </p>
      </div>
    ),
  },
)

export function GameContainer() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#7dd3fc]">
      {/* 3D scene */}
      <div className="absolute inset-0">
        <GameScene />
      </div>

      {/* Pixel/dither overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] opacity-25 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(0,0,0,0.5) 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />
      {/* Chunky scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 2px, transparent 2px, transparent 4px)',
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5]"
        style={{
          background:
            'radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.25) 100%)',
        }}
      />

      {/* UI layer */}
      <GameUI />
    </div>
  )
}
