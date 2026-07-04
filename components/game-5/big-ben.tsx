'use client'

import * as THREE from 'three'

interface BigBenProps {
  position?: [number, number, number]
}

const STONE = '#d8c4a8'
const DARK_STONE = '#b8a488'
const ROOF = '#5c4033'
const GOLD = '#f6c453'
const WINDOW = '#2a2a35'

function Box({
  size,
  position,
  color,
}: {
  size: [number, number, number]
  position?: [number, number, number]
  color: string
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshToonMaterial color={color} />
    </mesh>
  )
}

export function BigBen({ position = [0, 0, 0] }: BigBenProps) {
  return (
    <group position={position}>
      {/* Clock tower base */}
      <Box size={[3.6, 7, 3.6]} position={[0, 3.5, 0]} color={STONE} />
      {/* Base trim */}
      <Box size={[3.8, 0.4, 3.8]} position={[0, 0.2, 0]} color={DARK_STONE} />
      <Box size={[3.8, 0.3, 3.8]} position={[0, 7.15, 0]} color={DARK_STONE} />

      {/* Clock section */}
      <Box size={[4.0, 3.2, 4.0]} position={[0, 8.9, 0]} color={STONE} />
      {/* Clock faces */}
      {[
        [0, 8.9, 2.01],
        [0, 8.9, -2.01],
        [2.01, 8.9, 0],
        [-2.01, 8.9, 0],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <Box
            size={Math.abs(z) > 1.9 ? [2.2, 2.2, 0.08] : [0.08, 2.2, 2.2]}
            position={[0, 0, 0]}
            color={WINDOW}
          />
          {/* Gold clock rim */}
          <Box
            size={Math.abs(z) > 1.9 ? [2.5, 0.15, 0.1] : [0.1, 0.15, 2.5]}
            position={[0, 1.1, 0]}
            color={GOLD}
          />
          <Box
            size={Math.abs(z) > 1.9 ? [2.5, 0.15, 0.1] : [0.1, 0.15, 2.5]}
            position={[0, -1.1, 0]}
            color={GOLD}
          />
          <Box
            size={Math.abs(z) > 1.9 ? [0.15, 2.5, 0.1] : [0.1, 2.5, 0.15]}
            position={[1.1, 0, 0]}
            color={GOLD}
          />
          <Box
            size={Math.abs(z) > 1.9 ? [0.15, 2.5, 0.1] : [0.1, 2.5, 0.15]}
            position={[-1.1, 0, 0]}
            color={GOLD}
          />
        </group>
      ))}

      {/* Spire base */}
      <Box size={[2.6, 1.2, 2.6]} position={[0, 11.1, 0]} color={DARK_STONE} />
      {/* Spire */}
      <mesh position={[0, 13.6, 0]} castShadow>
        <coneGeometry args={[1.3, 4, 4]} />
        <meshToonMaterial color={ROOF} />
      </mesh>
      {/* Golden finial */}
      <mesh position={[0, 16.2, 0]} castShadow>
        <sphereGeometry args={[0.35, 8, 8]} />
        <meshToonMaterial color={GOLD} />
      </mesh>

      {/* Pedestal plaza */}
      <Box size={[10, 0.5, 10]} position={[0, -0.25, 0]} color="#9e8b72" />
    </group>
  )
}
