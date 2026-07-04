'use client'

import { Canvas } from '@react-three/fiber'
import { Sky } from '@react-three/drei'
import { useEffect } from 'react'

import { inputState, useGameStore, ZONES } from '@/lib/game-store'
import { City, PollutionZone } from '@/components/game/city'
import { Cyclist } from '@/components/game/cyclist'

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
  const cleaned = useGameStore((s) => s.cleaned)

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

  const cleanedFlags = ZONES.map((z) => cleaned[z.id])

  return (
    <Canvas
      shadows
      // Low device pixel ratio for the chunky, retro low-fi render look
      dpr={[0.55, 0.75]}
      camera={{ position: [0, 6, -10], fov: 60 }}
      className="[image-rendering:pixelated]"
    >
      <color attach="background" args={['#a8c4d4']} />
      <Sky sunPosition={[80, 40, -60]} turbidity={6} rayleigh={2} />
      <fog attach="fog" args={['#b9c9c2', 60, 210]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[60, 80, -40]}
        intensity={1.6}
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
      />

      <City cleanedFlags={cleanedFlags} />
      {ZONES.map((zone, i) => (
        <PollutionZone
          key={zone.id}
          position={zone.position}
          radius={zone.radius}
          gateRotation={zone.gateRotation}
          cleaned={cleanedFlags[i]}
        />
      ))}
      <Cyclist />
    </Canvas>
  )
}
