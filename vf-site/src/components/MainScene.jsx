import { useRef, useMemo, createContext } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import * as THREE from 'three'
import TelecomTower from './TelecomTower'
import TowerFiberTransition from './TowerFiberTransition'
import { 
  PoeticSkyShader, 
  TerrainEdgeGlowShader, 
  WaterReflectiveShader, 
  VolumetricMistShader, 
  VolumetricLightConeShader 
} from './FiberShaders'

export const ScrollContext = createContext({ current: 0 })

// Cinematic Camera Rig for "Far Away -> Approach -> Climb Tower" Narrative
function TowerCameraRig({ scrollProgressRef }) {
  const { camera, pointer } = useThree()
  const currentLookTarget = useRef(new THREE.Vector3(0, 16.0, 0))

  useFrame(() => {
    const scroll = scrollProgressRef.current
    const mouseX = pointer.x * 0.4
    const mouseY = pointer.y * 0.3

    let targetX = mouseX * 2.5
    let targetY = 16.0
    let targetZ = 55.0
    let lookX = 0
    let lookY = 22.0
    let lookZ = 0

    if (scroll < 0.16) {
      // 1. START: FAR AWAY & SMALL IN VAST ENVIRONMENT
      const p = scroll / 0.16
      const smoothP = p * p * (3 - 2 * p)
      targetZ = THREE.MathUtils.lerp(55.0, 10.5, smoothP)
      targetY = THREE.MathUtils.lerp(18.0, 7.2, smoothP) + mouseY
      lookY = THREE.MathUtils.lerp(24.0, 8.0, smoothP)
      targetX = mouseX * THREE.MathUtils.lerp(3.5, 1.5, smoothP)
    } else if (scroll < 0.30) {
      // 2. BAND 01 // ABOUT: Close to lower gantry platform
      const p = (scroll - 0.16) / 0.14
      targetY = 7.2 + p * 3.0 + mouseY
      targetZ = 10.5 - p * 0.8
      targetX = 1.8 + mouseX * 1.2
      lookY = targetY + 1.2
    } else if (scroll < 0.44) {
      // 3. BAND 02 // CLIENTS
      const p = (scroll - 0.30) / 0.14
      targetY = 10.2 + p * 6.5 + mouseY
      targetZ = 9.7 - p * 0.7
      targetX = -1.9 + mouseX * 1.2
      lookY = targetY + 1.2
    } else if (scroll < 0.58) {
      // 4. BAND 03 // CAREERS
      const p = (scroll - 0.44) / 0.14
      targetY = 16.7 + p * 7.5 + mouseY
      targetZ = 9.0 - p * 0.5
      targetX = 1.8 + mouseX * 1.2
      lookY = targetY + 1.2
    } else if (scroll < 0.72) {
      // 5. BAND 04 // ENGINEERING
      const p = (scroll - 0.58) / 0.14
      targetY = 24.2 + p * 6.8 + mouseY
      targetZ = 8.5 - p * 0.5
      targetX = -1.8 + mouseX * 1.2
      lookY = targetY + 1.2
    } else if (scroll <= 0.86) {
      // 6. BAND 05 // OSP FIBER
      const p = (scroll - 0.72) / 0.14
      targetX = THREE.MathUtils.lerp(0.5, 0.0, p) + mouseX * 0.8
      targetY = THREE.MathUtils.lerp(30.0, 31.0, p)
      targetZ = THREE.MathUtils.lerp(5.0, 11.0, p)
      lookY = 30.0
    } else {
      // 7. BAND 06 // CONTACT
      const p = (scroll - 0.86) / 0.14
      targetY = 32.0 + p * 16.0 + mouseY
      targetZ = 10.5
      targetX = mouseX * 1.5
      lookY = 48.0
    }

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.06)
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.06)
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.06)

    currentLookTarget.current.lerp(new THREE.Vector3(lookX, lookY, lookZ), 0.06)
    camera.lookAt(currentLookTarget.current)
  })

  return null
}

