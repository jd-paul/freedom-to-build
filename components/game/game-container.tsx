'use client'

import dynamic from 'next/dynamic'

import { GameHud } from '@/components/game/hud'

const GameScene = dynamic(
  () => import('@/components/game/scene').then((m) => m.GameScene),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full w-full items-center justify-center bg-[#0e1512]">
        <p className="font-sans text-xs font-bold uppercase tracking-[0.3em] text-white/60">
          Pumping the tyres…
        </p>
      </div>
    ),
  },
)

export function GameContainer() {
  return (
    <div className="relative h-dvh w-full overflow-hidden bg-[#0e1512]">
      {/* 3D scene */}
      <div className="absolute inset-0">
        <GameScene />
      </div>

      {/* Retro dither / halftone overlay, like the reference artstyle */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] opacity-40 mix-blend-overlay"
        style={{
          backgroundImage:
            'radial-gradient(circle at center, rgba(0,0,0,0.55) 1px, transparent 1px)',
          backgroundSize: '3px 3px',
        }}
      />
      {/* Subtle scanlines */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[5] opacity-15"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, rgba(0,0,0,0.4) 0px, rgba(0,0,0,0.4) 1px, transparent 1px, transparent 3px)',
        }}
      />

      {/* HUD */}
      <GameHud />
    </div>
  )
}
