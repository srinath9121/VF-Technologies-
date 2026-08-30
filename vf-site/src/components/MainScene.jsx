import { useEffect, useRef, useState, useMemo } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import * as THREE from 'three'

// Master Camera Choreographer: Multi-Stage Fiber Entry & Chapter Storytelling
function CameraRig({ scrollProgress }) {
  const { camera, pointer } = useThree()

  // 3D Spline for entering and traveling through the Fiber Optic Cable
  const tunnelCurve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 10.0),    // Stage 1: Far outside approach
    new THREE.Vector3(0, 0, 4.5),     // Stage 2: Approaching large cable mouth
    new THREE.Vector3(0, 0, 1.2),     // Stage 3: At cable entrance opening boundary
    new THREE.Vector3(0, 0, -2.5),    // Stage 4: CROSS BOUNDARY - Inside Outer Jacket
    new THREE.Vector3(0.5, -0.3, -8.0), // Stage 5: Gliding through Cladding & Buffer Tube
    new THREE.Vector3(-0.4, 0.4, -15.0),// Stage 6: Inside High-Density Core
    new THREE.Vector3(0, 0, -22.0),   // Stage 7: Approaching Branching Routes
  ]), [])

  useFrame(() => {
    const mouseX = pointer.x * 0.15
    const mouseY = pointer.y * 0.10

    let targetX = mouseX
    let targetY = mouseY
    let targetZ = 10.0
    let lookTarget = new THREE.Vector3(0, 0, 0)

    if (scrollProgress < 0.28) {
      // PHASE 1 & 2: PHYSICAL FIBER CABLE ENTRY
      const p = Math.min(1, Math.max(0, scrollProgress / 0.28))
      const camPos = tunnelCurve.getPoint(p)
      const lookAtPos = tunnelCurve.getPoint(Math.min(0.999, p + 0.04))

      targetX = camPos.x + mouseX
      targetY = camPos.y + mouseY
      targetZ = camPos.z
      lookTarget = lookAtPos
    } else if (scrollProgress < 0.40) {
      // Ch 2: Permitting Blueprint
      const p = (scrollProgress - 0.28) / 0.12
      targetX = mouseX + (1 - p) * 1.2
      targetY = mouseY + 2.4 * p
      targetZ = 4.2 + p * 1.8
      lookTarget = new THREE.Vector3(0, 0, 0)
    } else if (scrollProgress < 0.55) {
      // Ch 3: Network Topology Constellation
      const p = (scrollProgress - 0.40) / 0.15
      targetX = mouseX + Math.sin(p * Math.PI) * 1.6
      targetY = mouseY + Math.cos(p * Math.PI) * 0.6
      targetZ = 6.0 - p * 2.2
      lookTarget = new THREE.Vector3(0, 0, 0)
    } else if (scrollProgress < 0.70) {
      // Ch 4: Pole Loading & Analysis
      const p = (scrollProgress - 0.55) / 0.15
      targetX = mouseX + 0.8 * (1 - p)
      targetY = mouseY - 1.0 + p * 2.2
      targetZ = 5.2 - p * 1.2
      lookTarget = new THREE.Vector3(0, 0, 0)
    } else if (scrollProgress < 0.85) {
      // Ch 5: Traffic Control
      const p = (scrollProgress - 0.70) / 0.15
      targetX = mouseX + Math.sin(p * Math.PI) * 0.5
      targetY = mouseY + 0.6 - p * 1.4
      targetZ = 4.8 - p * 1.8
      lookTarget = new THREE.Vector3(0, 0, 0)
    } else {
      // Ch 6: App Design
      const p = (scrollProgress - 0.85) / 0.15
      targetX = mouseX + 0.8 * (1 - p)
      targetY = mouseY + Math.sin(p * Math.PI * 0.5) * 0.25
      targetZ = 4.6 - p * 0.4
      lookTarget = new THREE.Vector3(0, 0, 0)
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06)

    if (scrollProgress < 0.28) {
      camera.lookAt(lookTarget)
    } else {
      camera.lookAt(0, 0, 0)
    }
  })

  return null
}

