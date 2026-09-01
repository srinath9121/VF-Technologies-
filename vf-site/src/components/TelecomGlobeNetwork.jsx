import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function TelecomGlobeNetwork() {
  const globeGroupRef = useRef()
  const arcsRef = useRef()
  const pulsesRef = useRef()

  // Globe Radius & Scale
  const radius = 18.0

  // 1. Dot-Matrix Continents & Landmass Points
  const [pointPositions, pointColors] = useMemo(() => {
    const totalPoints = 2600
    const positions = new Float32Array(totalPoints * 3)
    const colors = new Float32Array(totalPoints * 3)

    const amber = new THREE.Color('#f59e0b')
    const gold = new THREE.Color('#fbbf24')
    const cyan = new THREE.Color('#38bdf8')

    // Generate pseudo-continents using spherical clusters
    const continentCenters = [
      { lat: 40, lon: -100, rad: 35 }, // North America
      { lat: -15, lon: -60, rad: 30 }, // South America
      { lat: 50, lon: 15, rad: 28 },   // Europe
      { lat: 20, lon: 78, rad: 32 },   // India / South Asia
      { lat: 35, lon: 105, rad: 35 },  // East Asia
      { lat: 0, lon: 25, rad: 32 },    // Africa
      { lat: -25, lon: 135, rad: 25 }  // Australia
    ]

    let placed = 0
    for (let i = 0; i < totalPoints; i++) {
      // Golden Spiral Sphere Distribution
      const phi = Math.acos(1 - (2 * (i + 0.5)) / totalPoints)
      const theta = Math.PI * (1 + Math.sqrt(5)) * i

      const lat = 90 - (phi * 180) / Math.PI
      const lon = ((theta * 180) / Math.PI) % 360 - 180

      // Check if point is near a continent center
      let isLand = false
      for (const c of continentCenters) {
        const dLat = lat - c.lat
        const dLon = lon - c.lon
        const dist = Math.sqrt(dLat * dLat + dLon * dLon)
        if (dist < c.rad) {
          isLand = true
          break
        }
      }

      const r = radius * (isLand ? 1.0 : 0.99)
      const x = r * Math.sin(phi) * Math.cos(theta)
      const y = r * Math.cos(phi)
      const z = r * Math.sin(phi) * Math.sin(theta)

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      const col = isLand ? (Math.random() > 0.4 ? amber : gold) : cyan
      const intensity = isLand ? 1.0 : 0.25
      colors[i * 3] = col.r * intensity
      colors[i * 3 + 1] = col.g * intensity
      colors[i * 3 + 2] = col.b * intensity
    }

    return [positions, colors]
  }, [radius])

  // 2. Optical Great-Circle Arcs & Outward Signal Beams (Matching Reference Image)
  const [arcGeometries, signalSpikes] = useMemo(() => {
    const latLonToVec3 = (lat, lon, r) => {
      const phi = (90 - lat) * (Math.PI / 180)
      const theta = (lon + 180) * (Math.PI / 180)
      return new THREE.Vector3(
        -(r * Math.sin(phi) * Math.cos(theta)),
        r * Math.cos(phi),
        r * Math.sin(phi) * Math.sin(theta)
      )
    }

    const hubs = [
      { name: "NY", lat: 40.7, lon: -74.0 },
      { name: "LON", lat: 51.5, lon: -0.1 },
      { name: "MUM", lat: 19.0, lon: 72.8 },
      { name: "HYD", lat: 17.3, lon: 78.4 }, // VF Tech base
      { name: "TYO", lat: 35.6, lon: 139.6 },
      { name: "SFO", lat: 37.7, lon: -122.4 },
      { name: "SIN", lat: 1.3, lon: 103.8 },
      { name: "FRA", lat: 50.1, lon: 8.6 },
      { name: "SYD", lat: -33.8, lon: 151.2 },
      { name: "SAO", lat: -23.5, lon: -46.6 }
    ]

    const routes = [
      [0, 1], [1, 7], [7, 2], [2, 3], [3, 6], [6, 4],
      [4, 5], [5, 0], [0, 9], [9, 1], [3, 8], [6, 8]
    ]

    // Create arched 3D spline tubes
    const geoms = routes.map(([sIdx, eIdx]) => {
      const p1 = latLonToVec3(hubs[sIdx].lat, hubs[sIdx].lon, radius)
      const p2 = latLonToVec3(hubs[eIdx].lat, hubs[eIdx].lon, radius)
      const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
      const alt = p1.distanceTo(p2) * 0.25
      mid.normalize().multiplyScalar(radius + alt)

      const curve = new THREE.CatmullRomCurve3([p1, mid, p2])
      return new THREE.TubeGeometry(curve, 32, 0.05, 6, false)
    })

    // Outward Red/Coral Signal Spikes (as in reference image)
    const spikes = hubs.map((h, idx) => {
      const basePos = latLonToVec3(h.lat, h.lon, radius)
      const spikeLen = 3.5 + Math.random() * 3.0
      const tipPos = basePos.clone().normalize().multiplyScalar(radius + spikeLen)
      const mid = new THREE.Vector3().addVectors(basePos, tipPos).multiplyScalar(0.5)
      const dir = new THREE.Vector3().subVectors(tipPos, basePos).normalize()
      const rot = new THREE.Euler().setFromQuaternion(
        new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
      )

      return { id: `spike-${idx}`, pos: mid, rot, length: spikeLen }
    })

    return [geoms, spikes]
  }, [radius])

  // Continuous Natural Rotation & Signal Pulse Animations
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime()

    // Smooth natural rotation
    if (globeGroupRef.current) {
      globeGroupRef.current.rotation.y = t * 0.04
      globeGroupRef.current.rotation.x = Math.sin(t * 0.015) * 0.08 + 0.15
    }
  })

  return (
    <group position={[18, 16, -35]}>
      <group ref={globeGroupRef}>
        
        {/* 1. Dot Matrix Continents */}
        <points>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" count={pointPositions.length / 3} array={pointPositions} itemSize={3} />
            <bufferAttribute attach="attributes-color" count={pointColors.length / 3} array={pointColors} itemSize={3} />
          </bufferGeometry>
          <pointsMaterial size={0.18} vertexColors transparent opacity={0.88} blending={THREE.AdditiveBlending} />
        </points>

        {/* 2. Inner Atmosphere Glow Sphere */}
        <mesh>
          <sphereGeometry args={[radius * 0.98, 32, 32]} />
          <meshBasicMaterial color="#031122" transparent opacity={0.85} />
        </mesh>

        {/* 3. Optical Great-Circle Fiber Arcs */}
        <group ref={arcsRef}>
          {arcGeometries.map((geom, idx) => (
            <mesh key={idx} geometry={geom}>
              <meshBasicMaterial color="#00d4ff" transparent opacity={0.65} blending={THREE.AdditiveBlending} />
            </mesh>
          ))}
        </group>

        {/* 4. Outward Signal Spikes (Matching Reference Image) */}
        {signalSpikes.map((spike) => (
          <mesh key={spike.id} position={spike.pos} rotation={spike.rot}>
            <cylinderGeometry args={[0.02, 0.08, spike.length, 8]} />
            <meshBasicMaterial color="#f43f5e" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}

        {/* 5. Outer Atmospheric Halo Ring */}
        <mesh>
          <ringGeometry args={[radius + 0.4, radius + 2.4, 64]} />
          <meshBasicMaterial color="#00d4ff" transparent opacity={0.12} side={THREE.DoubleSide} blending={THREE.AdditiveBlending} />
        </mesh>

      </group>
    </group>
  )
}