// 1. Rayleigh & Mie Sky Backdrop
function PoeticSkyBackdrop() {
  const skyMatRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorZenith: { value: new THREE.Color('#01040a') },
    uColorMid: { value: new THREE.Color('#071322') },
    uColorHorizon: { value: new THREE.Color('#0e2238') },
    uColorMist: { value: new THREE.Color('#193754') }
  }), [])

  useFrame(({ clock }) => {
    if (skyMatRef.current) {
      skyMatRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <mesh position={[0, 25, -45]}>
      <planeGeometry args={[180, 120]} />
      <shaderMaterial
        ref={skyMatRef}
        vertexShader={PoeticSkyShader.vertexShader}
        fragmentShader={PoeticSkyShader.fragmentShader}
        uniforms={uniforms}
        depthWrite={false}
      />
    </mesh>
  )
}

// 2. Volumetric Mountain Mist Planes (Skill: threejs-volumetric-clouds)
function VolumetricMountainMist() {
  const mist1Ref = useRef()
  const mist2Ref = useRef()

  const uniforms1 = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 0.03 },
    uColorMist: { value: new THREE.Color('#38bdf8') },
    uColorShadow: { value: new THREE.Color('#020914') },
    uDensity: { value: 0.42 }
  }), [])

  const uniforms2 = useMemo(() => ({
    uTime: { value: 0 },
    uSpeed: { value: 0.05 },
    uColorMist: { value: new THREE.Color('#22d3ee') },
    uColorShadow: { value: new THREE.Color('#030c18') },
    uDensity: { value: 0.35 }
  }), [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (mist1Ref.current) mist1Ref.current.uniforms.uTime.value = t
    if (mist2Ref.current) mist2Ref.current.uniforms.uTime.value = t
  })

  return (
    <group>
      {/* Low Valley Mist Layer */}
      <mesh position={[0, 1.5, -15]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[160, 80]} />
        <shaderMaterial
          ref={mist1Ref}
          vertexShader={VolumetricMistShader.vertexShader}
          fragmentShader={VolumetricMistShader.fragmentShader}
          uniforms={uniforms1}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Mid Mountain Valley Mist Layer */}
      <mesh position={[0, 9.0, -28]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[180, 90]} />
        <shaderMaterial
          ref={mist2Ref}
          vertexShader={VolumetricMistShader.vertexShader}
          fragmentShader={VolumetricMistShader.fragmentShader}
          uniforms={uniforms2}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// 3. Volumetric Beacon God Ray Light Cone (Skill: threejs-raymarched-space-effects)
