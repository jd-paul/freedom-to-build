import type { Metadata } from 'next'

import { GameContainer } from '@/components/game-2/game-container'

export const metadata: Metadata = {
  title: 'Play Eco Ben — Mountain Valley',
  description:
    'Pedal through a dramatic mountain valley, spot Big Ben from the slopes, and keep the air clean.',
}

export default function Game2Page() {
  return (
    <main className="h-dvh w-full">
      <GameContainer />
    </main>
  )
}