// Highly Visible Realistic OSP Fiber Cable Entry & Travel System
function FiberTunnelScene({ scrollProgress }) {
  const tunnelGroupRef = useRef()
  const pulseRef = useRef()
  const subPulsesRef = useRef([])

  const isVisible = scrollProgress <= 0.32
  const opacity = scrollProgress > 0.24 ? Math.max(0, 1 - (scrollProgress - 0.24) / 0.08) : 1

  // Master Central Path Spline
  const curve = useMemo(() => new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 0, 10.0),
    new THREE.Vector3(0, 0, 4.5),
    new THREE.Vector3(0, 0, 1.2),
    new THREE.Vector3(0, 0, -2.5),
    new THREE.Vector3(0.5, -0.3, -8.0),
    new THREE.Vector3(-0.4, 0.4, -15.0),
    new THREE.Vector3(0, 0, -22.0),
  ]), [])

  // 1. Outer Heavy Armored Cable Jacket (Dark High-Tech Sheath with Entrance Rim)
  const jacketGeom = useMemo(() => new THREE.TubeGeometry(curve, 120, 2.2, 24, false), [curve])
  
  // 2. Inner Transparent Protective Cladding
  const claddingGeom = useMemo(() => new THREE.TubeGeometry(curve, 120, 1.6, 20, false), [curve])

  // 3. Central Glass Core Conduit
  const coreGeom = useMemo(() => new THREE.TubeGeometry(curve, 120, 0.35, 16, false), [curve])

  // 4. Multi-Buffer Tubes & Sub-Strands Offset Splines
  const strandCurves = useMemo(() => {
    const offsets = [
      { x: 0.65, y: 0.65 },
      { x: -0.65, y: 0.65 },
      { x: 0.65, y: -0.65 },
      { x: -0.65, y: -0.65 },
      { x: 0.9, y: 0 },
      { x: -0.9, y: 0 }
    ]
    return offsets.map(off => {
      const pts = curve.points.map(p => new THREE.Vector3(p.x + off.x, p.y + off.y, p.z))
      return new THREE.CatmullRomCurve3(pts)
    })
  }, [curve])

  const strandGeoms = useMemo(() => {
    return strandCurves.map(c => new THREE.TubeGeometry(c, 100, 0.12, 10, false))
  }, [strandCurves])

  useFrame(({ clock }) => {
    if (!tunnelGroupRef.current || !isVisible) return
    const t = clock.getElapsedTime()
    
    // Main High-Intensity Data Light Pulse (Travels faster than camera forward)
    if (pulseRef.current) {
      const pulseProg = ((t * 0.45 + scrollProgress * 1.8) % 1)
      const pt = curve.getPoint(pulseProg)
      pulseRef.current.position.copy(pt)
    }

    // Sub-pulses along buffer strands
    subPulsesRef.current.forEach((mesh, idx) => {
      if (mesh) {
        const c = strandCurves[idx % strandCurves.length]
        const prog = ((t * 0.5 + idx * 0.18 + scrollProgress * 1.2) % 1)
        mesh.position.copy(c.getPoint(prog))
      }
    })
  })

  if (!isVisible) return null

  const strandColors = ["#00d4ff", "#00ffaa", "#38bdf8", "#f59e0b", "#ec4899", "#8b5cf6"]

  return (
    <group ref={tunnelGroupRef}>
      {/* CABLE ENTRANCE RING / MOUTH REMINDER MARKER (At z=1.2) */}
      <group position={[0, 0, 1.2]}>
        <mesh rotation={[0, 0, 0]}>
          <ringGeometry args={[1.65, 2.25, 36]} />
          <meshStandardMaterial color="#0284c7" metalness={0.9} roughness={0.1} emissive="#0284c7" emissiveIntensity={0.5} transparent opacity={opacity * 0.9} side={THREE.DoubleSide} />
        </mesh>
        <mesh rotation={[0, 0, 0]} position={[0, 0, -0.05]}>
          <ringGeometry args={[0.38, 1.62, 36]} />
          <meshStandardMaterial color="#0f172a" metalness={0.95} roughness={0.1} transparent opacity={opacity * 0.85} side={THREE.DoubleSide} />
        </mesh>
      </group>

      {/* 1. OUTER ARMORED JACKET (Rendered DoubleSide for authentic inside/outside geometry) */}
      <mesh geometry={jacketGeom}>
        <meshStandardMaterial
          color="#030712"
          roughness={0.4}
          metalness={0.8}
          wireframe={true}
          transparent
          opacity={0.35 * opacity}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* 2. INNER GLASS CLADDING LAYER */}
      <mesh geometry={claddingGeom}>
        <meshStandardMaterial
          color="#082f49"
          roughness={0.1}
          metalness={0.95}
          transparent
          opacity={0.25 * opacity}
          side={THREE.BackSide}
        />
      </mesh>

      {/* 3. CENTRAL OPTICAL CORE */}
      <mesh geometry={coreGeom}>
        <meshStandardMaterial
          color="#00d4ff"
          emissive="#00d4ff"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.9}
          transparent
          opacity={0.75 * opacity}
        />
      </mesh>

      {/* 4. MULTI-COLOR BUFFER STRANDS (Representing High-Density Fiber Ribbons) */}
      {strandGeoms.map((geom, idx) => (
        <mesh key={idx} geometry={geom}>
          <meshStandardMaterial
            color={strandColors[idx]}
            emissive={strandColors[idx]}
            emissiveIntensity={0.4}
            roughness={0.2}
            transparent
            opacity={0.65 * opacity}
          />
        </mesh>
      ))}

      {/* 5. PRIMARY HIGH-INTENSITY TRAVELING DATA PULSE */}
      <group ref={pulseRef}>
        <mesh>
          <sphereGeometry args={[0.28, 24, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity} />
        </mesh>
        <mesh>
          <sphereGeometry args={[0.55, 24, 24]} />
          <meshBasicMaterial color="#00ffaa" transparent opacity={opacity * 0.45} />
        </mesh>
        <pointLight intensity={3.5} distance={6} color="#00ffaa" />
      </group>

      {/* 6. SECONDARY SUB-PULSES */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <mesh key={idx} ref={el => subPulsesRef.current[idx] = el}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshBasicMaterial color={strandColors[idx]} transparent opacity={opacity * 0.9} />
        </mesh>
      ))}
    </group>
  )
}

