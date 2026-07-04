'use client'

import { Canvas } from '@react-three/fiber'
import { useEffect, useRef } from 'react'

import { BoroughGates } from '@/components/game/borough-gates'
import { Collectibles } from '@/components/game/collectibles'
import { GameLoop } from '@/components/game/game-loop'
import { Hazards } from '@/components/game/hazards'
import { Landmarks } from '@/components/game/landmarks'
import { inputState, useGameStore } from '@/components/game/store'
import { VoxelCyclist, type CyclistHandle } from '@/components/game/voxel-cyclist'
import { VoxelWorld } from '@/components/game/voxel-world'

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
  const cyclistRef = useRef<CyclistHandle>(null)

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
      camera={{ position: [0, 6, -10], fov: 55 }}
      className="[image-rendering:pixelated]"
    >
      <color attach="background" args={['#c084fc']} />
      <fog attach="fog" args={['#f0abfc', 40, 170]} />

      <ambientLight intensity={0.65} />
      <directionalLight
        position={[40, 70, -40]}
        intensity={1.4}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
      />

      <VoxelWorld />
      <BoroughGates />
      <Landmarks />
      <Collectibles />
      <Hazards />
      <VoxelCyclist ref={cyclistRef} helmetColor={helmetColor} />
      <GameLoop cyclistRef={cyclistRef} />
    </Canvas>
  )
}
