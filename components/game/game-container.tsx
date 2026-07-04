'use client'

import dynamic from 'next/dynamic'

import { GameUI } from '@/components/game/game-ui'

const GameScene = dynamic(
  () => import('@/components/game/scene').then((m) => m.GameScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#c084fc]">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-white/80">
          Building voxels…
        </p>
      </div>
    ),
  },
)

export function GameContainer() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#c084fc]">
      {/* 3D scene */}
      <div className="absolute inset-0">
        <GameScene />
      </div>

      {/* Pixel/dither overlay for the oversized pixel feel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] opacity-30 mix-blend-multiply"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(0,0,0,0.45) 1px, transparent 1px)',
          backgroundSize: '4px 4px',
        }}
      />
      {/* Chunky black scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] opacity-10"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 2px, transparent 2px, transparent 4px)',
        }}
      />

      {/* UI layer */}
      <GameUI />
    </div>
  )
}