// 3. CHAPTER 02: Permitting & Engineering CAD Blueprint
function PermittingBlueprintScene({ scrollProgress }) {
  const groupRef = useRef()

  const isVisible = scrollProgress >= 0.14 && scrollProgress <= 0.38
  const fadeIn = Math.min(1, Math.max(0, (scrollProgress - 0.14) / 0.05))
  const fadeOut = scrollProgress > 0.30 ? Math.max(0, 1 - (scrollProgress - 0.30) / 0.06) : 1
  const opacity = fadeIn * fadeOut

  const p = Math.min(1, Math.max(0, (scrollProgress - 0.166) / 0.167))

  useFrame(({ clock }) => {
    if (!groupRef.current || !isVisible) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.x = THREE.MathUtils.degToRad(32) + Math.sin(t * 0.1) * 0.015
  })

  const routePoints = useMemo(() => [
    new THREE.Vector3(-4.0, 0, -2.0),
    new THREE.Vector3(-1.8, 0, -0.8),
    new THREE.Vector3(0, 0, 0),
    new THREE.Vector3(2.0, 0, 0.6),
    new THREE.Vector3(4.2, 0, 1.8)
  ], [])

  const lineCount = Math.max(2, Math.min(5, Math.ceil(p * 5)))
  const activeLinePoints = routePoints.slice(0, lineCount)

  if (!isVisible) return null

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Clean engineering grid plane */}
      <gridHelper args={[12, 24, "#0284c7", "#0a192f"]} position={[0, -0.05, 0]} />

      {activeLinePoints.length >= 2 && (
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attach="attributes-position"
              count={activeLinePoints.length}
              array={new Float32Array(activeLinePoints.flatMap(pt => [pt.x, pt.y + 0.05, pt.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#38bdf8" linewidth={2} transparent opacity={opacity * 0.9} />
        </line>
      )}

      {routePoints.map((pt, idx) => {
        if (p < idx * 0.2) return null
        return (
          <group key={idx} position={[pt.x, pt.y + 0.04, pt.z]}>
            <mesh rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.14, 0.17, 24]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={opacity * 0.85} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 0.7, 8]} />
              <meshBasicMaterial color="#64748b" transparent opacity={opacity * 0.7} />
            </mesh>
            <mesh position={[0, 0.75, 0]}>
              <octahedronGeometry args={[0.1]} />
              <meshStandardMaterial color="#f59e0b" roughness={0.3} metalness={0.5} transparent opacity={opacity} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// 4. CHAPTER 03: Network Planning & Topology
function NetworkPlanningTopologyScene({ scrollProgress }) {
  const groupRef = useRef()

  const isVisible = scrollProgress >= 0.30 && scrollProgress <= 0.54
  const fadeIn = Math.min(1, Math.max(0, (scrollProgress - 0.30) / 0.05))
  const fadeOut = scrollProgress > 0.47 ? Math.max(0, 1 - (scrollProgress - 0.47) / 0.06) : 1
  const opacity = fadeIn * fadeOut

  const p = Math.min(1, Math.max(0, (scrollProgress - 0.333) / 0.167))

  const networkNodes = useMemo(() => [
    { id: 'hub', pos: [0, 0, 0], scale: 1.2, color: '#38bdf8' },
    { id: 'fdh1', pos: [-2.0, 1.2, 0.5], scale: 0.9, color: '#00d4ff' },
    { id: 'fdh2', pos: [2.2, 1.0, -0.5], scale: 0.9, color: '#00d4ff' },
    { id: 'fdh3', pos: [-1.5, -1.5, 0.6], scale: 0.8, color: '#64748b' },
    { id: 'fdh4', pos: [1.8, -1.4, 0.4], scale: 0.8, color: '#64748b' }
  ], [])

  const links = useMemo(() => [
    { from: 0, to: 1, unlockP: 0.15 },
    { from: 0, to: 2, unlockP: 0.25 },
    { from: 0, to: 3, unlockP: 0.35 },
    { from: 0, to: 4, unlockP: 0.45 }
  ], [])

  useFrame(({ clock }) => {
    if (!groupRef.current || !isVisible) return
    const t = clock.getElapsedTime()
    groupRef.current.rotation.y = t * 0.08 + p * 0.2
  })

  if (!isVisible) return null

  return (
    <group ref={groupRef}>
      {networkNodes.map((node, i) => {
        if (p < (i / networkNodes.length) * 0.75) return null
        return (
          <group key={i} position={node.pos}>
            <mesh>
              <sphereGeometry args={[0.18 * node.scale, 24, 24]} />
              <meshStandardMaterial color={node.color} roughness={0.3} metalness={0.7} transparent opacity={opacity} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.26 * node.scale, 0.28 * node.scale, 24]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.5} side={THREE.DoubleSide} />
            </mesh>
          </group>
        )
      })}

      {links.map((link, idx) => {
        if (p < link.unlockP) return null
        const startPt = networkNodes[link.from].pos
        const endPt = networkNodes[link.to].pos
        const lineProg = Math.min(1, (p - link.unlockP) / 0.15)
        const currentEnd = [
          startPt[0] + (endPt[0] - startPt[0]) * lineProg,
          startPt[1] + (endPt[1] - startPt[1]) * lineProg,
          startPt[2] + (endPt[2] - startPt[2]) * lineProg
        ]
        return (
          <line key={idx}>
            <bufferGeometry attach="geometry">
              <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([...startPt, ...currentEnd])} itemSize={3} />
            </bufferGeometry>
            <lineBasicMaterial attach="material" color="#0284c7" linewidth={1.5} transparent opacity={opacity * 0.8} />
          </line>
        )
      })}
    </group>
  )
}

// 5. CHAPTER 04: Pole Loading & Structural Analysis
function PoleLoadingScene({ scrollProgress }) {
  const groupRef = useRef()

  const isVisible = scrollProgress >= 0.47 && scrollProgress <= 0.71
  const fadeIn = Math.min(1, Math.max(0, (scrollProgress - 0.47) / 0.05))
  const fadeOut = scrollProgress > 0.64 ? Math.max(0, 1 - (scrollProgress - 0.64) / 0.06) : 1
  const opacity = fadeIn * fadeOut

  const p = Math.min(1, Math.max(0, (scrollProgress - 0.500) / 0.166))

  useFrame(({ clock }) => {
    if (!groupRef.current || !isVisible) return
    const t = clock.getElapsedTime()
    const windDeflection = p > 0.4 ? Math.sin(t * 1.2) * (0.01 + (p - 0.4) * 0.015) : 0
    groupRef.current.rotation.z = windDeflection
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.08 + 0.2
  })

  if (!isVisible) return null

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Wood/Composite Utility Pole Column */}
      <mesh position={[0, 0.8, 0]}>
        <cylinderGeometry args={[0.15, 0.22, 6.0, 16]} />
        <meshStandardMaterial color="#334155" roughness={0.8} metalness={0.1} transparent opacity={opacity} />
      </mesh>

      {/* Crossarms */}
      {p >= 0.2 && (
        <group position={[0, 3.0, 0]}>
          <mesh>
            <boxGeometry args={[3.0, 0.12, 0.12]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} transparent opacity={opacity} />
          </mesh>
          {[-1.2, 0, 1.2].map((x, idx) => (
            <mesh key={idx} position={[x, 0.18, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.25, 12]} />
              <meshStandardMaterial color="#64748b" roughness={0.3} metalness={0.7} transparent opacity={opacity} />
            </mesh>
          ))}
        </group>
      )}

      {p >= 0.3 && (
        <group position={[0, 1.7, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.1, 0.1]} />
            <meshStandardMaterial color="#1e293b" roughness={0.6} transparent opacity={opacity} />
          </mesh>
        </group>
      )}

      {p >= 0.25 && (
        <line>
          <bufferGeometry attach="geometry">
            <bufferAttribute attach="attributes-position" count={2} array={new Float32Array([0, 3.0, 0, -2.5, -2.0, 1.2])} itemSize={3} />
          </bufferGeometry>
          <lineBasicMaterial attach="material" color="#94a3b8" linewidth={1.5} transparent opacity={opacity * 0.75} />
        </line>
      )}

      {/* Subtle Force Vectors */}
      {p >= 0.65 && (
        <group position={[1.3, 3.0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <mesh>
            <coneGeometry args={[0.18, 0.5, 12]} />
            <meshStandardMaterial color="#f59e0b" roughness={0.4} metalness={0.4} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.6, 8]} />
            <meshBasicMaterial color="#f59e0b" transparent opacity={opacity} />
          </mesh>
        </group>
      )}
    </group>
  )
}

