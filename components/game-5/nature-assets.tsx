'use client'

import { useGLTF } from '@react-three/drei'
import { useMemo } from 'react'

import { getTerrainHeight } from '@/components/game-5/terrain'

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

const MODELS = {
  birch1: '/models/nature/BirchTree_1.gltf',
  birch2: '/models/nature/BirchTree_2.gltf',
  maple1: '/models/nature/MapleTree_1.gltf',
  bush: '/models/nature/Bush.gltf',
  bushLarge: '/models/nature/Bush_Large.gltf',
  grassLarge: '/models/nature/Grass_Large.gltf',
  grassSmall: '/models/nature/Grass_Small.gltf',
  flower1: '/models/nature/Flower_1.gltf',
  flower2: '/models/nature/Flower_2.gltf',
  deadTree1: '/models/nature/DeadTree_1.gltf',
}

useGLTF.preload(Object.values(MODELS))

function ModelClone({
  url,
  position,
  rotation,
  scale,
}: {
  url: string
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
}) {
  const { scene } = useGLTF(url)
  const cloned = useMemo(() => scene.clone(true), [scene])
  return (
    <primitive
      object={cloned}
      position={position}
      rotation={rotation}
      scale={scale ?? 1}
      castShadow
      receiveShadow
    />
  )
}

export function NatureAssets() {
  const placements = useMemo(() => {
    const rand = mulberry32(5)
    const list: {
      key: string
      url: string
      x: number
      y: number
      z: number
      rot: number
      scale: number
    }[] = []

    // Curated forest clusters
    const clusters: [number, number, number][] = [
      [-28, -22, 12],
      [32, -18, 10],
      [-20, 24, 9],
      [24, 28, 11],
      [-45, 0, 8],
      [45, 5, 8],
    ]

    for (const [cx, cz, radius] of clusters) {
      const count = Math.floor(rand() * 8) + 6
      for (let i = 0; i < count; i++) {
        const angle = rand() * Math.PI * 2
        const dist = rand() * radius
        const x = cx + Math.cos(angle) * dist
        const z = cz + Math.sin(angle) * dist
        if (Math.sqrt(x * x + z * z) < 18) continue // keep center clear for Big Ben plaza
        const y = getTerrainHeight(x, z)
        const treeType = rand()
        const url =
          treeType < 0.25
            ? MODELS.birch1
            : treeType < 0.5
              ? MODELS.birch2
              : treeType < 0.8
                ? MODELS.maple1
                : MODELS.deadTree1
        list.push({
          key: `tree-${list.length}`,
          url,
          x,
          z,
          y,
          rot: (rand() - 0.5) * 0.8,
          scale: 0.7 + rand() * 0.5,
        })
      }
    }

    // Bushes in small groupings
    for (let i = 0; i < 30; i++) {
      const x = (rand() - 0.5) * 140
      const z = (rand() - 0.5) * 140
      if (Math.sqrt(x * x + z * z) < 20) continue
      const y = getTerrainHeight(x, z)
      list.push({
        key: `bush-${i}`,
        url: rand() > 0.5 ? MODELS.bush : MODELS.bushLarge,
        x,
        z,
        y,
        rot: (rand() - 0.5) * 1.0,
        scale: 0.8 + rand() * 0.6,
      })
    }

    // Grass and flowers scattered densely near the diorama centre
    for (let i = 0; i < 180; i++) {
      const x = (rand() - 0.5) * 160
      const z = (rand() - 0.5) * 160
      if (Math.sqrt(x * x + z * z) < 12) continue
      const y = getTerrainHeight(x, z)
      const kind = rand()
      list.push({
        key: `ground-${i}`,
        url:
          kind < 0.5
            ? MODELS.grassSmall
            : kind < 0.8
              ? MODELS.grassLarge
              : kind < 0.9
                ? MODELS.flower1
                : MODELS.flower2,
        x,
        z,
        y,
        rot: rand() * Math.PI * 2,
        scale: 0.6 + rand() * 0.5,
      })
    }

    return list
  }, [])

  return (
    <group>
      {placements.map((p) => (
        <ModelClone
          key={p.key}
          url={p.url}
          position={[p.x, p.y, p.z]}
          rotation={[0, p.rot, 0]}
          scale={p.scale}
        />
      ))}
    </group>
  )
}
