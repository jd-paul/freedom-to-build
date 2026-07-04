'use client'

import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { useGameStore } from './store'
import { ORBS } from './world-data'

export function Collectibles() {
  const respawns = useGameStore((s) => s.orbRespawns)

  return (
    <>
      {ORBS.map((orb) => (
        <Orb key={orb.id} orb={orb} respawnAt={respawns[orb.id] ?? 0} />
      ))}
    </>
  )
}

function Orb({
  orb,
  respawnAt,
}: {
  orb: { id: number; position: [number, number, number] }
  respawnAt: number
}) {
  const ref = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    const g = ref.current
    if (!g) return

    const now = state.clock.getElapsedTime()
    if (respawnAt > now) {
      g.visible = false
      return
    }

    g.visible = true
    g.position.y = orb.position[1] + Math.sin(now * 2 + orb.id) * 0.35
    g.rotation.y += delta * 1.5
    g.rotation.z = Math.sin(now * 1.5 + orb.id) * 0.15
  })

  return (
    <group ref={ref} position={orb.position}>
      <mesh castShadow>
        <icosahedronGeometry args={[0.45, 0]} />
        <meshStandardMaterial
          color="#22c55e"
          emissive="#22c55e"
          emissiveIntensity={0.35}
          flatShading
        />
      </mesh>
      <pointLight color="#22c55e" intensity={1} distance={5} />
    </group>
  )
}
