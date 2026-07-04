'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const WORLD_SIZE = 240
const SEGMENTS = 96
const SNOW_LINE = 18
const ROCK_LINE = 12

const PALETTE = {
  valleyGrass: '#65a30d',
  slopeGrass: '#4d7c0f',
  rock: '#78716c',
  snow: '#f8fafc',
  dirt: '#57534e',
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

// Simple value noise with smoothing
const perm = new Uint8Array(512)
const rand = mulberry32(88)
for (let i = 0; i < 256; i++) perm[i] = i
for (let i = 255; i > 0; i--) {
  const j = Math.floor(rand() * (i + 1))
  ;[perm[i], perm[j]] = [perm[j], perm[i]]
}
for (let i = 0; i < 256; i++) perm[i + 256] = perm[i]

function fade(t: number) {
  return t * t * t * (t * (t * 6 - 15) + 10)
}

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

function noise2D(x: number, y: number) {
  const X = Math.floor(x) & 255
  const Y = Math.floor(y) & 255
  const xf = x - Math.floor(x)
  const yf = y - Math.floor(y)
  const u = fade(xf)
  const v = fade(yf)

  const aa = perm[perm[X] + Y]
  const ab = perm[perm[X] + Y + 1]
  const ba = perm[perm[X + 1] + Y]
  const bb = perm[perm[X + 1] + Y + 1]

  return lerp(
    lerp((aa / 255) * 2 - 1, (ba / 255) * 2 - 1, u),
    lerp((ab / 255) * 2 - 1, (bb / 255) * 2 - 1, u),
    v,
  )
}

function fbm(x: number, z: number) {
  let value = 0
  let amplitude = 1
  let frequency = 0.012
  for (let i = 0; i < 4; i++) {
    value += noise2D(x * frequency, z * frequency) * amplitude
    amplitude *= 0.5
    frequency *= 2.1
  }
  return value
}

export function terrainHeightAt(x: number, z: number) {
  // A wide central valley running along the Z axis, rising to mountains at the edges
  const valley = Math.pow(Math.abs(x) / (WORLD_SIZE * 0.42), 2.2)
  const ridge = fbm(x, z) * 14 + noise2D(x * 0.04, z * 0.04) * 6
  const height = ridge + valley * 35
  return Math.max(-2, height - 6)
}

export function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null)

  const { geometry, colors } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(WORLD_SIZE, WORLD_SIZE, SEGMENTS, SEGMENTS)
    geo.rotateX(-Math.PI / 2)
    const pos = geo.attributes.position.array as Float32Array
    const cols = new Float32Array(pos.length)
    const color = new THREE.Color()

    for (let i = 0; i < pos.length; i += 3) {
      const x = pos[i]
      const z = pos[i + 2]
      const y = terrainHeightAt(x, z)
      pos[i + 1] = y

      if (y > SNOW_LINE) {
        color.set(PALETTE.snow)
      } else if (y > ROCK_LINE) {
        color.set(rand() > 0.6 ? PALETTE.rock : PALETTE.dirt)
      } else if (y > 3) {
        color.set(rand() > 0.5 ? PALETTE.slopeGrass : PALETTE.valleyGrass)
      } else {
        color.set(PALETTE.valleyGrass)
      }
      cols[i] = color.r
      cols[i + 1] = color.g
      cols[i + 2] = color.b
    }

    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
    geo.computeVertexNormals()
    return { geometry: geo, colors: cols }
  }, [])

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow castShadow>
      <meshStandardMaterial vertexColors flatShading />

    </mesh>
  )
}
