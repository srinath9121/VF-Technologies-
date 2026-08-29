import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Fiber Optic Cable Strand Bundle (inspired directly by reference photo)
function FiberOpticCableScene() {
  const groupRef = useRef()
  const fibersRef = useRef()
  const tipsRef = useRef()
  const strandCount = 2000

  // Generate dense fiber strand geometry
  const [linePositions, tipPositions, tipColors, strandScales] = useMemo(() => {
    const linePos = new Float32Array(strandCount * 6)
    const tPos = new Float32Array(strandCount * 3)
    const tCol = new Float32Array(strandCount * 3)
    const sScales = new Float32Array(strandCount)

    const colorCyan = new THREE.Color('#00e5ff')
    const colorBrightWhite = new THREE.Color('#ffffff')
    const colorElectricBlue = new THREE.Color('#2979ff')
    const colorDeepBlue = new THREE.Color('#002699')

    for (let i = 0; i < strandCount; i++) {
      // Sheath origin at top-right / back in 3D space
      const radiusSheath = Math.pow(Math.random(), 0.7) * 0.75
      const angleSheath = Math.random() * Math.PI * 2
      const startX = 4.2 + radiusSheath * Math.cos(angleSheath)
      const startY = 1.8 + radiusSheath * Math.sin(angleSheath)
      const startZ = -4.5 + (Math.random() - 0.5) * 1.5

      // Target cluster radiating forward-left towards the viewer
      const spreadAngle = Math.random() * Math.PI * 2
      const spreadDist = Math.pow(Math.random(), 0.6) * 3.2
      const length = 7.5 + Math.random() * 4.0

      const endX = startX - length * 0.68 + Math.cos(spreadAngle) * spreadDist * 0.5
      const endY = startY - length * 0.32 + Math.sin(spreadAngle) * spreadDist * 0.5
      const endZ = startZ + length * 0.75 + (Math.random() - 0.5) * 2.0

      // Line Segment: Start & End
      linePos[i * 6] = startX
      linePos[i * 6 + 1] = startY
      linePos[i * 6 + 2] = startZ
      linePos[i * 6 + 3] = endX
      linePos[i * 6 + 4] = endY
      linePos[i * 6 + 5] = endZ

      // Glowing tip position
      tPos[i * 3] = endX
      tPos[i * 3 + 1] = endY
      tPos[i * 3 + 2] = endZ

      // Tip Color selection (luminous white/cyan glowing core)
      const rand = Math.random()
      const col = rand > 0.4 ? (rand > 0.75 ? colorBrightWhite : colorCyan) : (rand > 0.15 ? colorElectricBlue : colorDeepBlue)
      tCol[i * 3] = col.r
      tCol[i * 3 + 1] = col.g
      tCol[i * 3 + 2] = col.b

      sScales[i] = Math.random() * 0.08 + 0.04
    }

    return [linePos, tPos, tCol, sScales]
  }, [])

  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    // Normalized scroll progression [0.0 to 1.0]
    const scroll = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight || 1)

    if (groupRef.current) {
      // 1. CONSTANT 3D SPEED: Gentle rotational drift & floating pulsation
      groupRef.current.rotation.z = Math.sin(t * 0.35) * 0.06 - 0.25
      groupRef.current.rotation.y = Math.cos(t * 0.25) * 0.08 - 0.4
      groupRef.current.rotation.x = Math.sin(t * 0.3) * 0.05 + 0.15

      // 2. SCROLL DRIVEN ZOOM IN / ZOOM OUT (Reverses smoothly on scroll up/down)
      // When scrolling down -> Zooms IN significantly closer to camera and scales up
      // When scrolling up -> Zooms OUT back into the distance
      const zoomZ = THREE.MathUtils.lerp(-1.5, 4.5, scroll)
      const zoomScale = THREE.MathUtils.lerp(0.85, 2.2, scroll)
      const zoomX = THREE.MathUtils.lerp(0.5, -1.2, scroll)
      const zoomY = THREE.MathUtils.lerp(0, 0.6, scroll)

      groupRef.current.position.z = zoomZ
      groupRef.current.position.x = zoomX
      groupRef.current.position.y = zoomY
      groupRef.current.scale.set(zoomScale, zoomScale, zoomScale)
    }

    // Subtle constant light shimmer on fiber tips
    if (tipsRef.current) {
      const material = tipsRef.current.material
      if (material) {
        material.opacity = 0.85 + Math.sin(t * 2.5) * 0.12
      }
    }
  })

  return (
    <group ref={groupRef}>
      {/* Dense Glass Fiber Strands */}
      <lineSegments ref={fibersRef}>
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
          opacity={0.32}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Luminous Glowing Tips at the Ends of the Fibers */}
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
          size={0.075}
          vertexColors
          transparent
          opacity={0.95}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          sizeAttenuation
        />
      </points>
    </group>
  )
}

export default function ThreeCanvas() {
  return (
    <div className="global-3d-canvas-container">
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
        style={{ pointerEvents: 'none' }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2.2} color="#00e5ff" />
        <pointLight position={[-10, -5, -5]} intensity={1.5} color="#0055ff" />
        <pointLight position={[0, 0, 5]} intensity={1.8} color="#ffffff" />

        {/* 3D Fiber Optic Cable with Constant Motion & Scroll Zoom-In / Zoom-Out */}
        <FiberOpticCableScene />
      </Canvas>
    </div>
  )
}
