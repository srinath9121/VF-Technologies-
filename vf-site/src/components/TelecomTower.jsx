import { useRef, useMemo, useState } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import * as THREE from 'three'

export default function TelecomTower({ scrollProgressRef }) {
  const towerGroupRef = useRef()
  const beaconLightRef = useRef()
  const { pointer } = useThree()
  const targetRotationY = useRef(0)
  const [hoveredItem, setHoveredItem] = useState(null)

  // Materials: High-end tactile steel, aviation red, galvanized white, dish plastic
  const materials = useMemo(() => {
    return {
      whiteSteel: new THREE.MeshStandardMaterial({
        color: '#e2e8f0',
        metalness: 0.85,
        roughness: 0.28,
      }),
      redSteel: new THREE.MeshStandardMaterial({
        color: '#dc2626',
        metalness: 0.82,
        roughness: 0.32,
      }),
      darkMetal: new THREE.MeshStandardMaterial({
        color: '#1e293b',
        metalness: 0.9,
        roughness: 0.2,
      }),
      galvanized: new THREE.MeshStandardMaterial({
        color: '#94a3b8',
        metalness: 0.75,
        roughness: 0.4,
      }),
      antennaWhite: new THREE.MeshStandardMaterial({
        color: '#f8fafc',
        roughness: 0.45,
        metalness: 0.1,
      }),
      cableBlack: new THREE.MeshStandardMaterial({
        color: '#090d16',
        roughness: 0.6,
        metalness: 0.3,
      }),
      glowCyan: new THREE.MeshBasicMaterial({
        color: '#00d4ff',
      }),
      beaconRed: new THREE.MeshBasicMaterial({
        color: '#ef4444',
      })
    }
  }, [])

  // Tower Geometric Dimensions
  const totalHeight = 48
  const baseRadius = 3.2
  const topRadius = 0.9
  const sectionCount = 12

  // Build Procedural Steel Lattice Sections
  const [legs, braces, platforms, dishes, sectorAntennas] = useMemo(() => {
    const legElements = []
    const braceElements = []
    const platformElements = []
    const dishElements = []
    const antennaElements = []

    const legCorners = [
      [-1, -1],
      [1, -1],
      [1, 1],
      [-1, 1]
    ]

    for (let s = 0; s < sectionCount; s++) {
      const yBottom = (s / sectionCount) * totalHeight
      const yTop = ((s + 1) / sectionCount) * totalHeight
      const rBottom = baseRadius - (s / sectionCount) * (baseRadius - topRadius)
      const rTop = baseRadius - ((s + 1) / sectionCount) * (baseRadius - topRadius)
      const isRedSection = (s >= 3 && s <= 5) || (s >= 9 && s <= 10)
      const mat = isRedSection ? materials.redSteel : materials.whiteSteel

      // 4 Corner Legs
      legCorners.forEach(([cx, cz], i) => {
        const start = new THREE.Vector3(cx * rBottom, yBottom, cz * rBottom)
        const end = new THREE.Vector3(cx * rTop, yTop, cz * rTop)
        const mid = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
        const length = start.distanceTo(end)
        const dir = new THREE.Vector3().subVectors(end, start).normalize()
        const rot = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
        )

        legElements.push({ id: `leg-${s}-${i}`, pos: mid, rot, length, radius: 0.08, mat })
      })

      // Horizontal Ring Struts & Cross X-Bracing
      legCorners.forEach(([cx, cz], i) => {
        const nextCorner = legCorners[(i + 1) % 4]
        const p1 = new THREE.Vector3(cx * rTop, yTop, cz * rTop)
        const p2 = new THREE.Vector3(nextCorner[0] * rTop, yTop, nextCorner[1] * rTop)
        const mid = new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5)
        const length = p1.distanceTo(p2)
        const dir = new THREE.Vector3().subVectors(p2, p1).normalize()
        const rot = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir)
        )

        braceElements.push({ id: `horiz-${s}-${i}`, pos: mid, rot, length, radius: 0.05, mat })

        const p1Bottom = new THREE.Vector3(cx * rBottom, yBottom, cz * rBottom)
        const p2Bottom = new THREE.Vector3(nextCorner[0] * rBottom, yBottom, nextCorner[1] * rBottom)

        const d1Mid = new THREE.Vector3().addVectors(p1Bottom, p2).multiplyScalar(0.5)
        const d1Len = p1Bottom.distanceTo(p2)
        const d1Dir = new THREE.Vector3().subVectors(p2, p1Bottom).normalize()
        const d1Rot = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d1Dir)
        )
        braceElements.push({ id: `diag1-${s}-${i}`, pos: d1Mid, rot: d1Rot, length: d1Len, radius: 0.035, mat })

        const d2Mid = new THREE.Vector3().addVectors(p2Bottom, p1).multiplyScalar(0.5)
        const d2Len = p2Bottom.distanceTo(p1)
        const d2Dir = new THREE.Vector3().subVectors(p1, p2Bottom).normalize()
        const d2Rot = new THREE.Euler().setFromQuaternion(
          new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), d2Dir)
        )
        braceElements.push({ id: `diag2-${s}-${i}`, pos: d2Mid, rot: d2Rot, length: d2Len, radius: 0.035, mat })
      })

      // Physical Platforms
      const platformIndices = [2, 4, 6, 8, 10, 11]
      if (platformIndices.includes(s)) {
        const platY = yTop
        const platRadius = rTop * 1.55
        platformElements.push({
          id: `plat-${s}`,
          y: platY,
          radius: platRadius,
          levelIndex: platformIndices.indexOf(s) + 1
        })
      }
    }

    // Circular Microwave Dishes with Inspection Metadata
    const dishConfigs = [
      { id: "DISH_01", label: "MICROWAVE DISH #01", tag: "FREQ: 11.2 GHz // LINK: PTP 18.4 KM", y: 12.0, angle: 0.3, radius: 1.1, depth: 0.45, offsetR: 2.3 },
      { id: "DISH_02", label: "MICROWAVE DISH #02", tag: "FREQ: 18.0 GHz // LINK: PTP 12.2 KM", y: 15.5, angle: 2.1, radius: 0.85, depth: 0.35, offsetR: 2.0 },
      { id: "DISH_03", label: "MICROWAVE DISH #03", tag: "FREQ: 23.0 GHz // BACKHAUL TRUNK", y: 20.0, angle: 4.2, radius: 1.3, depth: 0.55, offsetR: 1.9 },
      { id: "DISH_04", label: "MICROWAVE DISH #04", tag: "FREQ: 11.0 GHz // CARRIER CO-OP", y: 26.0, angle: 1.2, radius: 0.95, depth: 0.4, offsetR: 1.6 },
      { id: "DISH_05", label: "MICROWAVE DISH #05", tag: "FREQ: 80 GHz E-BAND // 10 Gbps", y: 31.0, angle: 3.5, radius: 1.2, depth: 0.5, offsetR: 1.4 },
      { id: "DISH_06", label: "MICROWAVE DISH #06", tag: "FREQ: 6.0 GHz // LONG-HAUL", y: 36.5, angle: 0.8, radius: 0.75, depth: 0.3, offsetR: 1.2 },
      { id: "DISH_07", label: "MICROWAVE DISH #07", tag: "FREQ: 38.0 GHz // METRO RING", y: 41.0, angle: 2.7, radius: 0.9, depth: 0.38, offsetR: 1.0 },
      { id: "DISH_08", label: "MICROWAVE DISH #08", tag: "FREQ: 70 GHz E-BAND // HYPERSCALE", y: 44.0, angle: 5.1, radius: 0.7, depth: 0.28, offsetR: 0.95 }
    ]

    dishConfigs.forEach((d) => {
      const x = Math.cos(d.angle) * d.offsetR
      const z = Math.sin(d.angle) * d.offsetR
      dishElements.push({
        ...d,
        pos: [x, d.y, z],
        rot: [0, -d.angle + Math.PI / 2, 0.1]
      })
    })

    // Multi-Sector Panel Antennas
    const antennaHeights = [18.0, 28.0, 38.0, 46.0]
    antennaHeights.forEach((h, hIdx) => {
      const radiusAtH = baseRadius - (h / totalHeight) * (baseRadius - topRadius) + 0.6
      const angles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3]
      const sectors = ['ALPHA', 'BETA', 'GAMMA']

      angles.forEach((ang, aIdx) => {
        const x = Math.cos(ang) * radiusAtH
        const z = Math.sin(ang) * radiusAtH
        antennaElements.push({
          id: `SECTOR_${hIdx + 1}_${sectors[aIdx]}`,
          label: `5G MIMO SECTOR ${sectors[aIdx]}`,
          tag: `64T64R // AZIMUTH: ${Math.round(ang * (180 / Math.PI))}° // 5G ACTIVE`,
          pos: [x, h, z],
          rot: [0, -ang + Math.PI / 2, 0]
        })
      })
    })

    return [legElements, braceElements, platformElements, dishElements, antennaElements]
  }, [materials])

  // Continuous 360° Cursor Rotation Physics
  useFrame(({ clock }) => {
    if (!towerGroupRef.current) return
    const t = clock.getElapsedTime()

    const mouseTarget = pointer.x * Math.PI * 1.8
    targetRotationY.current = THREE.MathUtils.lerp(targetRotationY.current, mouseTarget, 0.05)

    towerGroupRef.current.rotation.y = targetRotationY.current

    if (beaconLightRef.current) {
      const pulse = Math.sin(t * 7.5) > 0.3 ? 3.8 : 0.2
      beaconLightRef.current.intensity = pulse
    }
  })

  return (
    <group ref={towerGroupRef} position={[0, -2.0, 0]}>
      
      {/* 1. Corner Legs */}
      {legs.map((leg) => (
        <mesh key={leg.id} position={leg.pos} rotation={leg.rot} material={leg.mat}>
          <cylinderGeometry args={[leg.radius, leg.radius, leg.length, 10]} />
        </mesh>
      ))}

      {/* 2. Horizontal Struts & Cross Braces */}
      {braces.map((brace) => (
        <mesh key={brace.id} position={brace.pos} rotation={brace.rot} material={brace.mat}>
          <cylinderGeometry args={[brace.radius, brace.radius, brace.length, 8]} />
        </mesh>
      ))}

      {/* 3. Central Vertical Climbing Ladder & Cable Run */}
      <mesh position={[0, totalHeight / 2, 0]} material={materials.darkMetal}>
        <boxGeometry args={[0.45, totalHeight, 0.05]} />
      </mesh>
      
      {/* Interactive Vertical OSP Cable Riser */}
      <mesh 
        position={[0.28, totalHeight / 2, 0.28]} 
        material={hoveredItem?.id === 'OSP_RISER' ? materials.whiteSteel : materials.cableBlack}
        onPointerOver={(e) => { e.stopPropagation(); setHoveredItem({ id: 'OSP_RISER', label: 'OSP FIBER RISER', tag: '288F SINGLE-MODE // 0.22 dB/KM' }) }}
        onPointerOut={(e) => { e.stopPropagation(); setHoveredItem(null) }}
      >
        <cylinderGeometry args={[0.08, 0.08, totalHeight, 12]} />
        {hoveredItem?.id === 'OSP_RISER' && (
          <Html position={[0, 0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
            <div className="equipment-inspection-badge">
              <span className="badge-highlight">🔌 OSP FIBER RISER</span>
              <span className="badge-meta">288F SINGLE-MODE // 0.22 dB/KM</span>
            </div>
          </Html>
        )}
      </mesh>

      <mesh position={[-0.28, totalHeight / 2, 0.28]} material={materials.cableBlack}>
        <cylinderGeometry args={[0.06, 0.06, totalHeight, 10]} />
      </mesh>

      {/* 4. Physical Gantry Platforms */}
      {platforms.map((plat) => (
        <group key={plat.id} position={[0, plat.y, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]} material={materials.galvanized}>
            <ringGeometry args={[0.3, plat.radius, 24]} />
          </mesh>
          <mesh position={[0, 0.7, 0]} material={materials.whiteSteel}>
            <cylinderGeometry args={[plat.radius, plat.radius, 0.05, 24]} />
          </mesh>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} material={materials.glowCyan}>
            <ringGeometry args={[plat.radius - 0.08, plat.radius, 32]} />
          </mesh>
        </group>
      ))}

      {/* 5. Microwave Antenna Dishes with Interactive Inspection Tag */}
      {dishes.map((dish) => {
        const isHovered = hoveredItem?.id === dish.id

        return (
          <group 
            key={dish.id} 
            position={dish.pos} 
            rotation={dish.rot}
            onPointerOver={(e) => { e.stopPropagation(); setHoveredItem(dish) }}
            onPointerOut={(e) => { e.stopPropagation(); setHoveredItem(null) }}
          >
            <mesh material={isHovered ? materials.whiteSteel : materials.antennaWhite}>
              <sphereGeometry args={[dish.radius, 20, 20, 0, Math.PI * 2, 0, Math.PI * 0.45]} />
            </mesh>
            <mesh position={[0, 0, dish.depth]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkMetal}>
              <cylinderGeometry args={[0.025, 0.025, dish.depth * 1.6, 8]} />
            </mesh>
            <mesh position={[0, 0, -0.4]} rotation={[Math.PI / 2, 0, 0]} material={materials.galvanized}>
              <cylinderGeometry args={[0.04, 0.04, 0.8, 8]} />
            </mesh>

            {/* Holographic Tooltip Tag on Hover */}
            {isHovered && (
              <Html position={[0, dish.radius + 0.3, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <div className="equipment-inspection-badge">
                  <span className="badge-highlight">⚡ {dish.label}</span>
                  <span className="badge-meta">{dish.tag}</span>
                </div>
              </Html>
            )}
          </group>
        )
      })}

      {/* 6. Multi-Sector Panel Antennas with Interactive Inspection Tag */}
      {sectorAntennas.map((ant) => {
        const isHovered = hoveredItem?.id === ant.id

        return (
          <group 
            key={ant.id} 
            position={ant.pos} 
            rotation={ant.rot}
            onPointerOver={(e) => { e.stopPropagation(); setHoveredItem(ant) }}
            onPointerOut={(e) => { e.stopPropagation(); setHoveredItem(null) }}
          >
            <mesh material={isHovered ? materials.whiteSteel : materials.antennaWhite}>
              <boxGeometry args={[0.3, 1.4, 0.15]} />
            </mesh>
            <mesh position={[0, 0, -0.2]} rotation={[Math.PI / 2, 0, 0]} material={materials.darkMetal}>
              <cylinderGeometry args={[0.03, 0.03, 0.4, 8]} />
            </mesh>

            {isHovered && (
              <Html position={[0, 1.0, 0]} center distanceFactor={14} style={{ pointerEvents: 'none' }}>
                <div className="equipment-inspection-badge">
                  <span className="badge-highlight">📡 {ant.label}</span>
                  <span className="badge-meta">{ant.tag}</span>
                </div>
              </Html>
            )}
          </group>
        )
      })}

      {/* 7. Top Mast & Aviation Obstruction Warning Beacon */}
      <group position={[0, totalHeight, 0]}>
        <mesh position={[0, 2.5, 0]} material={materials.whiteSteel}>
          <cylinderGeometry args={[0.05, 0.15, 5.0, 12]} />
        </mesh>
        <mesh position={[0, 5.5, 0]} material={materials.galvanized}>
          <cylinderGeometry args={[0.01, 0.05, 1.2, 8]} />
        </mesh>
        <mesh position={[0, 4.8, 0]} material={materials.beaconRed}>
          <sphereGeometry args={[0.16, 16, 16]} />
        </mesh>
        <pointLight ref={beaconLightRef} position={[0, 4.8, 0]} color="#ef4444" intensity={3.8} distance={16} />
      </group>

      {/* 8. Concrete Foundation Base */}
      <mesh position={[0, -0.4, 0]} material={materials.darkMetal}>
        <cylinderGeometry args={[baseRadius * 1.2, baseRadius * 1.4, 0.8, 8]} />
      </mesh>

    </group>
  )
}
