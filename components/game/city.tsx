'use client'

import { useMemo } from 'react'
import * as THREE from 'three'

import { ZONES } from '@/lib/game-store'

/** Deterministic pseudo-random for stable building layouts */
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

interface Building {
  x: number
  z: number
  w: number
  h: number
  d: number
  color: string
  zoneIndex: number // -1 if not in a zone
}

const CLEAN_COLORS = ['#d9cfc0', '#c9b8a5', '#b5a48e', '#ddd3c4', '#a8926f']
const POLLUTED_COLORS = ['#9b8a72', '#8a7a63', '#a3906f']

export function City({ cleanedFlags }: { cleanedFlags: boolean[] }) {
  const buildings = useMemo<Building[]>(() => {
    const rand = mulberry32(42)
    const list: Building[] = []
    for (let i = 0; i < 190; i++) {
      const x = (rand() - 0.5) * 220
      const z = (rand() - 0.5) * 220
      // Keep the spawn plaza and roads clear
      if (Math.abs(x) < 9 || Math.abs(z) < 9) continue
      if (Math.sqrt(x * x + z * z) < 14) continue

      let zoneIndex = -1
      let skip = false
      for (let zi = 0; zi < ZONES.length; zi++) {
        const zone = ZONES[zi]
        const dx = x - zone.position[0]
        const dz = z - zone.position[2]
        const dist = Math.sqrt(dx * dx + dz * dz)
        if (dist < 7) {
          skip = true // keep gate area clear
          break
        }
        if (dist < zone.radius) zoneIndex = zi
      }
      if (skip) continue

      const inZone = zoneIndex >= 0
      list.push({
        x,
        z,
        w: 3 + rand() * 5,
        h: 3 + rand() * (inZone ? 14 : 9),
        d: 3 + rand() * 5,
        color: inZone
          ? POLLUTED_COLORS[Math.floor(rand() * POLLUTED_COLORS.length)]
          : CLEAN_COLORS[Math.floor(rand() * CLEAN_COLORS.length)],
        zoneIndex,
      })
    }
    return list
  }, [])

  const trees = useMemo(() => {
    const rand = mulberry32(7)
    const list: { x: number; z: number; s: number }[] = []
    for (let i = 0; i < 90; i++) {
      const x = (rand() - 0.5) * 210
      const z = (rand() - 0.5) * 210
      if (Math.abs(x) < 8 || Math.abs(z) < 8) continue
      let inZone = false
      for (const zone of ZONES) {
        const dx = x - zone.position[0]
        const dz = z - zone.position[2]
        if (Math.sqrt(dx * dx + dz * dz) < zone.radius + 2) {
          inZone = true
          break
        }
      }
      if (inZone) continue
      list.push({ x, z, s: 0.8 + rand() * 1 })
    }
    return list
  }, [])

  return (
    <group>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[260, 260]} />
        <meshStandardMaterial color="#7fae72" roughness={1} />
      </mesh>

      {/* Polluted ground patches (turn green when cleaned) */}
      {ZONES.map((zone, i) => (
        <mesh
          key={zone.id}
          rotation={[-Math.PI / 2, 0, 0]}
          position={[zone.position[0], 0.02, zone.position[2]]}
          receiveShadow
        >
          <circleGeometry args={[zone.radius, 40]} />
          <meshStandardMaterial
            color={cleanedFlags[i] ? '#8cbb7b' : '#b28a3f'}
            roughness={1}
          />
        </mesh>
      ))}

      {/* Roads: main cross */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 0]}>
        <planeGeometry args={[13, 240]} />
        <meshStandardMaterial color="#5b5f66" roughness={0.95} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.03, 0]}>
        <planeGeometry args={[13, 240]} />
        <meshStandardMaterial color="#5b5f66" roughness={0.95} />
      </mesh>
      {/* Road center lines */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.04, 0]}>
        <planeGeometry args={[0.35, 240]} />
        <meshStandardMaterial color="#e8e2d2" roughness={1} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, Math.PI / 2]} position={[0, 0.04, 0]}>
        <planeGeometry args={[0.35, 240]} />
        <meshStandardMaterial color="#e8e2d2" roughness={1} />
      </mesh>

      {/* Thames-like river band */}
      <mesh rotation={[-Math.PI / 2, 0, 0.3]} position={[15, 0.025, 100]}>
        <planeGeometry args={[280, 26]} />
        <meshStandardMaterial color="#6d97a8" roughness={0.35} metalness={0.1} />
      </mesh>

      {/* Buildings */}
      {buildings.map((b, i) => {
        const cleaned = b.zoneIndex >= 0 && cleanedFlags[b.zoneIndex]
        return (
          <mesh key={i} position={[b.x, b.h / 2, b.z]} castShadow receiveShadow>
            <boxGeometry args={[b.w, b.h, b.d]} />
            <meshStandardMaterial
              color={b.zoneIndex >= 0 && !cleaned ? b.color : cleaned ? '#d9cfc0' : b.color}
              roughness={0.9}
            />
          </mesh>
        )
      })}

      {/* Trees */}
      {trees.map((t, i) => (
        <group key={i} position={[t.x, 0, t.z]} scale={t.s}>
          <mesh position={[0, 1, 0]} castShadow>
            <cylinderGeometry args={[0.18, 0.24, 2, 6]} />
            <meshStandardMaterial color="#6d5138" roughness={1} />
          </mesh>
          <mesh position={[0, 2.6, 0]} castShadow>
            <icosahedronGeometry args={[1.3, 0]} />
            <meshStandardMaterial color="#4c8a4f" roughness={1} />
          </mesh>
        </group>
      ))}

      {/* Big Ben-inspired landmark at the center plaza */}
      <BigBen position={[16, 0, -16]} />
    </group>
  )
}

