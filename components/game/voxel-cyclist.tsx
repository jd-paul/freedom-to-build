'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { forwardRef, useImperativeHandle, useRef } from 'react'
import * as THREE from 'three'

import { inputState, useGameStore } from './store'

const WORLD_LIMIT = 90
const MAX_SPEED = 20
const ACCEL = 22
const BRAKE = 36
const FRICTION = 10
const TURN_SPEED = 1.8

const _cameraTarget = new THREE.Vector3()
const _cameraPos = new THREE.Vector3()

export interface CyclistHandle {
  getPosition: () => THREE.Vector3
  getSpeed: () => number
  applySlow: (endTime: number) => void
}

interface VoxelCyclistProps {
  helmetColor: string
}

export const VoxelCyclist = forwardRef<CyclistHandle, VoxelCyclistProps>(
  function VoxelCyclist({ helmetColor }, ref) {
    const group = useRef<THREE.Group>(null)
    const wheels = useRef<THREE.Group>(null)
    const pedals = useRef<THREE.Group>(null)
    const speed = useRef(0)
    const slowUntil = useRef(0)
    const camera = useThree((s) => s.camera)
    const started = useGameStore((s) => s.started)

    useImperativeHandle(
      ref,
      () => ({
        getPosition: () => group.current?.position.clone() ?? new THREE.Vector3(),
        getSpeed: () => speed.current,
        applySlow: (endTime: number) => {
          slowUntil.current = endTime
          speed.current *= 0.6
        },
      }),
      [],
    )

    useFrame((state, rawDelta) => {
      const delta = Math.min(rawDelta, 0.05)
      const g = group.current
      if (!g) return

      const now = state.clock.getElapsedTime()
      const slowed = now < slowUntil.current
      const currentMax = slowed ? MAX_SPEED * 0.45 : MAX_SPEED
      const accel = slowed ? ACCEL * 0.5 : ACCEL
      const brake = slowed ? BRAKE * 0.5 : BRAKE

      if (started) {
        const steering = (inputState.left ? 1 : 0) - (inputState.right ? 1 : 0)
        if (Math.abs(speed.current) > 0.3) {
          g.rotation.y +=
            steering * TURN_SPEED * delta * Math.min(1, Math.abs(speed.current) / 6)
        }

        if (inputState.forward) {
          speed.current = Math.min(currentMax, speed.current + accel * delta)
        } else if (inputState.backward) {
          speed.current = Math.max(-5, speed.current - brake * delta)
        } else {
          const sign = Math.sign(speed.current)
          speed.current -= sign * FRICTION * delta
          if (Math.sign(speed.current) !== sign) speed.current = 0
        }

        speed.current = Math.min(currentMax, speed.current)

        g.position.x -= Math.sin(g.rotation.y) * speed.current * delta * -1
        g.position.z -= Math.cos(g.rotation.y) * speed.current * delta * -1
        g.position.x = THREE.MathUtils.clamp(g.position.x, -WORLD_LIMIT, WORLD_LIMIT)
        g.position.z = THREE.MathUtils.clamp(g.position.z, -WORLD_LIMIT, WORLD_LIMIT)

        g.rotation.z = THREE.MathUtils.lerp(
          g.rotation.z,
          -steering * 0.16 * Math.min(1, Math.abs(speed.current) / MAX_SPEED),
          delta * 8,
        )
      }

      const spin = speed.current * delta * 2.4
      if (wheels.current) wheels.current.rotation.x += spin
      if (pedals.current) pedals.current.rotation.x += spin * 0.55

      _cameraPos.set(
        g.position.x + Math.sin(g.rotation.y + Math.PI) * 8,
        g.position.y + 4.5,
        g.position.z + Math.cos(g.rotation.y + Math.PI) * 8,
      )
      camera.position.lerp(_cameraPos, 1 - Math.exp(-delta * 3.5))
      _cameraTarget.set(
        g.position.x + Math.sin(g.rotation.y) * 5,
        g.position.y + 1.6,
        g.position.z + Math.cos(g.rotation.y) * 5,
      )
      camera.lookAt(_cameraTarget)
    })

    return (
      <group ref={group} position={[0, 0.5, 0]}>
        {/* Wheels */}
        <group ref={wheels}>
          <Wheel position={[0, 0.5, -0.8]} />
          <Wheel position={[0, 0.5, 0.8]} />
        </group>

        {/* Frame */}
        <Box size={[0.2, 0.2, 1.8]} position={[0, 1.05, 0]} color="#2f6b3f" />
        <Box size={[0.16, 0.9, 0.16]} position={[0, 0.65, -0.55]} color="#2f6b3f" />
        <Box size={[0.16, 0.95, 0.16]} position={[0, 0.85, 0.7]} color="#2f6b3f" />
        <Box size={[0.5, 0.14, 0.14]} position={[0, 1.48, 0.82]} color="#1f1f1f" />
        <Box size={[0.28, 0.12, 0.42]} position={[0, 1.35, -0.45]} color="#1f1f1f" />

        {/* Pedals */}
        <group ref={pedals} position={[0, 0.65, 0.05]}>
          <Box size={[0.18, 0.08, 0.24]} position={[0.16, 0, 0.18]} color="#444444" />
          <Box size={[0.18, 0.08, 0.24]} position={[-0.16, 0, -0.18]} color="#444444" />
        </group>

        {/* Rider */}
        <group position={[0, 1.35, -0.35]} rotation={[0.55, 0, 0]}>
          {/* Torso */}
          <Box size={[0.45, 0.7, 0.3]} position={[0, 0.45, 0]} color="#c65a2e" />
          {/* Head */}
          <Box size={[0.32, 0.32, 0.32]} position={[0, 0.98, 0.05]} color="#e8b48a" />
          {/* Helmet */}
          <group position={[0, 1.02, 0.03]}>
            <Box size={[0.38, 0.18, 0.4]} position={[0, 0.06, 0]} color={helmetColor} />
            <Box size={[0.4, 0.06, 0.42]} position={[0, 0, 0]} color={helmetColor} />
          </group>
          {/* Arms */}
          <Box
            size={[0.12, 0.6, 0.12]}
            position={[0.26, 0.45, 0.32]}
            rotation={[-0.85, 0, -0.12]}
            color="#c65a2e"
          />
          <Box
            size={[0.12, 0.6, 0.12]}
            position={[-0.26, 0.45, 0.32]}
            rotation={[-0.85, 0, 0.12]}
            color="#c65a2e"
          />
          {/* Legs */}
          <Box
            size={[0.15, 0.65, 0.15]}
            position={[0.14, -0.08, 0.1]}
            rotation={[0.65, 0, 0]}
            color="#33465a"
          />
          <Box
            size={[0.15, 0.65, 0.15]}
            position={[-0.14, -0.08, 0.1]}
            rotation={[0.55, 0, 0]}
            color="#33465a"
          />
        </group>
      </group>
    )
  },
)

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <group position={position} rotation={[0, Math.PI / 2, 0]}>
      {/* Tire */}
      <mesh castShadow>
        <torusGeometry args={[0.5, 0.12, 6, 12]} />
        <meshToonMaterial color="#1f1f1f" />
      </mesh>
      {/* Hub */}
      <Box size={[0.12, 0.12, 0.18]} position={[0, 0, 0]} color="#888888" />
      {/* Spokes */}
      <Box size={[0.06, 0.8, 0.04]} position={[0, 0, 0]} color="#aaaaaa" />
      <Box size={[0.8, 0.06, 0.04]} position={[0, 0, 0]} color="#aaaaaa" />
    </group>
  )
}

function Box({
  size,
  position,
  rotation,
  color,
}: {
  size: [number, number, number]
  position?: [number, number, number]
  rotation?: [number, number, number]
  color: string
}) {
  return (
    <mesh position={position} rotation={rotation} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshToonMaterial color={color} />
    </mesh>
  )
}
