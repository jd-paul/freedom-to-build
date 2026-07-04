import { create } from 'zustand'

import { BOROUGHS, type Borough } from './world-data'
import { checkMission, createMission, type Mission } from './missions'

export type HelmetColor = '#ef4444' | '#f59e0b' | '#22c55e' | '#3b82f6' | '#a855f7' | '#ec4899'

export const HELMET_COLORS: { value: HelmetColor; label: string }[] = [
  { value: '#ef4444', label: 'Red' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#22c55e', label: 'Green' },
  { value: '#3b82f6', label: 'Blue' },
  { value: '#a855f7', label: 'Purple' },
  { value: '#ec4899', label: 'Pink' },
]

export interface GameState {
  started: boolean
  helmetColor: HelmetColor
  boroughs: Borough[]
  orbsCollected: number
  orbRespawns: Record<number, number>
  distance: number
  visitedLandmarks: Record<string, boolean>
  mission: Mission
  missionComplete: boolean
  summaryOpen: boolean
  start: () => void
  reset: () => void
  resetRun: () => void
  setHelmetColor: (color: HelmetColor) => void
  cleanBorough: (id: string) => void
  collectOrb: (id: number, respawnAt: number) => void
  addDistance: (delta: number) => void
  visitLandmark: (id: string) => void
  setMissionComplete: (complete: boolean) => void
  checkCurrentMission: () => boolean
}

export const useGameStore = create<GameState>((set, get) => ({
  started: false,
  helmetColor: '#ef4444',
  boroughs: BOROUGHS.map((b) => ({ ...b, clean: false })),
  orbsCollected: 0,
  orbRespawns: {},
  distance: 0,
  visitedLandmarks: {},
  mission: createMission(),
  missionComplete: false,
  summaryOpen: false,

  start: () => set({ started: true }),

  reset: () => set({ started: false, summaryOpen: true }),

  resetRun: () =>
    set({
      started: false,
      summaryOpen: false,
      boroughs: BOROUGHS.map((b) => ({ ...b, clean: false })),
      orbsCollected: 0,
      orbRespawns: {},
      distance: 0,
      visitedLandmarks: {},
      mission: createMission(),
      missionComplete: false,
    }),

  setHelmetColor: (helmetColor) => set({ helmetColor }),

  cleanBorough: (id) =>
    set((state) => ({
      boroughs: state.boroughs.map((b) =>
        b.id === id && !b.clean ? { ...b, clean: true } : b,
      ),
    })),

  collectOrb: (id, respawnAt) =>
    set((state) => ({
      orbsCollected: state.orbsCollected + 1,
      orbRespawns: { ...state.orbRespawns, [id]: respawnAt },
    })),

  addDistance: (delta) =>
    set((state) => ({ distance: state.distance + delta })),

  visitLandmark: (id) =>
    set((state) => ({
      visitedLandmarks: { ...state.visitedLandmarks, [id]: true },
    })),

  setMissionComplete: (missionComplete) => set({ missionComplete }),

  checkCurrentMission: () => checkMission(get(), get().mission),
}))

export const inputState = {
  forward: false,
  backward: false,
  left: false,
  right: false,
}
