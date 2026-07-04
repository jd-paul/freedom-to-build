'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'

import { BigBen } from '@/components/game-5/big-ben'
import { DioramaCyclist } from '@/components/game-5/diorama-cyclist'
import { NatureAssets } from '@/components/game-5/nature-assets'
import { inputState, useGameStore } from '@/components/game-5/store'
import { DioramaTerrain, getTerrainHeight } from '@/components/game-5/terrain'

const KEY_MAP: Record<string, keyof typeof inputState> = {
  KeyW: 'forward',
  ArrowUp: 'forward',
  KeyS: 'backward',
  ArrowDown: 'backward',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
}

export function GameScene() {
  const helmetColor = useGameStore((s) => s.helmetColor)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.code]
      if (key) {
        e.preventDefault()
        inputState[key] = true
      }
    }
    const up = (e: KeyboardEvent) => {
      const key = KEY_MAP[e.code]
      if (key) inputState[key] = false
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      inputState.forward = inputState.backward = inputState.left = inputState.right = false
    }
  }, [])

  return (
    <Canvas
      shadows
      dpr={[0.45, 0.6]}
      camera={{ position: [0, 8, -12], fov: 55 }}
      className="[image-rendering:pixelated]"
    >
      <color attach="background" args={['#ff9e7d']} />
      <fog attach="fog" args={['#ffccaa', 25, 120]} />

      <ambientLight intensity={0.85} color="#ffd6a5" />
      <directionalLight
        position={[50, 60, -40]}
        intensity={1.6}
        color="#fff0d0"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
      />
      <directionalLight position={[-30, 20, 30]} intensity={0.35} color="#ff8a65" />

      <DioramaTerrain />
      <BigBen position={[0, getTerrainHeight(0, -35), -35]} />
      <NatureAssets />
      <DioramaCyclist helmetColor={helmetColor} getTerrainHeight={getTerrainHeight} />
    </Canvas>
  )
}