function VolumetricBeaconGodRay() {
  const beamMatRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorBeam: { value: new THREE.Color('#38bdf8') },
    uColorCore: { value: new THREE.Color('#ffffff') },
    uIntensity: { value: 1.0 }
  }), [])

  useFrame(({ clock }) => {
    if (beamMatRef.current) {
      beamMatRef.current.uniforms.uTime.value = clock.getElapsedTime()
    }
  })

  return (
    <group position={[0, 48.0, 0]}>
      {/* Downward Raymarched Volumetric Light Cone */}
      <mesh position={[0, -12, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[10.0, 24.0, 32, 1, true]} />
        <shaderMaterial
          ref={beamMatRef}
          vertexShader={VolumetricLightConeShader.vertexShader}
          fragmentShader={VolumetricLightConeShader.fragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </group>
  )
}

// 4. Layered Shan Shui Mountain Ridges
function PoeticMountainLandscape() {
  const foreLeftRef = useRef()
  const foreRightRef = useRef()
  const midLeftRef = useRef()
  const midRightRef = useRef()
  const distPeakRef = useRef()

  const shaderUniforms = useMemo(() => {
    return {
      foreLeft: {
        uTime: { value: 0 },
        uLayerIndex: { value: 0.0 },
        uColorBase: { value: new THREE.Color('#02060e') },
        uColorMist: { value: new THREE.Color('#0d2035') },
        uColorRim: { value: new THREE.Color('#22d3ee') }
      },
      foreRight: {
        uTime: { value: 0 },
        uLayerIndex: { value: 0.0 },
        uColorBase: { value: new THREE.Color('#02060e') },
        uColorMist: { value: new THREE.Color('#0d2035') },
        uColorRim: { value: new THREE.Color('#22d3ee') }
      },
      midLeft: {
        uTime: { value: 0 },
        uLayerIndex: { value: 1.0 },
        uColorBase: { value: new THREE.Color('#05111e') },
        uColorMist: { value: new THREE.Color('#14304c') },
        uColorRim: { value: new THREE.Color('#38bdf8') }
      },
      midRight: {
        uTime: { value: 0 },
        uLayerIndex: { value: 1.0 },
        uColorBase: { value: new THREE.Color('#05111e') },
        uColorMist: { value: new THREE.Color('#14304c') },
        uColorRim: { value: new THREE.Color('#38bdf8') }
      },
      distant: {
        uTime: { value: 0 },
        uLayerIndex: { value: 2.0 },
        uColorBase: { value: new THREE.Color('#0a1d30') },
        uColorMist: { value: new THREE.Color('#1a3d60') },
        uColorRim: { value: new THREE.Color('#60a5fa') }
      }
    }
  }, [])

  const [foreLeftGeom, foreRightGeom, midLeftGeom, midRightGeom, distGeom] = useMemo(() => {
    const fL = new THREE.ConeGeometry(26, 32, 6)
    fL.scale(1.4, 1.0, 0.5)

    const fR = new THREE.ConeGeometry(24, 28, 6)
    fR.scale(1.3, 1.0, 0.5)

    const mL = new THREE.ConeGeometry(38, 44, 6)
    mL.scale(1.6, 1.0, 0.5)

    const mR = new THREE.ConeGeometry(34, 40, 6)
    mR.scale(1.5, 1.0, 0.5)

    const dP = new THREE.ConeGeometry(48, 52, 6)
    dP.scale(1.8, 1.0, 0.4)

    return [fL, fR, mL, mR, dP]
  }, [])

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()
    if (foreLeftRef.current) foreLeftRef.current.uniforms.uTime.value = t
    if (foreRightRef.current) foreRightRef.current.uniforms.uTime.value = t
    if (midLeftRef.current) midLeftRef.current.uniforms.uTime.value = t
    if (midRightRef.current) midRightRef.current.uniforms.uTime.value = t
    if (distPeakRef.current) distPeakRef.current.uniforms.uTime.value = t
  })

  return (
    <group>
      <mesh geometry={distGeom} position={[4, 14.0, -38]} rotation={[0, 0.2, 0]}>
        <shaderMaterial
          ref={distPeakRef}
          vertexShader={TerrainEdgeGlowShader.vertexShader}
          fragmentShader={TerrainEdgeGlowShader.fragmentShader}
          uniforms={shaderUniforms.distant}
          transparent
        />
      </mesh>

      <mesh geometry={midLeftGeom} position={[-42, 10.0, -28]} rotation={[0, 0.5, 0]}>
        <shaderMaterial
          ref={midLeftRef}
          vertexShader={TerrainEdgeGlowShader.vertexShader}
          fragmentShader={TerrainEdgeGlowShader.fragmentShader}
          uniforms={shaderUniforms.midLeft}
          transparent
        />
      </mesh>
      <mesh geometry={midRightGeom} position={[42, 9.0, -30]} rotation={[0, -0.4, 0]}>
        <shaderMaterial
          ref={midRightRef}
          vertexShader={TerrainEdgeGlowShader.vertexShader}
          fragmentShader={TerrainEdgeGlowShader.fragmentShader}
          uniforms={shaderUniforms.midRight}
          transparent
        />
      </mesh>

      <mesh geometry={foreLeftGeom} position={[-28, 5.0, -14]} rotation={[0, 0.35, 0]}>
        <shaderMaterial
          ref={foreLeftRef}
          vertexShader={TerrainEdgeGlowShader.vertexShader}
          fragmentShader={TerrainEdgeGlowShader.fragmentShader}
          uniforms={shaderUniforms.foreLeft}
          transparent
        />
      </mesh>
      <mesh geometry={foreRightGeom} position={[28, 4.5, -16]} rotation={[0, -0.3, 0]}>
        <shaderMaterial
          ref={foreRightRef}
          vertexShader={TerrainEdgeGlowShader.vertexShader}
          fragmentShader={TerrainEdgeGlowShader.fragmentShader}
          uniforms={shaderUniforms.foreRight}
          transparent
        />
      </mesh>
    </group>
  )
}

