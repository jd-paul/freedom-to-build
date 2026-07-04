'use client'

import { Clone, Instances, Instance, useGLTF } from '@react-three/drei'
import { useMemo } from 'react'
import * as THREE from 'three'

import { terrainHeightAt } from '@/components/game-2/terrain'

const MODELS = {
  birch: '/models/nature/BirchTree_1.gltf',
  maple: '/models/nature/MapleTree_1.gltf',
  dead: '/models/nature/DeadTree_1.gltf',
  bush: '/models/nature/Bush.gltf',
  grass: '/models/nature/Grass_Large.gltf',
  flower: '/models/nature/Flower_1.gltf',
}

useGLTF.preload(MODELS.birch)
useGLTF.preload(MODELS.maple)
useGLTF.preload(MODELS.dead)
useGLTF.preload(MODELS.bush)
useGLTF.preload(MODELS.grass)
useGLTF.preload(MODELS.flower)

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

export function NatureAssets() {
  const birch = useGLTF(MODELS.birch)
  const maple = useGLTF(MODELS.maple)
  const dead = useGLTF(MODELS.dead)
  const bush = useGLTF(MODELS.bush)
  const grass = useGLTF(MODELS.grass)
  const flower = useGLTF(MODELS.flower)

  const rand = useMemo(() => mulberry32(31), [])

  const placements = useMemo(() => {
    const items: {
      type: keyof typeof MODELS
      x: number
      y: number
      z: number
      rot: number
      scale: number
    }[] = []

    const tryPlace = (count: number, type: keyof typeof MODELS, scaleRange: [number, number], heightRange: [number, number]) => {
      let attempts = 0
      while (items.filter((i) => i.type === type).length < count && attempts < count * 20) {
        attempts++
        const x = (rand() - 0.5) * 200
        const z = (rand() - 0.5) * 200
        const y = terrainHeightAt(x, z)
        if (y < heightRange[0] || y > heightRange[1]) continue
        if (Math.abs(x) < 8 && Math.abs(z) < 8) continue // spawn clearing
        if (type !== 'grass' && type !== 'flower' && Math.abs(x) < 12 && Math.abs(z + 55) < 12) continue // Big Ben plaza
        items.push({
          type,
          x,
          y,
          z,
          rot: rand() * Math.PI * 2,
          scale: scaleRange[0] + rand() * (scaleRange[1] - scaleRange[0]),
        })
      }
    }

    // Sparse trees on slopes
    tryPlace(22, 'birch', [0.8, 1.4], [4, 22])
    tryPlace(18, 'maple', [0.9, 1.5], [5, 20])
    tryPlace(10, 'dead', [0.9, 1.3], [10, 24])

    // Bushes in mid elevations
    tryPlace(28, 'bush', [0.7, 1.2], [2, 12])

    // Grass and flowers fill the valley floor
    tryPlace(90, 'grass', [0.6, 1.1], [-1, 8])
    tryPlace(50, 'flower', [0.7, 1.1], [-1, 6])

    return items
  }, [])

  const modelFor = (type: keyof typeof MODELS) => {
    switch (type) {
      case 'birch':
        return birch.scene
      case 'maple':
        return maple.scene
      case 'dead':
        return dead.scene
      case 'bush':
        return bush.scene
      case 'grass':
        return grass.scene
      case 'flower':
        return flower.scene
    }
  }

  return (
    <group>
      {placements.map((p, i) => (
        <Clone
          key={`${p.type}-${i}`}
          object={modelFor(p.type)}
          position={[p.x, p.y, p.z]}
          rotation={[0, p.rot, 0]}
          scale={p.scale}
          castShadow
          receiveShadow
        />
      ))}
      <MountainDetails />
    </group>
  )
}

function MountainDetails() {
  const rand = useMemo(() => mulberry32(47), [])
  const rocks = useMemo(() => {
    const items: { position: THREE.Vector3; rotation: THREE.Euler; scale: number }[] = []
    for (let i = 0; i < 220; i++) {
      const x = (rand() - 0.5) * 220
      const z = (rand() - 0.5) * 220
      const y = terrainHeightAt(x, z)
      if (y < 10) continue
      items.push({
        position: new THREE.Vector3(x, y + 0.2, z),
        rotation: new THREE.Euler(rand() * Math.PI, rand() * Math.PI, rand() * Math.PI),
        scale: 0.4 + rand() * 0.8,
      })
    }
    return items
  }, [])

  return (
    <Instances limit={rocks.length} range={rocks.length} castShadow receiveShadow>
      <boxGeometry args={[0.6, 0.6, 0.6]} />
      <meshToonMaterial color="#78716c" />
      {rocks.map((r, i) => (
        <Instance
          key={i}
          position={r.position}
          rotation={r.rotation}
          scale={r.scale}
        />
      ))}
    </Instances>
  )
}
