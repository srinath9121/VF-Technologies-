import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { FiberPulseShader } from './FiberShaders'

export default function TowerFiberTransition({ scrollProgressRef }) {
  const tunnelGroupRef = useRef()
  const networkGroupRef = useRef()
  const pulseRef = useRef()
  const shaderMatRef = useRef()

  // Central Fiber Tube Path
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.5, 30.0, 0.5),
    new THREE.Vector3(0.8, 30.2, 2.0),
    new THREE.Vector3(0.0, 30.0, 5.0),
    new THREE.Vector3(-0.5, 29.8, 8.5),
    new THREE.Vector3(0.0, 30.0, 12.0)
  ]), [])

  const jacketGeom = useMemo(() => new THREE.TubeGeometry(curve, 80, 1.2, 16, false), [curve])
  const coreGeom = useMemo(() => new THREE.TubeGeometry(curve, 80, 0.28, 12, false), [curve])

  const shaderUniforms = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 2.5 },
    uColorCore: { value: new THREE.Color('#ffffff') },
    uColorGlow: { value: new THREE.Color('#00d4ff') },
    uOpacity: { value: 1.0 }
  }), [])

  // Branching Network Constellation Nodes
  const [nodes, links] = useMemo(() => {
    const nodePositions = [
      new THREE.Vector3(0, 30.0, 12.0),
      new THREE.Vector3(-3.5, 31.5, 14.0),
      new THREE.Vector3(3.5, 31.0, 14.5),
      new THREE.Vector3(-1.8, 28.5, 15.0),
      new THREE.Vector3(2.2, 28.8, 15.5),
      new THREE.Vector3(0.0, 33.0, 16.0)
    ]

    const linkGeoms = [
      [0, 1], [0, 2], [0, 3], [0, 4],
      [1, 5], [2, 5], [3, 4], [1, 3], [2, 4]
    ].map(([sIdx, eIdx]) => {
      const p1 = nodePositions[sIdx]
      const p2 = nodePositions[eIdx]
      const c = new THREE.CatmullRomCurve3([p1, p2])
      return new THREE.TubeGeometry(c, 20, 0.04, 8, false)
    })

    return [nodePositions, linkGeoms]
  }, [])

  useFrame(({ clock }) => {
    const scroll = scrollProgressRef.current
    // Active during Level 05: Technology (scroll between 0.65 and 0.85)
    const isFiberActive = scroll >= 0.65 && scroll <= 0.86
    const opacity = scroll < 0.72 
      ? Math.max(0, (scroll - 0.65) / 0.07) 
      : (scroll > 0.80 ? Math.max(0, 1 - (scroll - 0.80) / 0.06) : 1)

    if (tunnelGroupRef.current) {
      tunnelGroupRef.current.visible = isFiberActive
    }
    if (networkGroupRef.current) {
      networkGroupRef.current.visible = isFiberActive
    }

    if (!isFiberActive) return

    const t = clock.getElapsedTime()
    if (shaderMatRef.current) {
      shaderMatRef.current.uniforms.uTime.value = t
      shaderMatRef.current.uniforms.uOpacity.value = opacity
    }

    if (pulseRef.current) {
      const pulseProg = ((t * 0.6 + (scroll - 0.65) * 4.0) % 1)
      pulseRef.current.position.copy(curve.getPoint(pulseProg))
    }
  })

  return (
    <group>
      {/* 1. Fiber Conduit Entry & Core Tunnel */}
      <group ref={tunnelGroupRef}>
        {/* Outer Conduit Jacket */}
        <mesh geometry={jacketGeom}>
          <meshStandardMaterial
            color="#080e1a"
            metalness={0.9}
            roughness={0.2}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* Central Luminous Core with Data Pulses */}
        <mesh geometry={coreGeom}>
          <shaderMaterial
            ref={shaderMatRef}
            vertexShader={FiberPulseShader.vertexShader}
            fragmentShader={FiberPulseShader.fragmentShader}
            uniforms={shaderUniforms}
            transparent
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Traveling Data Photon Burst */}
        <group ref={pulseRef}>
          <mesh>
            <sphereGeometry args={[0.22, 16, 16]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <pointLight color="#00ffaa" intensity={3.5} distance={6} />
        </group>
      </group>

      {/* 2. Branching Spatial Network Topology */}
      <group ref={networkGroupRef}>
        {/* Optical Network Nodes */}
        {nodes.map((pos, idx) => (
          <group key={idx} position={pos}>
            <mesh>
              <sphereGeometry args={[0.18, 16, 16]} />
              <meshStandardMaterial color="#00d4ff" emissive="#00d4ff" emissiveIntensity={0.8} />
            </mesh>
            <pointLight color="#00d4ff" intensity={1.5} distance={3} />
          </group>
        ))}

        {/* Connecting Laser Routes */}
        {links.map((geom, idx) => (
          <mesh key={idx} geometry={geom}>
            <meshBasicMaterial color="#00ffa3" transparent opacity={0.65} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
    </group>
  )
}