// 5. Poetic Ink Lake Reflection Surface
function PoeticWaterSurface({ scrollProgressRef }) {
  const waterMatRef = useRef()

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMonolithPos: { value: new THREE.Vector3(0, 0, 0) },
    uColorWater: { value: new THREE.Color('#01050d') },
    uColorGlow: { value: new THREE.Color('#00d4ff') },
    uScroll: { value: 0 }
  }), [])

  useFrame(({ clock }) => {
    if (!waterMatRef.current) return
    const t = clock.getElapsedTime()
    waterMatRef.current.uniforms.uTime.value = t
    waterMatRef.current.uniforms.uScroll.value = scrollProgressRef.current
  })

  return (
    <mesh position={[0, -2.4, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[220, 220, 64, 64]} />
      <shaderMaterial
        ref={waterMatRef}
        vertexShader={WaterReflectiveShader.vertexShader}
        fragmentShader={WaterReflectiveShader.fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

// Dynamic Multi-Band Lighting System
function DynamicTowerLighting({ scrollProgressRef }) {
  const keyLightRef = useRef()

  useFrame(() => {
    const scroll = scrollProgressRef.current
    const currentY = 5.0 + scroll * 45.0

    if (keyLightRef.current) {
      keyLightRef.current.position.y = currentY + 12.0
      if (scroll < 0.20) {
        keyLightRef.current.color.set('#fef3c7')
        keyLightRef.current.intensity = 1.7
      } else if (scroll < 0.75) {
        keyLightRef.current.color.set('#f8fafc')
        keyLightRef.current.intensity = 2.0
      } else {
        keyLightRef.current.color.set('#38bdf8')
        keyLightRef.current.intensity = 1.8
      }
    }
  })

  return (
    <group>
      <ambientLight intensity={0.65} />
      <directionalLight ref={keyLightRef} position={[15, 20, 20]} intensity={1.9} />
      <directionalLight position={[-15, 12, -15]} intensity={0.8} color="#00d4ff" />
      <pointLight position={[0, 0.5, 4]} intensity={2.4} distance={15} color="#f59e0b" />
    </group>
  )
}

export default function MainScene({ scrollProgressRef }) {
  return (
    <div className="persistent-scene-container" style={{
      position: 'fixed',
      inset: 0,
      zIndex: 0,
      pointerEvents: 'auto',
      background: 'radial-gradient(circle at 50% 25%, #081628 0%, #01040a 90%)',
      overflow: 'hidden'
    }}>
      <Canvas
        camera={{ position: [0, 16.0, 55.0], fov: 36 }}
        gl={{
          alpha: false,
          antialias: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.25
        }}
        dpr={[1, 2]}
      >
        <color attach="background" args={["#01040a"]} />
        <fog attach="fog" args={["#01040a", 20, 80]} />

        {/* Dynamic Architectural Lighting */}
        <DynamicTowerLighting scrollProgressRef={scrollProgressRef} />

        {/* Master Camera Ascension Rig */}
        <TowerCameraRig scrollProgressRef={scrollProgressRef} />

        {/* 1. Rayleigh/Mie Atmospheric Scattering Sky */}
        <PoeticSkyBackdrop />

        {/* 2. Volumetric Mountain Mist Blankets (threejs-volumetric-clouds) */}
        <VolumetricMountainMist />

        {/* 4. Layered Shan Shui & Romantic Mountain Ridges */}
        <PoeticMountainLandscape />

        {/* 5. Poetic Ink Lake Reflection Surface */}
        <PoeticWaterSurface scrollProgressRef={scrollProgressRef} />

        {/* 6. Persistent 3D Telecommunication Tower */}
        <TelecomTower scrollProgressRef={scrollProgressRef} />

        {/* 7. Volumetric Beacon God Ray Light Cone (threejs-raymarched-space-effects) */}
        <VolumetricBeaconGodRay />

        {/* 8. Signature OSP Cable -> Fiber -> Network Transition */}
        <TowerFiberTransition scrollProgressRef={scrollProgressRef} />

        {/* Film-Grade Post-Processing */}
        <EffectComposer>
          <Bloom luminanceThreshold={0.32} luminanceSmoothing={0.8} intensity={0.9} />
          <ChromaticAberration offset={[0.0007, 0.0007]} />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  )
}
