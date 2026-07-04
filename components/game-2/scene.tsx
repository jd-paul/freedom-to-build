'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect } from 'react'

import { BigBen } from '@/components/game-2/big-ben'
import { Cyclist } from '@/components/game-2/cyclist'
import { inputState, useGameStore } from '@/components/game-2/store'
import { Terrain, terrainHeightAt } from '@/components/game-2/terrain'
import { NatureAssets } from '@/components/game-2/nature-assets'

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
      dpr={[0.5, 0.65]}
      camera={{ position: [0, 6, -10], fov: 55 }}
      className="[image-rendering:pixelated]"
    >
      <color attach="background" args={['#7dd3fc']} />
      <fog attach="fog" args={['#bae6fd', 50, 220]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[60, 90, -50]}
        intensity={1.3}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-120}
        shadow-camera-right={120}
        shadow-camera-top={120}
        shadow-camera-bottom={-120}
      />

      <Terrain />
      <NatureAssets />
      <BigBen position={[0, terrainHeightAt(0, -55), -55]} />
      <Cyclist helmetColor={helmetColor} />
    </Canvas>
  )
}
