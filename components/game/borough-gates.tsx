'use client'

import { useGameStore } from './store'
import { BOROUGHS, type Borough } from './world-data'
import { Outline } from './voxel-world'

export function BoroughGates() {
  const boroughs = useGameStore((s) => s.boroughs)

  return (
    <>
      {boroughs.map((borough) => (
        <Gate key={borough.id} borough={borough} />
      ))}
    </>
  )
}

function Gate({ borough }: { borough: Borough }) {
  const archColor = borough.clean ? '#22c55e' : '#f59e0b'

  return (
    <group position={borough.position}>
      <Pillar color={borough.color} position={[-4, 2.5, 0]} />
      <Pillar color={borough.color} position={[4, 2.5, 0]} />

      <group position={[0, 5.5, 0]}>
        <mesh castShadow>
          <boxGeometry args={[9, 1, 1]} />
          <meshStandardMaterial
            color={archColor}
            emissive={archColor}
            emissiveIntensity={0.5}
          />
        </mesh>
        <Outline size={[9, 1, 1]} />
      </group>

      {borough.clean && (
        <pointLight color="#22c55e" intensity={2} distance={18} />
      )}
    </group>
  )
}

function Pillar({
  color,
  position,
}: {
  color: string
  position: [number, number, number]
}) {
  return (
    <group position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1.2, 5, 1.2]} />
        <meshToonMaterial color={color} />
      </mesh>
      <Outline size={[1.2, 5, 1.2]} />
    </group>
  )
}
