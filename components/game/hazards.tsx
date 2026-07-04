'use client'

import { useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

import { HAZARDS } from './world-data'
import { Outline } from './voxel-world'

export function Hazards() {
  return (
    <>
      {HAZARDS.map((hazard) => (
        <SmogCloud key={hazard.id} hazard={hazard} />
      ))}
    </>
  )
}

function SmogCloud({
  hazard,
}: {
  hazard: { id: number; position: [number, number, number] }
}) {
  const ref = useRef<THREE.Group>(null)
  const base = useMemo(
    () => new THREE.Vector3(...hazard.position),
    [hazard.position],
  )

  useFrame((state) => {
    const g = ref.current
    if (!g) return

    const t = state.clock.getElapsedTime()
    g.position.x = base.x + Math.sin(t * 0.25 + hazard.id) * 5
    g.position.z = base.z + Math.cos(t * 0.18 + hazard.id) * 5
    g.position.y = base.y + Math.sin(t * 1.2 + hazard.id) * 0.4
    g.rotation.y = t * 0.1 + hazard.id
  })

  return (
    <group ref={ref} position={hazard.position}>
      <CloudPuff position={[0, 0, 0]} size={[2, 1.2, 1.8]} color="#f59e0b" />
      <CloudPuff
        position={[1.1, 0.4, 0.2]}
        size={[1.4, 1, 1.2]}
        color="#f59e0b"
      />
      <CloudPuff
        position={[-0.9, 0.3, -0.2]}
        size={[1.6, 1, 1.4]}
        color="#f59e0b"
      />
      <CloudPuff
        position={[0.2, 0.7, 0.5]}
        size={[1.2, 0.9, 1.1]}
        color="#f59e0b"
      />
    </group>
  )
}

function CloudPuff({
  position,
  size,
  color,
}: {
  position: [number, number, number]
  size: [number, number, number]
  color: string
}) {
  return (
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          transparent
          opacity={0.72}
          flatShading
        />
      </mesh>
      <Outline size={size} />
    </group>
  )
}
