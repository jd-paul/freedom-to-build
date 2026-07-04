import type { Metadata } from 'next'

import { GameContainer } from '@/components/game/game-container'

export const metadata: Metadata = {
  title: 'Play Eco Ben — Ride London Clean',
  description:
    'Pedal through a stylised London, find the glowing arches, and clean the amber smog out of every borough.',
}

export default function GamePage() {
  return (
    <main className="h-dvh w-full">
      <GameContainer />
    </main>
  )
}