// 6. CHAPTER 05: Permitting & Traffic Control (Roadway & Cones)
function TrafficControlScene({ scrollProgress }) {
  const groupRef = useRef()

  const isVisible = scrollProgress >= 0.64 && scrollProgress <= 0.88
  const fadeIn = Math.min(1, Math.max(0, (scrollProgress - 0.64) / 0.05))
  const fadeOut = scrollProgress > 0.81 ? Math.max(0, 1 - (scrollProgress - 0.81) / 0.06) : 1
  const opacity = fadeIn * fadeOut

  const p = Math.min(1, Math.max(0, (scrollProgress - 0.666) / 0.167))

  useFrame(({ clock }) => {
    if (!groupRef.current || !isVisible) return
    const t = clock.getElapsedTime()
    groupRef.current.position.z = (t * 0.25 + p * 1.5) % 3 - 1.5
  })

  if (!isVisible) return null

  return (
    <group ref={groupRef} position={[0, -0.5, 0]}>
      {/* Matte Asphalt Roadway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.2, 0]}>
        <planeGeometry args={[10, 16]} />
        <meshStandardMaterial color="#0b1326" roughness={0.95} metalness={0.05} transparent opacity={opacity} />
      </mesh>

      {/* Dashed Lane Markings */}
      {[-4, -2, 0, 2, 4].map((z, idx) => (
        <mesh key={idx} rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.18, z]}>
          <planeGeometry args={[0.12, 1.2]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.85} />
        </mesh>
      ))}

      {/* High-Visibility Work Zone Traffic Cones */}
      {[-2.0, -1.0, 0.0, 1.0, 2.0].map((x, i) => {
        if (p < i * 0.16) return null
        return (
          <group key={i} position={[x, -0.75, -1.8 + i * 0.9]}>
            <mesh position={[0, 0.02, 0]}>
              <boxGeometry args={[0.4, 0.04, 0.4]} />
              <meshStandardMaterial color="#ea580c" roughness={0.6} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.35, 0]}>
              <coneGeometry args={[0.18, 0.7, 16]} />
              <meshStandardMaterial color="#ea580c" roughness={0.5} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0, 0.38, 0]}>
              <cylinderGeometry args={[0.1, 0.12, 0.16, 16]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={opacity * 0.9} />
            </mesh>
          </group>
        )
      })}
    </group>
  )
}