function BigBen({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 12, 0]} castShadow>
        <boxGeometry args={[5, 24, 5]} />
        <meshStandardMaterial color="#c9b280" roughness={0.85} />
      </mesh>
      {/* Clock section */}
      <mesh position={[0, 25.5, 0]} castShadow>
        <boxGeometry args={[5.8, 4, 5.8]} />
        <meshStandardMaterial color="#b9a06a" roughness={0.85} />
      </mesh>
      {/* Clock faces */}
      {[0, Math.PI / 2, Math.PI, -Math.PI / 2].map((rot, i) => (
        <group key={i} rotation={[0, rot, 0]}>
          <mesh position={[0, 25.5, 2.95]}>
            <circleGeometry args={[1.7, 24]} />
            <meshStandardMaterial color="#f3ecd8" roughness={0.6} />
          </mesh>
          <mesh position={[0, 26.1, 3.0]}>
            <boxGeometry args={[0.14, 1.2, 0.02]} />
            <meshStandardMaterial color="#2b2b2b" />
          </mesh>
          <mesh position={[0.4, 25.5, 3.0]} rotation={[0, 0, Math.PI / 2]}>
            <boxGeometry args={[0.12, 0.85, 0.02]} />
            <meshStandardMaterial color="#2b2b2b" />
          </mesh>
        </group>
      ))}
      {/* Spire */}
      <mesh position={[0, 30, 0]} castShadow>
        <coneGeometry args={[3.2, 5.5, 4]} />
        <meshStandardMaterial color="#3d7a4d" roughness={0.7} />
      </mesh>
    </group>
  )
}

/** Amber haze dome + glowing gate for a polluted zone */
export function PollutionZone({
  position,
  radius,
  gateRotation,
  cleaned,
}: {
  position: [number, number, number]
  radius: number
  gateRotation: number
  cleaned: boolean
}) {
  return (
    <group position={position}>
      {/* Haze dome */}
      {!cleaned && (
        <mesh position={[0, 0, 0]}>
          <sphereGeometry args={[radius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial
            color="#c9962e"
            transparent
            opacity={0.28}
            side={THREE.DoubleSide}
            depthWrite={false}
          />
        </mesh>
      )}
      {/* Clean-air gate (glowing arch like the reference) */}
      <group rotation={[0, gateRotation, 0]}>
        <mesh position={[0, 0, 0]} rotation={[0, 0, 0]}>
          <torusGeometry args={[6, 0.55, 12, 40, Math.PI]} />
          <meshStandardMaterial
            color={cleaned ? '#57c785' : '#e0a13c'}
            emissive={cleaned ? '#2fa864' : '#c07f1d'}
            emissiveIntensity={cleaned ? 1.4 : 1.0}
            toneMapped={false}
          />
        </mesh>
        {/* Gate posts */}
        {[-6, 6].map((x) => (
          <mesh key={x} position={[x, 0.6, 0]}>
            <cylinderGeometry args={[0.4, 0.5, 1.2, 8]} />
            <meshStandardMaterial color="#3f4a44" roughness={0.7} />
          </mesh>
        ))}
      </group>
      <pointLight
        position={[0, 5, 0]}
        color={cleaned ? '#57c785' : '#e0a13c'}
        intensity={cleaned ? 60 : 40}
        distance={30}
      />
    </group>
  )
}
