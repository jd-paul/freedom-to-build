'use client'

import * as THREE from 'three'

const PALETTE = {
  stone: '#d6d3d1',
  stoneDark: '#a8a29e',
  roof: '#451a03',
  clockFace: '#fef3c7',
  clockHand: '#1c1917',
  gold: '#facc15',
}

export function BigBen({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base pedestal */}
      <mesh position={[0, 1.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[7, 3, 7]} />
        <meshToonMaterial color={PALETTE.stoneDark} />
      </mesh>

      {/* Main tower shaft */}
      <mesh position={[0, 12, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 18, 4]} />
        <meshToonMaterial color={PALETTE.stone} />
      </mesh>

      {/* Vertical accent strips */}
      {[
        [-1.05, 12, 2.05],
        [1.05, 12, 2.05],
        [-1.05, 12, -2.05],
        [1.05, 12, -2.05],
        [2.05, 12, 1.05],
        [2.05, 12, -1.05],
        [-2.05, 12, 1.05],
        [-2.05, 12, -1.05],
      ].map(([x, y, z], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[0.25, 18, 0.25]} />
          <meshToonMaterial color={PALETTE.stoneDark} />
        </mesh>
      ))}

      {/* Clock section */}
      <mesh position={[0, 23, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.2, 5.2, 5.2]} />
        <meshToonMaterial color={PALETTE.stone} />
      </mesh>

      {/* Clock faces on each side */}
      <ClockFace rotation={[0, 0, 0]} position={[0, 23, 2.65]} />
      <ClockFace rotation={[0, Math.PI, 0]} position={[0, 23, -2.65]} />
      <ClockFace rotation={[0, Math.PI / 2, 0]} position={[2.65, 23, 0]} />
      <ClockFace rotation={[0, -Math.PI / 2, 0]} position={[-2.65, 23, 0]} />

      {/* Roof */}
      <mesh position={[0, 26.6, 0]} castShadow>
        <coneGeometry args={[3.8, 3.5, 4]} />
        <meshToonMaterial color={PALETTE.roof} />
      </mesh>

      {/* Spire */}
      <mesh position={[0, 29.5, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.35, 3.5, 8]} />
        <meshToonMaterial color={PALETTE.gold} />
      </mesh>
    </group>
  )
}

function ClockFace({
  position,
  rotation,
}: {
  position: [number, number, number]
  rotation: [number, number, number]
}) {
  return (
    <group position={position} rotation={rotation}>
      <mesh>
        <boxGeometry args={[3.2, 3.2, 0.15]} />
        <meshToonMaterial color={PALETTE.clockFace} />
      </mesh>
      {/* Hour hand */}
      <mesh position={[0, 0.5, 0.1]}>
        <boxGeometry args={[0.15, 1.1, 0.05]} />
        <meshBasicMaterial color={PALETTE.clockHand} />
      </mesh>
      {/* Minute hand */}
      <mesh position={[0.35, -0.25, 0.1]} rotation={[0, 0, -0.6]}>
        <boxGeometry args={[0.1, 1.4, 0.05]} />
        <meshBasicMaterial color={PALETTE.clockHand} />
      </mesh>
      {/* Center dot */}
      <mesh position={[0, 0, 0.12]}>
        <boxGeometry args={[0.25, 0.25, 0.06]} />
        <meshBasicMaterial color={PALETTE.gold} />
      </mesh>
    </group>
  )
}
