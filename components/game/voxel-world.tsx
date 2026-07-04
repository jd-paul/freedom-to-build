'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const PALETTE = {
  grass: '#5b9e4c',
  grassDark: '#4a8540',
  dirt: '#7a5c3a',
  road: '#6b6e75',
  roadLine: '#e8e2d2',
  guardrail: '#c65a2e',
  wood: '#6d5138',
  leaves: ['#3e8e42', '#4c9e50', '#367a3a'],
  statue: '#c93a3a',
  sky: '#d9a6ff',
}

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

function Outline({
  size,
  position,
  rotation,
}: {
  size: [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
}) {
  const edges = useMemo(() => new THREE.EdgesGeometry(new THREE.BoxGeometry(...size)), [size])
  return (
    <lineSegments position={position} rotation={rotation}>
      <primitive object={edges} attach="geometry" />
      <lineBasicMaterial color="#111111" linewidth={2} />
    </lineSegments>
  )
}

export function VoxelWorld() {
  const blocks = useMemo(() => {
    const rand = mulberry32(42)
    const list: { x: number; z: number; h: number; color: string }[] = []
    for (let i = 0; i < 280; i++) {
      const x = Math.round(((rand() - 0.5) * 220) / 2) * 2
      const z = Math.round(((rand() - 0.5) * 220) / 2) * 2
      if (Math.abs(x) < 10 || Math.abs(z) < 10) continue
      if (Math.sqrt(x * x + z * z) < 14) continue
      const h = 0.5 + rand() * 0.6
      list.push({
        x,
        z,
        h,
        color: rand() > 0.5 ? PALETTE.grass : PALETTE.grassDark,
      })
    }
    return list
  }, [])

  const trees = useMemo(() => {
    const rand = mulberry32(7)
    const list: { x: number; z: number; height: number; leafColor: string }[] = []
    for (let i = 0; i < 70; i++) {
      const x = Math.round(((rand() - 0.5) * 190) / 2) * 2
      const z = Math.round(((rand() - 0.5) * 190) / 2) * 2
      if (Math.abs(x) < 12 || Math.abs(z) < 12) continue
      list.push({
        x,
        z,
        height: 1.5 + rand() * 1.5,
        leafColor: PALETTE.leaves[Math.floor(rand() * PALETTE.leaves.length)],
      })
    }
    return list
  }, [])

  const clouds = useMemo(() => {
    const rand = mulberry32(21)
    const list: { x: number; y: number; z: number; scale: number }[] = []
    for (let i = 0; i < 16; i++) {
      list.push({
        x: (rand() - 0.5) * 160,
        y: 18 + rand() * 12,
        z: (rand() - 0.5) * 160,
        scale: 1 + rand() * 2,
      })
    }
    return list
  }, [])

  return (
    <group>
      {/* Ground plane */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <boxGeometry args={[240, 240, 1]} />
        <meshToonMaterial color={PALETTE.grass} />
      </mesh>

      {/* Voxel grass bumps */}
      {blocks.map((b, i) => (
        <group key={i} position={[b.x, -0.25 + b.h / 2, b.z]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[2, b.h, 2]} />
            <meshToonMaterial color={b.color} />
          </mesh>
          <Outline size={[2, b.h, 2]} />
        </group>
      ))}

      {/* Road */}
      <group position={[0, -0.48, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <boxGeometry args={[13, 240, 0.15]} />
          <meshToonMaterial color={PALETTE.road} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} receiveShadow>
          <boxGeometry args={[13, 240, 0.15]} />
          <meshToonMaterial color={PALETTE.road} />
        </mesh>
        {/* Center lines */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.08, 0]}>
          <boxGeometry args={[0.35, 240, 0.02]} />
          <meshBasicMaterial color={PALETTE.roadLine} />
        </mesh>
        <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.08, 0]}>
          <boxGeometry args={[0.35, 240, 0.02]} />
          <meshBasicMaterial color={PALETTE.roadLine} />
        </mesh>
      </group>

      {/* Guardrails */}
      <Guardrails />

      {/* Trees */}
      {trees.map((t, i) => (
        <VoxelTree key={i} position={[t.x, 0, t.z]} height={t.height} leafColor={t.leafColor} />
      ))}

      {/* Capybara statue in the distance */}
      <CapybaraStatue position={[0, 0, -55]} />

      {/* Chunky clouds */}
      {clouds.map((c, i) => (
        <Cloud key={i} position={[c.x, c.y, c.z]} scale={c.scale} />
      ))}
    </group>
  )
}

