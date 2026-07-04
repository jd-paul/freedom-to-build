import type { Metadata } from 'next'

import { GameContainer } from '@/components/game-5/game-container'

export const metadata: Metadata = {
  title: 'Play Eco Ben — Sunset Diorama',
  description:
    'Pedal through a toy-like stylised nature diorama with Big Ben at sunset.',
}

export default function Game5Page() {
  return (
    <main className="h-dvh w-full">
      <GameContainer />
    </main>
  )
}
