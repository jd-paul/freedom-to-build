'use client'

import * as THREE from 'three'

export interface Borough {
  id: string
  name: string
  subtitle: string
  color: string
  position: [number, number, number]
  radius: number
  clean?: boolean
}

export interface Orb {
  id: number
  position: [number, number, number]
}

export interface Hazard {
  id: number
  position: [number, number, number]
}

export interface Landmark {
  id: string
  name: string
  position: [number, number, number]
  radius: number
}

export const BOROUGHS: Borough[] = [
  {
    id: 'camden',
    name: 'Camden',
    subtitle: 'Borough of Camden',
    color: '#ec4899',
    position: [-55, 0, -55],
    radius: 12,
  },
  {
    id: 'westminster',
    name: 'Westminster',
    subtitle: 'City of Westminster',
    color: '#3b82f6',
    position: [-65, 0, 35],
    radius: 12,
  },
  {
    id: 'hackney',
    name: 'Hackney',
    subtitle: 'London Borough of Hackney',
    color: '#22c55e',
    position: [55, 0, -45],
    radius: 12,
  },
  {
    id: 'southwark',
    name: 'Southwark',
    subtitle: 'London Borough of Southwark',
    color: '#f59e0b',
    position: [50, 0, 55],
    radius: 12,
  },
  {
    id: 'greenwich',
    name: 'Greenwich',
    subtitle: 'Royal Borough of Greenwich',
    color: '#a855f7',
    position: [-45, 0, 65],
    radius: 12,
  },
]

export const LANDMARKS: Landmark[] = [
  {
    id: 'bigben',
    name: 'Big Ben',
    position: [-80, 0, 45],
    radius: 10,
  },
  {
    id: 'towerbridge',
    name: 'Tower Bridge',
    position: [0, 0, 82],
    radius: 12,
  },
  {
    id: 'londoneye',
    name: 'London Eye',
    position: [40, 0, 15],
    radius: 11,
  },
  {
    id: 'shard',
    name: 'The Shard',
    position: [60, 0, 50],
    radius: 9,
  },
]

export const ORB_RADIUS = 2
export const HAZARD_RADIUS = 3.5
export const ORB_RESPAWN_DELAY = 8
export const HAZARD_SLOW_COOLDOWN = 2.5
export const HAZARD_SLOW_DURATION = 1.5

function mulberry32(seed: number) {
  let a = seed
  return () => {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function generateOrbs(count: number): Orb[] {
  const rand = mulberry32(99)
  const list: Orb[] = []
  let attempts = 0
  while (list.length < count && attempts < 3000) {
    attempts++
    const x = Math.round(((rand() - 0.5) * 170) / 2) * 2
    const z = Math.round(((rand() - 0.5) * 170) / 2) * 2
    if (Math.sqrt(x * x + z * z) < 14) continue
    if (BOROUGHS.some((b) => Math.hypot(x - b.position[0], z - b.position[2]) < b.radius + 4)) continue
    if (LANDMARKS.some((l) => Math.hypot(x - l.position[0], z - l.position[2]) < l.radius + 4)) continue
    list.push({ id: list.length, position: [x, 1.2, z] })
  }
  return list
}

function generateHazards(count: number): Hazard[] {
  const rand = mulberry32(101)
  const list: Hazard[] = []
  let attempts = 0
  while (list.length < count && attempts < 3000) {
    attempts++
    const x = Math.round(((rand() - 0.5) * 150) / 2) * 2
    const z = Math.round(((rand() - 0.5) * 150) / 2) * 2
    if (Math.sqrt(x * x + z * z) < 20) continue
    if (BOROUGHS.some((b) => Math.hypot(x - b.position[0], z - b.position[2]) < b.radius + 6)) continue
    if (LANDMARKS.some((l) => Math.hypot(x - l.position[0], z - l.position[2]) < l.radius + 5)) continue
    list.push({ id: list.length, position: [x, 2.2, z] })
  }
  return list
}

export const ORBS = generateOrbs(24)
export const HAZARDS = generateHazards(8)

export function distanceToPoint(
  position: [number, number, number],
  target: [number, number, number],
) {
  return new THREE.Vector3(...position).distanceTo(new THREE.Vector3(...target))
}
