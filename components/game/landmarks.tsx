'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

import { LANDMARKS } from './world-data'
import { Outline } from './voxel-world'

const lm = (id: string) => LANDMARKS.find((l) => l.id === id)!.position

export function Landmarks() {
  return (
    <>
      <BigBen position={lm('bigben')} />
      <TowerBridge position={lm('towerbridge')} />
      <LondonEye position={lm('londoneye')} />
      <TheShard position={lm('shard')} />
    </>
  )
}

function VoxelBox({
  size,
  position,
  rotation,
  color,
}: {
  size: [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshToonMaterial color={color} />
      </mesh>
      <Outline size={size} />
    </group>
  )
}

function VoxelCylinder({
  args,
  position,
  rotation,
  color,
}: {
  args: [number, number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
}) {
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.CylinderGeometry(...args)),
    [args],
  )
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={args} />
        <meshToonMaterial color={color} />
      </mesh>
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color="#111111" linewidth={2} />
      </lineSegments>
    </group>
  )
}

function VoxelTorus({
  args,
  position,
  rotation,
  color,
}: {
  args: [number, number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
}) {
  const edges = useMemo(
    () => new THREE.EdgesGeometry(new THREE.TorusGeometry(...args)),
    [args],
  )
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow receiveShadow>
        <torusGeometry args={args} />
        <meshToonMaterial color={color} />
      </mesh>
      <lineSegments>
        <primitive object={edges} attach="geometry" />
        <lineBasicMaterial color="#111111" linewidth={2} />
      </lineSegments>
    </group>
  )
}

function BigBen({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <VoxelBox size={[3, 16, 3]} position={[0, 8, 0]} color="#8a7d6b" />
      <VoxelBox size={[3.6, 2.8, 3.6]} position={[0, 14, 0]} color="#7a6d5b" />
      <VoxelCylinder
        args={[0.9, 0.2, 3.5, 8]}
        position={[0, 17, 0]}
        color="#5a5045"
      />
      {/* Clock faces */}
      <VoxelCylinder
        args={[1, 1, 0.25, 12]}
        position={[0, 14, 1.8]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#fef3c7"
      />
      <VoxelCylinder
        args={[1, 1, 0.25, 12]}
        position={[0, 14, -1.8]}
        rotation={[Math.PI / 2, 0, 0]}
        color="#fef3c7"
      />
      <VoxelCylinder
        args={[1, 1, 0.25, 12]}
        position={[1.8, 14, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        color="#fef3c7"
      />
      <VoxelCylinder
        args={[1, 1, 0.25, 12]}
        position={[-1.8, 14, 0]}
        rotation={[Math.PI / 2, 0, Math.PI / 2]}
        color="#fef3c7"
      />
    </group>
  )
}

function TowerBridge({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Towers */}
      <VoxelBox size={[3.5, 14, 3.5]} position={[-7, 7, 0]} color="#60a5fa" />
      <VoxelBox size={[3.5, 14, 3.5]} position={[7, 7, 0]} color="#60a5fa" />
      {/* Tower roofs */}
      <VoxelCylinder
        args={[2.2, 0.1, 3, 4]}
        position={[-7, 15.5, 0]}
        color="#1e3a8a"
      />
      <VoxelCylinder
        args={[2.2, 0.1, 3, 4]}
        position={[7, 15.5, 0]}
        color="#1e3a8a"
      />
      {/* Upper walkway */}
      <VoxelBox size={[11, 0.8, 1.6]} position={[0, 12.5, 0]} color="#93c5fd" />
      {/* Lower walkway */}
      <VoxelBox size={[11, 0.6, 1.4]} position={[0, 6, 0]} color="#93c5fd" />
      {/* Suspension cables */}
      <VoxelBox
        size={[0.25, 11, 0.25]}
        position={[-3.5, 10.5, 0]}
        rotation={[0, 0, -0.25]}
        color="#1f2937"
      />
      <VoxelBox
        size={[0.25, 11, 0.25]}
        position={[3.5, 10.5, 0]}
        rotation={[0, 0, 0.25]}
        color="#1f2937"
      />
      {/* Bascules (simplified) */}
      <VoxelBox
        size={[5, 0.5, 1.2]}
        position={[-3.5, 1.2, 0]}
        rotation={[0, 0, 0.18]}
        color="#3b82f6"
      />
      <VoxelBox
        size={[5, 0.5, 1.2]}
        position={[3.5, 1.2, 0]}
        rotation={[0, 0, -0.18]}
        color="#3b82f6"
      />
    </group>
  )
}

function LondonEye({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* A-frame support */}
      <VoxelBox
        size={[0.4, 10, 0.4]}
        position={[-3, 5, 0]}
        rotation={[0, 0, -0.35]}
        color="#e5e7eb"
      />
      <VoxelBox
        size={[0.4, 10, 0.4]}
        position={[3, 5, 0]}
        rotation={[0, 0, 0.35]}
        color="#e5e7eb"
      />
      <VoxelBox size={[7, 0.5, 1]} position={[0, 0.5, 0]} color="#9ca3af" />

      {/* Wheel */}
      <VoxelTorus
        args={[7, 0.35, 8, 16]}
        position={[0, 10, 0]}
        color="#ffffff"
      />

      {/* Capsules */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i / 8) * Math.PI * 2
        const x = Math.cos(angle) * 7
        const y = Math.sin(angle) * 7
        return (
          <VoxelBox
            key={i}
            size={[0.9, 0.9, 0.9]}
            position={[x, 10 + y, 0]}
            color="#3b82f6"
          />
        )
      })}
    </group>
  )
}

function TheShard({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <VoxelBox size={[4.5, 5, 4.5]} position={[0, 2.5, 0]} color="#94a3b8" />
      <VoxelBox size={[3.5, 6, 3.5]} position={[0, 7.5, 0]} color="#cbd5e1" />
      <VoxelBox size={[2.6, 7, 2.6]} position={[0, 13.5, 0]} color="#e2e8f0" />
      <VoxelBox size={[1.6, 8, 1.6]} position={[0, 20.5, 0]} color="#f1f5f9" />
      <VoxelBox size={[0.7, 6, 0.7]} position={[0, 27, 0]} color="#ffffff" />
    </group>
  )
}