// 7. CHAPTER 06: Field App Design (Precision Device)
function AppDesignScene({ scrollProgress }) {
  const groupRef = useRef()
  const phoneRef = useRef()

  const isVisible = scrollProgress >= 0.80
  const fadeIn = Math.min(1, Math.max(0, (scrollProgress - 0.80) / 0.05))
  const opacity = fadeIn

  const p = Math.min(1, Math.max(0, (scrollProgress - 0.833) / 0.167))

  useFrame(({ clock }) => {
    if (!phoneRef.current || !isVisible) return
    const t = clock.getElapsedTime()
    phoneRef.current.rotation.y = THREE.MathUtils.degToRad(-12) + Math.sin(t * 0.35) * 0.08 + (1 - p) * 0.3
    phoneRef.current.rotation.x = THREE.MathUtils.degToRad(6) + Math.cos(t * 0.3) * 0.05
    phoneRef.current.position.y = Math.sin(t * 0.5) * 0.05
  })

  if (!isVisible) return null

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <group ref={phoneRef}>
        {/* Dark Brushed Titanium Chassis */}
        <mesh>
          <boxGeometry args={[2.2, 4.4, 0.18]} />
          <meshStandardMaterial color="#0f172a" metalness={0.85} roughness={0.25} transparent opacity={opacity} />
        </mesh>

        {/* Polished Display Surface */}
        <mesh position={[0, 0, 0.095]}>
          <planeGeometry args={[2.05, 4.2]} />
          <meshStandardMaterial color="#030712" roughness={0.15} metalness={0.4} transparent opacity={opacity} />
        </mesh>

        {/* Status Header */}
        {p >= 0.2 && (
          <group position={[0, 1.8, 0.1]}>
            <mesh>
              <planeGeometry args={[1.7, 0.18]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={opacity * 0.85} />
            </mesh>
          </group>
        )}

        {/* GIS Map Vector on Display */}
        {p >= 0.4 && (
          <group position={[0, 0.75, 0.1]}>
            <mesh>
              <planeGeometry args={[1.8, 1.4]} />
              <meshStandardMaterial color="#082f49" roughness={0.4} transparent opacity={opacity} />
            </mesh>
            <line position={[0, 0, 0.01]}>
              <bufferGeometry attach="geometry">
                <bufferAttribute
                  attach="attributes-position"
                  count={4}
                  array={new Float32Array([-0.6, -0.4, 0, -0.1, 0.15, 0, 0.2, -0.15, 0, 0.6, 0.4, 0])}
                  itemSize={3}
                />
              </bufferGeometry>
              <lineBasicMaterial attach="material" color="#38bdf8" linewidth={1.5} transparent opacity={opacity} />
            </line>
          </group>
        )}
      </group>
    </group>
  )
}

