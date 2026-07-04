import { create } from 'zustand'

export type HelmetColor = '#ef4444' | '#f59e0b' | '#22c55e' | '#3b82f6' | '#a855f7' | '#ec4899'

export const HELMET_COLORS: { value: HelmetColor; label: string }[] = [
  { value: '#ef4444', label: 'Red' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#22c55e', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#a855f7', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
]

interface Game3State {
  started: boolean
  helmetColor: HelmetColor
  start: () => void
  reset: () => void
  setHelmetColor: (color: HelmetColor) => void
}

export const useGameStore = create<Game3State>((set) => ({
  started: false,
  helmetColor: '#ef4444',
  start: () => set({ started: true }),
  reset: () => set({ started: false }),
  setHelmetColor: (helmetColor) => set({ helmetColor }),
}))

export const inputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
}
