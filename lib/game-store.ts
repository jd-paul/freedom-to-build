import { create } from 'zustand'

export type ZoneId = 'camden' | 'soho' | 'battersea' | 'docklands'

export interface ZoneDef {
  id: ZoneId
  name: string
  /** Center of the zone on the ground plane */
  position: [number, number, number]
  /** Radius of the polluted district */
  radius: number
  /** Rotation (Y) of the clean-air gate */
  gateRotation: number
}

export const ZONES: ZoneDef[] = [
  { id: 'camden', name: 'Camden Lock', position: [-55, 0, -55], radius: 22, gateRotation: Math.PI / 4 },
  { id: 'soho', name: 'Soho Circus', position: [60, 0, -45], radius: 20, gateRotation: -Math.PI / 5 },
  { id: 'battersea', name: 'Battersea Reach', position: [-60, 0, 55], radius: 22, gateRotation: Math.PI / 2.5 },
  { id: 'docklands', name: 'Docklands Edge', position: [65, 0, 60], radius: 20, gateRotation: -Math.PI / 2 },
]

interface GameState {
  started: boolean
  cleaned: Record<ZoneId, boolean>
  lastCleaned: ZoneId | null
  start: () => void
  cleanZone: (id: ZoneId) => void
  reset: () => void
}

const initialCleaned: Record<ZoneId, boolean> = {
  camden: false,
  soho: false,
  battersea: false,
  docklands: false,
}

export const useGameStore = create<GameState>((set) => ({
  started: false,
  cleaned: { ...initialCleaned },
  lastCleaned: null,
  start: () => set({ started: true }),
  cleanZone: (id) =>
    set((state) =>
      state.cleaned[id]
        ? state
        : { cleaned: { ...state.cleaned, [id]: true }, lastCleaned: id },
    ),
  reset: () => set({ started: false, cleaned: { ...initialCleaned }, lastCleaned: null }),
}))

/**
 * Shared keyboard/touch input state, mutated by listeners and
 * read every frame inside the 3D scene.
 */
export const inputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
}