// Dense Fiber Optic Strand Bundle (High-Density Glow with Scroll Zoom-In/Out)
function FiberOpticCableScene({ scrollProgress }) {
  const groupRef = useRef()
  const tipsRef = useRef()
  const strandCount = 2200

  const isVisible = scrollProgress <= 0.28
  const opacity = scrollProgress > 0.15 ? Math.max(0, 1 - (scrollProgress - 0.15) / 0.10) : 1

  const [linePositions, tipPositions, tipColors] = useMemo(() => {
    const linePos = new Float32Array(strandCount * 6)
    const tPos = new Float32Array(strandCount * 3)
    const tCol = new Float32Array(strandCount * 3)

    const colorCyan = new THREE.Color('#00e5ff')
    const colorBrightWhite = new THREE.Color('#ffffff')
    const colorElectricBlue = new THREE.Color('#2979ff')
    const colorDeepBlue = new THREE.Color('#002699')

    for (let i = 0; i < strandCount; i++) {
      const radiusSheath = Math.pow(Math.random(), 0.7) * 0.85
      const angleSheath = Math.random() * Math.PI * 2
      const startX = 4.5 + radiusSheath * Math.cos(angleSheath)
      const startY = 2.0 + radiusSheath * Math.sin(angleSheath)
      const startZ = -5.0 + (Math.random() - 0.5) * 1.5

      const spreadAngle = Math.random() * Math.PI * 2
      const spreadDist = Math.pow(Math.random(), 0.6) * 3.5
      const length = 8.0 + Math.random() * 4.5

      const endX = startX - length * 0.68 + Math.cos(spreadAngle) * spreadDist * 0.5
      const endY = startY - length * 0.32 + Math.sin(spreadAngle) * spreadDist * 0.5
      const endZ = startZ + length * 0.75 + (Math.random() - 0.5) * 2.0

      linePos[i * 6] = startX
      linePos[i * 6 + 1] = startY
      linePos[i * 6 + 2] = startZ
      linePos[i * 6 + 3] = endX
      linePos[i * 6 + 4] = endY
      linePos[i * 6 + 5] = endZ

      tPos[i * 3] = endX
      tPos[i * 3 + 1] = endY
      tPos[i * 3 + 2] = endZ

      const rand = Math.random()
      const col = rand > 0.4 ? (rand > 0.75 ? colorBrightWhite : colorCyan) : (rand > 0.15 ? colorElectricBlue : colorDeepBlue)
      tCol[i * 3] = col.r
      tCol[i * 3 + 1] = col.g
      tCol[i * 3 + 2] = col.b
    }

    return [linePos, tPos, tCol]
  }, [])

  useFrame((state) => {
    if (!groupRef.current || !isVisible) return
    const t = state.clock.getElapsedTime()

    groupRef.current.rotation.z = Math.sin(t * 0.35) * 0.05 - 0.20
    groupRef.current.rotation.y = Math.cos(t * 0.25) * 0.06 - 0.35
    groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.04 + 0.12

    // SCROLL-DRIVEN DRAMATIC ZOOM-IN (Reverses smoothly on scroll up)
    const normProgress = Math.min(1, scrollProgress / 0.22)
    const zoomZ = THREE.MathUtils.lerp(-1.5, 7.5, normProgress)
    const zoomScale = THREE.MathUtils.lerp(0.85, 3.2, normProgress)
    const zoomX = THREE.MathUtils.lerp(0.5, -2.0, normProgress)
    const zoomY = THREE.MathUtils.lerp(0, 0.8, normProgress)

    groupRef.current.position.z = zoomZ
    groupRef.current.position.x = zoomX
    groupRef.current.position.y = zoomY
    groupRef.current.scale.set(zoomScale, zoomScale, zoomScale)

    if (tipsRef.current && tipsRef.current.material) {
      tipsRef.current.material.opacity = (0.85 + Math.sin(t * 2.5) * 0.12) * opacity
    }
  })

  if (!isVisible) return null

  return (
    <group ref={groupRef}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={linePositions.length / 3}
            array={linePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#0066ff"
          transparent
          opacity={0.35 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      <points ref={tipsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={strandCount}
            array={tipPositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={strandCount}
            array={tipColors}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.08}
          vertexColors
          transparent
          opacity={0.95 * opacity}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default function MainScene() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = (e) => {
      if (typeof e.detail === 'number') {
        setScrollProgress(Math.max(0, Math.min(1, e.detail)))
      }
    }
    window.addEventListener('update-scene-progress', handleScroll)
    return () => window.removeEventListener('update-scene-progress', handleScroll)
  }, [])

  return (
    <div className="persistent-scene-container" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'none',
      background: 'radial-gradient(circle at 50% 35%, #071224 0%, #030712 90%)',
      overflow: 'hidden'
    }}>
      <Canvas
        camera={{ position: [0, 0, 10.0], fov: 42 }}
        gl={{ alpha: false, antialias: true, toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.05 }}
      >
        <color attach="background" args={["#030712"]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 6]} intensity={1.4} color="#f8fafc" />
        <pointLight position={[-6, -4, 4]} intensity={1.2} color="#0284c7" />

        {/* Master Cinematographic Camera Rig */}
        <CameraRig scrollProgress={scrollProgress} />

        <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.25}>
          {/* Dense Fiber Optic Strand Bundle with Scroll Zoom-In/Out */}
          <FiberOpticCableScene scrollProgress={scrollProgress} />
          {/* Physical Conduit Cable Entrance & Interior Tunnel Travel */}
          <FiberTunnelScene scrollProgress={scrollProgress} />
          <PermittingBlueprintScene scrollProgress={scrollProgress} />
          <NetworkPlanningTopologyScene scrollProgress={scrollProgress} />
          <PoleLoadingScene scrollProgress={scrollProgress} />
          <TrafficControlScene scrollProgress={scrollProgress} />
          <AppDesignScene scrollProgress={scrollProgress} />
        </Float>

        {/* Restrained Bloom Postprocessing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.4} luminanceSmoothing={0.8} intensity={0.65} />
          <Vignette eskil={false} offset={0.2} darkness={0.9} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
