import type { GameState } from './store'

export type MissionType = 'cleanBoroughs' | 'collectOrbs' | 'rideDistance' | 'visitLandmark'

export interface Mission {
  id: string
  type: MissionType
  target: string | number | string[]
  description: string
}

export const MISSIONS: Mission[] = [
  {
    id: 'clean-camden-westminster',
    type: 'cleanBoroughs',
    target: ['camden', 'westminster'],
    description: 'Clean Camden and Westminster',
  },
  {
    id: 'collect-10-orbs',
    type: 'collectOrbs',
    target: 10,
    description: 'Collect 10 clean-air orbs',
  },
  {
    id: 'ride-1000m',
    type: 'rideDistance',
    target: 1000,
    description: 'Ride 1,000 metres',
  },
  {
    id: 'visit-big-ben',
    type: 'visitLandmark',
    target: 'bigben',
    description: 'Visit Big Ben',
  },
]

export function createMission(): Mission {
  return MISSIONS[Math.floor(Math.random() * MISSIONS.length)]
}

export function checkMission(state: GameState, mission: Mission): boolean {
  switch (mission.type) {
    case 'cleanBoroughs': {
      const ids = mission.target as string[]
      return ids.every((id) => state.boroughs.find((b) => b.id === id)?.clean)
    }
    case 'collectOrbs':
      return state.orbsCollected >= (mission.target as number)
    case 'rideDistance':
      return state.distance >= (mission.target as number)
    case 'visitLandmark':
      return Boolean(state.visitedLandmarks[mission.target as string])
    default:
      return false
  }
}
