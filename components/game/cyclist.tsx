'use client'

import { useFrame, useThree } from '@react-three/fiber'
import { useRef } from 'react'
import * as THREE from 'three'

import { inputState, useGameStore, ZONES } from '@/lib/game-store'

const WORLD_LIMIT = 110
const MAX_SPEED = 22
const ACCEL = 24
const BRAKE = 40
const FRICTION = 10
const TURN_SPEED = 1.9

const _cameraTarget = new THREE.Vector3()
const _cameraPos = new THREE.Vector3()

export function Cyclist() {
  const group = useRef<THREE.Group>(null)
  const frontWheel = useRef<THREE.Mesh>(null)
  const rearWheel = useRef<THREE.Mesh>(null)
  const pedals = useRef<THREE.Group>(null)
  const speed = useRef(0)
  const camera = useThree((s) => s.camera)
  const cleanZone = useGameStore((s) => s.cleanZone)
  const started = useGameStore((s) => s.started)

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05)
    const g = group.current
    if (!g) return

    if (started) {
      // Steering
      const steering = (inputState.left ? 1 : 0) - (inputState.right ? 1 : 0)
      if (Math.abs(speed.current) > 0.3) {
        g.rotation.y += steering * TURN_SPEED * delta * Math.min(1, Math.abs(speed.current) / 6)
      }

      // Acceleration / braking
      if (inputState.forward) {
        speed.current = Math.min(MAX_SPEED, speed.current + ACCEL * delta)
      } else if (inputState.backward) {
        speed.current = Math.max(-5, speed.current - BRAKE * delta)
      } else {
        // Coast to a stop
        const sign = Math.sign(speed.current)
        speed.current -= sign * FRICTION * delta
        if (Math.sign(speed.current) !== sign) speed.current = 0
      }

      // Move forward along heading
      g.position.x -= Math.sin(g.rotation.y) * speed.current * delta * -1
      g.position.z -= Math.cos(g.rotation.y) * speed.current * delta * -1
      g.position.x = THREE.MathUtils.clamp(g.position.x, -WORLD_LIMIT, WORLD_LIMIT)
      g.position.z = THREE.MathUtils.clamp(g.position.z, -WORLD_LIMIT, WORLD_LIMIT)

      // Lean into turns
      g.rotation.z = THREE.MathUtils.lerp(
        g.rotation.z,
        -steering * 0.18 * Math.min(1, Math.abs(speed.current) / MAX_SPEED),
        delta * 8,
      )

      // Zone cleaning: pass near a gate center
      for (const zone of ZONES) {
        const dx = g.position.x - zone.position[0]
        const dz = g.position.z - zone.position[2]
        if (dx * dx + dz * dz < 16) cleanZone(zone.id)
      }
    }

    // Wheel + pedal spin
    const spin = speed.current * delta * 2.2
    if (frontWheel.current) frontWheel.current.rotation.x += spin
    if (rearWheel.current) rearWheel.current.rotation.x += spin
    if (pedals.current) pedals.current.rotation.x += spin * 0.55

    // Chase camera
    _cameraPos.set(
      g.position.x + Math.sin(g.rotation.y + Math.PI) * 7.5,
      g.position.y + 3.2,
      g.position.z + Math.cos(g.rotation.y + Math.PI) * 7.5,
    )
    camera.position.lerp(_cameraPos, 1 - Math.exp(-delta * 4))
    _cameraTarget.set(g.position.x + Math.sin(g.rotation.y) * 6, g.position.y + 1.4, g.position.z + Math.cos(g.rotation.y) * 6)
    camera.lookAt(_cameraTarget)
  })

  return (
    <group ref={group} position={[0, 0, 0]}>
      {/* Wheels (rotated so the axle points sideways) */}
      <mesh ref={rearWheel} position={[0, 0.45, -0.62]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.45, 0.06, 10, 24]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.8} />
      </mesh>
      <mesh ref={frontWheel} position={[0, 0.45, 0.62]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <torusGeometry args={[0.45, 0.06, 10, 24]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.8} />
      </mesh>
      {/* Frame */}
      <mesh position={[0, 0.75, 0]} rotation={[Math.PI / 5, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.07, 1.15]} />
        <meshStandardMaterial color="#2f6b3f" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.72, -0.3]} rotation={[-Math.PI / 6, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.75, 0.07]} />
        <meshStandardMaterial color="#2f6b3f" roughness={0.4} />
      </mesh>
      <mesh position={[0, 0.8, 0.55]} rotation={[-Math.PI / 8, 0, 0]} castShadow>
        <boxGeometry args={[0.07, 0.75, 0.07]} />
        <meshStandardMaterial color="#2f6b3f" roughness={0.4} />
      </mesh>
      {/* Handlebars */}
      <mesh position={[0, 1.18, 0.62]} castShadow>
        <boxGeometry args={[0.55, 0.06, 0.06]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.6} />
      </mesh>
      {/* Saddle */}
      <mesh position={[0, 1.1, -0.35]} castShadow>
        <boxGeometry args={[0.22, 0.08, 0.35]} />
        <meshStandardMaterial color="#2b2b2b" roughness={0.7} />
      </mesh>
      {/* Pedals */}
      <group ref={pedals} position={[0, 0.55, 0.05]}>
        <mesh position={[0.14, 0, 0.16]}>
          <boxGeometry args={[0.12, 0.05, 0.18]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
        <mesh position={[-0.14, 0, -0.16]}>
          <boxGeometry args={[0.12, 0.05, 0.18]} />
          <meshStandardMaterial color="#444444" />
        </mesh>
      </group>
      {/* Rider */}
      <group position={[0, 1.15, -0.28]} rotation={[0.5, 0, 0]}>
        {/* Torso */}
        <mesh position={[0, 0.42, 0]} castShadow>
          <boxGeometry args={[0.4, 0.62, 0.28]} />
          <meshStandardMaterial color="#c65a2e" roughness={0.7} />
        </mesh>
        {/* Head */}
        <mesh position={[0, 0.92, 0.05]} castShadow>
          <sphereGeometry args={[0.19, 16, 16]} />
          <meshStandardMaterial color="#e8b48a" roughness={0.8} />
        </mesh>
        {/* Helmet */}
        <mesh position={[0, 1.0, 0.03]} castShadow>
          <sphereGeometry args={[0.21, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshStandardMaterial color="#3d7a4d" roughness={0.5} />
        </mesh>
        {/* Arms */}
        <mesh position={[0.24, 0.45, 0.35]} rotation={[-0.9, 0, -0.12]} castShadow>
          <boxGeometry args={[0.11, 0.55, 0.11]} />
          <meshStandardMaterial color="#c65a2e" roughness={0.7} />
        </mesh>
        <mesh position={[-0.24, 0.45, 0.35]} rotation={[-0.9, 0, 0.12]} castShadow>
          <boxGeometry args={[0.11, 0.55, 0.11]} />
          <meshStandardMaterial color="#c65a2e" roughness={0.7} />
        </mesh>
        {/* Legs */}
        <mesh position={[0.13, -0.1, 0.12]} rotation={[0.7, 0, 0]} castShadow>
          <boxGeometry args={[0.13, 0.6, 0.13]} />
          <meshStandardMaterial color="#33465a" roughness={0.7} />
        </mesh>
        <mesh position={[-0.13, -0.1, 0.12]} rotation={[0.55, 0, 0]} castShadow>
          <boxGeometry args={[0.13, 0.6, 0.13]} />
          <meshStandardMaterial color="#33465a" roughness={0.7} />
        </mesh>
      </group>
    </group>
  )
}
