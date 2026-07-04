'use client'

import { useMemo, useRef } from 'react'
import * as THREE from 'three'

const PALETTE = {
  grass: '#6ba854',
  grassDark: '#4f853d',
  dirt: '#8b6a45',
}

export function getTerrainHeight(x: number, z: number): number {
  const scale = 0.045
  const h1 = Math.sin(x * scale) * Math.cos(z * scale) * 2.2
  const h2 = Math.sin(x * 0.09 + 1.3) * Math.cos(z * 0.07 + 0.7) * 1.4
  const h3 = Math.sin((x + z) * 0.035) * 1.0
  const mountain = Math.max(0, Math.cos(x * 0.018) * Math.sin(z * 0.022)) * 5.5
  return h1 + h2 + h3 + mountain - 0.6
}

export function DioramaTerrain() {
  const meshRef = useRef<THREE.Mesh>(null)

  const { geometry, colors } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(220, 220, 80, 80)
    geo.rotateX(-Math.PI / 2)

    const pos = geo.attributes.position
    const cols = new Float32Array(pos.count * 3)
    const colorA = new THREE.Color(PALETTE.grass)
    const colorB = new THREE.Color(PALETTE.grassDark)
    const colorC = new THREE.Color(PALETTE.dirt)

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i)
      const z = pos.getZ(i)
      const y = getTerrainHeight(x, z)
      pos.setY(i, y)

      const steepness = Math.max(0, Math.min(1, (y - 4) / 5))
      const patch = Math.sin(x * 0.2) * Math.cos(z * 0.17)
      const mixed = patch > 0 ? colorA.clone() : colorB.clone()
      mixed.lerp(colorC, steepness * 0.65)
      cols[i * 3] = mixed.r
      cols[i * 3 + 1] = mixed.g
      cols[i * 3 + 2] = mixed.b
    }

    geo.computeVertexNormals()
    geo.setAttribute('color', new THREE.BufferAttribute(cols, 3))
    return { geometry: geo, colors: cols }
  }, [])

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.9} metalness={0} />
    </mesh>
  )
}