function Guardrails() {
  const posts = useMemo(() => {
    const list: { x: number; z: number; rot: number }[] = []
    for (let z = -110; z <= 110; z += 8) {
      list.push({ x: -6.2, z, rot: 0 })
      list.push({ x: 6.2, z, rot: 0 })
    }
    for (let x = -110; x <= 110; x += 8) {
      list.push({ x, z: -6.2, rot: Math.PI / 2 })
      list.push({ x, z: 6.2, rot: Math.PI / 2 })
    }
    return list
  }, [])

  return (
    <group position={[0, -0.2, 0]}>
      {posts.map((p, i) => (
        <group key={i} position={[p.x, 0, p.z]} rotation={[0, p.rot, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.25, 1.1, 0.25]} />
            <meshToonMaterial color={PALETTE.guardrail} />
          </mesh>
          <Outline size={[0.25, 1.1, 0.25]} />
          <mesh position={[4, 0.45, 0]}>
            <boxGeometry args={[8, 0.12, 0.12]} />
            <meshToonMaterial color={PALETTE.guardrail} />
          </mesh>
        </group>
      ))}
    </group>
  )
}

function VoxelTree({
  position,
  height,
  leafColor,
}: {
  position: [number, number, number]
  height: number
  leafColor: string
}) {
  return (
    <group position={position}>
      {/* Trunk */}
      <group position={[0, height / 2, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.5, height, 0.5]} />
          <meshToonMaterial color={PALETTE.wood} />
        </mesh>
        <Outline size={[0.5, height, 0.5]} />
      </group>
      {/* Leaves */}
      <group position={[0, height + 0.8, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[2.2, 1.6, 2.2]} />
          <meshToonMaterial color={leafColor} />
        </mesh>
        <Outline size={[2.2, 1.6, 2.2]} />
        <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1.0, 1.6]} />
          <meshToonMaterial color={leafColor} />
        </mesh>
        <Outline size={[1.6, 1.0, 1.6]} position={[0, 1.1, 0]} />
      </group>
    </group>
  )
}

function CapybaraStatue({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Pedestal */}
      <group position={[0, 0.75, 0]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 1.5, 4]} />
          <meshToonMaterial color="#8a817a" />
        </mesh>
        <Outline size={[4, 1.5, 4]} />
      </group>

      {/* Capybara body */}
      <group position={[0, 2.8, 0]}>
        <mesh castShadow>
          <boxGeometry args={[2.4, 1.8, 3.6]} />
          <meshToonMaterial color={PALETTE.statue} />
        </mesh>
        <Outline size={[2.4, 1.8, 3.6]} />
      </group>

      {/* Head */}
      <group position={[0, 3.6, 2.2]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.4, 1.8]} />
          <meshToonMaterial color={PALETTE.statue} />
        </mesh>
        <Outline size={[1.6, 1.4, 1.8]} />
        {/* Snout */}
        <mesh position={[0, -0.2, 1.0]} castShadow>
          <boxGeometry args={[1.0, 0.6, 0.8]} />
          <meshToonMaterial color={PALETTE.statue} />
        </mesh>
        <Outline size={[1.0, 0.6, 0.8]} position={[0, -0.2, 1.0]} />
        {/* Ears */}
        <mesh position={[0.55, 0.85, -0.2]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshToonMaterial color={PALETTE.statue} />
        </mesh>
        <mesh position={[-0.55, 0.85, -0.2]} castShadow>
          <boxGeometry args={[0.3, 0.4, 0.3]} />
          <meshToonMaterial color={PALETTE.statue} />
        </mesh>
      </group>

      {/* Legs */}
      {[
        [-0.9, 1.4, 1.4],
        [0.9, 1.4, 1.4],
        [-0.9, 1.4, -1.4],
        [0.9, 1.4, -1.4],
      ].map(([x, y, z], i) => (
        <group key={i} position={[x, y, z]}>
          <mesh castShadow>
            <boxGeometry args={[0.6, 1.2, 0.7]} />
            <meshToonMaterial color={PALETTE.statue} />
          </mesh>
          <Outline size={[0.6, 1.2, 0.7]} />
        </group>
      ))}
    </group>
  )
}

function Cloud({ position, scale }: { position: [number, number, number]; scale: number }) {
  const group = useRef<THREE.Group>(null)
  return (
    <group ref={group} position={position} scale={scale}>
      <mesh>
        <boxGeometry args={[3, 1, 1.5]} />
        <meshToonMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
      <mesh position={[0.8, 0.6, 0]}>
        <boxGeometry args={[1.5, 1.2, 1.2]} />
        <meshToonMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
      <mesh position={[-0.8, 0.5, 0.2]}>
        <boxGeometry args={[1.6, 1, 1.2]} />
        <meshToonMaterial color="#ffffff" transparent opacity={0.85} />
      </mesh>
    </group>
  )
}
