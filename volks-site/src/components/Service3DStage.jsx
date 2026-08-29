import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'

// Phase 1: 3D Wireless Tower with Pulsing Signal Waves
function WirelessTower({ progress }) {
  const towerRef = useRef()
  const wavesRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (towerRef.current) {
      towerRef.current.rotation.y = t * 0.4
    }
    if (wavesRef.current) {
      wavesRef.current.rotation.z = t * 0.3
      const s = 1 + (t % 2) * 0.6
      wavesRef.current.scale.set(s, s, s)
    }
  })

  // Opacity based on progress [0.0 - 0.33]
  const opacity = Math.max(0, Math.min(1, 1 - Math.abs(progress - 0.16) * 4))

  return (
    <group position={[0, 0, 0]} visible={opacity > 0.05}>
      {/* Tower Lattice Body */}
      <group ref={towerRef}>
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.2, 0.8, 3.5, 4, 8, true]} />
          <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={opacity * 0.9} />
        </mesh>
        {/* Antenna Arrays */}
        {[-1.2, 0, 1.2].map((y, i) => (
          <mesh key={i} position={[0, y, 0]}>
            <boxGeometry args={[1.2, 0.15, 0.15]} />
            <meshBasicMaterial color="#00ffaa" transparent opacity={opacity * 0.8} />
          </mesh>
        ))}
      </group>

      {/* Pulsing Signal Wave Rings */}
      <group ref={wavesRef} position={[0, 1.5, 0]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.8, 0.85, 32]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={opacity * 0.6} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[1.4, 1.45, 32]} />
          <meshBasicMaterial color="#7b61ff" transparent opacity={opacity * 0.4} side={THREE.DoubleSide} />
        </mesh>
      </group>
    </group>
  )
}

// Phase 2: 3D Underground Glowing Fiber Conduit Grid
function OSPFiberGrid({ progress }) {
  const groupRef = useRef()

  const conduits = useMemo(() => {
    const lines = []
    for (let i = -4; i <= 4; i += 1.2) {
      lines.push({ x: i, z: (Math.random() - 0.5) * 2, color: i % 2 === 0 ? '#ffaa00' : '#00d4ff' })
    }
    return lines
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (groupRef.current) {
      groupRef.current.position.z = (t * 1.5) % 3
      groupRef.current.rotation.x = -0.4
      groupRef.current.rotation.y = Math.sin(t * 0.2) * 0.1
    }
  })

  // Opacity based on progress [0.33 - 0.66]
  const opacity = Math.max(0, Math.min(1, 1 - Math.abs(progress - 0.5) * 4))

  return (
    <group position={[0, -0.5, 0]} visible={opacity > 0.05} ref={groupRef}>
      {conduits.map((c, i) => (
        <group key={i} position={[c.x, 0, c.z]}>
          <mesh rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 12, 16]} />
            <meshBasicMaterial color={c.color} transparent opacity={opacity * 0.85} />
          </mesh>
          {/* Fiber Optic Data Pulses */}
          <mesh position={[0, 0, ((i * 1.5) % 4) - 2]}>
            <sphereGeometry args={[0.14, 16, 16]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.95} />
          </mesh>
        </group>
      ))}

      {/* Subterranean Grid Plane */}
      <gridHelper args={[16, 16, '#00d4ff', '#1a2040']} position={[0, -0.8, 0]} />
    </group>
  )
}

// Phase 3: 3D Isometric Data Center Server Racks
function DataCenterCluster({ progress }) {
  const rackGroupRef = useRef()

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (rackGroupRef.current) {
      rackGroupRef.current.rotation.y = Math.PI / 4 + Math.sin(t * 0.3) * 0.15
      rackGroupRef.current.rotation.x = 0.35
    }
  })

  // Opacity based on progress [0.66 - 1.0]
  const opacity = Math.max(0, Math.min(1, 1 - Math.abs(progress - 0.85) * 4))

  return (
    <group position={[0, 0, 0]} visible={opacity > 0.05} ref={rackGroupRef}>
      {[-1.6, 0, 1.6].map((x, i) => (
        <group key={i} position={[x, 0, 0]}>
          {/* Server Cabinet */}
          <mesh position={[0, 0, 0]}>
            <boxGeometry args={[0.9, 2.8, 1.1]} />
            <meshBasicMaterial color="#00d4ff" wireframe transparent opacity={opacity * 0.6} />
          </mesh>
          {/* Blinking Status LEDs */}
          {[-0.8, -0.4, 0, 0.4, 0.8].map((y, j) => (
            <mesh key={j} position={[0, y, 0.56]}>
              <boxGeometry args={[0.7, 0.15, 0.02]} />
              <meshBasicMaterial
                color={(i + j) % 2 === 0 ? '#00ffaa' : '#7b61ff'}
                transparent
                opacity={opacity * 0.9}
              />
            </mesh>
          ))}
        </group>
      ))}
    </group>
  )
}

export default function Service3DStage({ progress }) {
  return (
    <div className="service-3d-stage-canvas">
      <Canvas
        camera={{ position: [0, 0, 5.5], fov: 50 }}
        gl={{ alpha: true, antialias: true }}
      >
        <ambientLight intensity={0.6} />
        <pointLight position={[5, 5, 5]} color="#00d4ff" intensity={1.5} />
        <pointLight position={[-5, -5, -5]} color="#7b61ff" intensity={1.2} />

        <WirelessTower progress={progress} />
        <OSPFiberGrid progress={progress} />
        <DataCenterCluster progress={progress} />
      </Canvas>
    </div>
  )
}
