'use client'

import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

import { useGameStore } from './store'
import {
  BOROUGHS,
  HAZARDS,
  HAZARD_RADIUS,
  HAZARD_SLOW_COOLDOWN,
  HAZARD_SLOW_DURATION,
  LANDMARKS,
  ORBS,
  ORB_RADIUS,
  ORB_RESPAWN_DELAY,
} from './world-data'
import { checkMission } from './missions'
import type { CyclistHandle } from './voxel-cyclist'

interface GameLoopProps {
  cyclistRef: React.RefObject<CyclistHandle | null>
}

export function GameLoop({ cyclistRef }: GameLoopProps) {
  const lastPos = useRef<THREE.Vector3 | null>(null)
  const hazardCooldowns = useRef<Record<number, number>>({})

  useFrame((state) => {
    const cyclist = cyclistRef.current
    if (!cyclist) return

    const store = useGameStore.getState()
    const pos = cyclist.getPosition()
    const now = state.clock.getElapsedTime()

    if (!store.started) {
      lastPos.current = pos.clone()
      return
    }

    // Distance ridden
    if (lastPos.current) {
      const d = pos.distanceTo(lastPos.current)
      if (d > 0 && d < 30) {
        store.addDistance(d)
      }
    }
    lastPos.current = pos.clone()

    // Borough gates
    store.boroughs.forEach((b) => {
      if (!b.clean && pos.distanceTo(new THREE.Vector3(...b.position)) < b.radius) {
        store.cleanBorough(b.id)
      }
    })

    // Clean-air orbs
    ORBS.forEach((orb) => {
      const respawnAt = store.orbRespawns[orb.id] ?? 0
      if (
        now >= respawnAt &&
        pos.distanceTo(new THREE.Vector3(...orb.position)) < ORB_RADIUS
      ) {
        store.collectOrb(orb.id, now + ORB_RESPAWN_DELAY)
      }
    })

    // Smog hazards
    HAZARDS.forEach((h) => {
      const cooldown = hazardCooldowns.current[h.id] ?? 0
      if (
        now >= cooldown &&
        pos.distanceTo(new THREE.Vector3(...h.position)) < HAZARD_RADIUS
      ) {
        cyclist.applySlow(now + HAZARD_SLOW_DURATION)
        hazardCooldowns.current[h.id] = now + HAZARD_SLOW_COOLDOWN
      }
    })

    // Landmarks
    LANDMARKS.forEach((lm) => {
      if (
        !store.visitedLandmarks[lm.id] &&
        pos.distanceTo(new THREE.Vector3(...lm.position)) < lm.radius
      ) {
        store.visitLandmark(lm.id)
      }
    })

    // Mission check
    if (!store.missionComplete && checkMission(store, store.mission)) {
      store.setMissionComplete(true)
    }

    // End run when every borough is clean
    if (store.boroughs.every((b) => b.clean)) {
      store.reset()
    }
  })

  return null
}
