import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animate, onScroll } from 'animejs'

gsap.registerPlugin(ScrollTrigger)

// The 6 full service chapters in the story
const activeChapters = [
  {
    id: "osp-fiber",
    chapterNum: "01",
    label: "CHAPTER 01 // OSP FIBER INFRASTRUCTURE",
    title: "Outside Plant (OSP) Fiber Engineering",
    description: "End-to-end aerial, buried, and micro-trenched fiber optic route engineering. We transform spatial feasibility data into constructible, high-density fiber networks connecting thousands of endpoints.",
    specs: [
      "Subsurface Utility Engineering (SUE) & Depth Profiling",
      "Directional Bore (HDD) & Micro-trench Alignment",
      "Aerial Strand Tension & NESC Ground Clearance Audits",
      "Fiber Splice Allocation & Optical Link Budgets"
    ],
    tools: ["AutoCAD Civil 3D", "3GIS", "ArcGIS Enterprise", "QGIS"],
    telemetry: "FIBER_COUNT: 288F // CORE_TYPE: G.652.D // ATTENUATION: 0.22_dB/KM"
  },
  {
    id: "permitting-engineering",
    chapterNum: "02",
    label: "CHAPTER 02 // BLUEPRINT & PERMITTING",
    title: "Permitting & Engineering Workspace",
    description: "Constructible plan-and-profile drafting, right-of-way easement documentation, and jurisdictional agency coordination. Engineered to ensure rapid municipal and utility approvals.",
    specs: [
      "DOT Right-of-Way (ROW) Permit Application Sets",
      "Railroad, River & Highway Crossing Alignments",
      "Joint-Trench Profiles & Subsurface Interference Plans",
      "Environmental, Stormwater & Historical Clearance Sets"
    ],
    tools: ["AutoCAD Civil 3D", "MicroStation", "Bluebeam Revu", "GIS Hub"],
    telemetry: "ROW_WIDTH: 60_FT // PROFILE_SCALE: 1:20 // JURISDICTION: STATE_DOT"
  },
  {
    id: "network-planning",
    chapterNum: "03",
    label: "CHAPTER 03 // NETWORK TOPOLOGY & ARCHITECTURE",
    title: "Network Planning & Design Topology",
    description: "High-capacity network topology design, fiber distribution hubs (FDH), optical split ratios, and diverse redundancy rings engineered for carrier-grade resilience.",
    specs: [
      "PON, GPON & 10G XGS-PON Optical Distribution",
      "Central Office (CO) & Primary Node Termination Hubs",
      "Redundant Ring Topology & Auto-Failover Diversity",
      "Dynamic Optical Link Loss Budget Calculations"
    ],
    tools: ["3GIS", "OSPInsight", "SpatialNet", "ArcGIS Field Maps"],
    telemetry: "TOPOLOGY: DENSE_WDM // SPLIT_RATIO: 1:32 // RING_LATENCY: <0.5ms"
  },
  {
    id: "pole-loading",
    chapterNum: "04",
    label: "CHAPTER 04 // STRUCTURAL & LOAD ANALYSIS",
    title: "Pole Loading & Structural Analysis",
    description: "Finite-element structural pole modeling under extreme wind, ice, and tension loading. We verify structural capacity, design guying systems, and generate Make-Ready Engineering (MRE) packages.",
    specs: [
      "NESC Heavy, Medium & Light Wind/Ice Loading Calculations",
      "O-Calc Pro & SPIDAcalc Structural Pole Simulations",
      "Guying, Anchoring & Span Tension Stress Analysis",
      "Make-Ready Engineering (MRE) Utility Remediation Plans"
    ],
    tools: ["O-Calc Pro", "SPIDAcalc", "Katapult Pro", "Quick Pole"],
    telemetry: "POLE_CLASS: CLASS_2_45FT // WIND_LOAD: 90_MPH // NESC_SAFETY: 1.67"
  },
  {
    id: "traffic-control",
    chapterNum: "05",
    label: "CHAPTER 05 // WORK ZONE & TRAFFIC SAFETY",
    title: "Permitting & Traffic Control (TTC) Plans",
    description: "Temporary Traffic Control (TTC) engineering designed to strict MUTCD standards. We engineer multi-phase lane closures, detours, and pedestrian pathways to ensure work-zone safety.",
    specs: [
      "MUTCD Compliant Lane & Shoulder Closure Plans",
      "Multi-Phase Maintenance of Traffic (MOT) Staging",
      "Pedestrian Access & ADA Compliant Bypass Corridors",
      "State DOT & Municipal Right-of-Way Approvals"
    ],
    tools: ["RapidPlan", "AutoCAD", "SignCAD", "DOT Portal"],
    telemetry: "SPEED_ZONE: 45_MPH // TAPER_LEN: 540_FT // CONE_SPACING: 20_FT"
  },
  {
    id: "app-design",
    chapterNum: "06",
    label: "CHAPTER 06 // DIGITAL WORKFLOWS & FIELD APPS",
    title: "Field App & Automation Design",
    description: "Custom digital field collection apps, real-time audit dashboards, and GIS automation platforms connecting field construction crews directly to engineering teams.",
    specs: [
      "Custom GIS Field Audit & Redline Capture Forms",
      "Automated Make-Ready & Attachment Workflows",
      "Real-Time Project Milestone Telemetry Dashboards",
      "Cloud-Synchronized Field-to-Office Engineering Pipeline"
    ],
    tools: ["React", "React Native", "Mapbox GL", "ArcGIS Field Maps"],
    telemetry: "SYNC_LATENCY: <100ms // AUDIT_ACCURACY: 99.8% // PLATFORM: HYBRID_CLOUD"
  }
]

export default function Services() {
  const containerRef = useRef(null)
  const pinWrapRef = useRef(null)
  const [activeChapterIdx, setActiveChapterIdx] = useState(0)
  const [scrollPct, setScrollPct] = useState(0)
  const [syncState, setSyncState] = useState('CALIBRATING') // 'CALIBRATING' | 'SYNCHRONIZED'

  // 1. Primary GSAP + ScrollTrigger Timeline (Master Choreography & 3D Dispatch)
  useEffect(() => {
    if (!containerRef.current || !pinWrapRef.current) return

    const cards = pinWrapRef.current.querySelectorAll('.story-chapter-card')
    const total = activeChapters.length

    cards.forEach((card, i) => {
      gsap.set(card, {
        opacity: i === 0 ? 1 : 0,
        y: i === 0 ? 0 : 30,
        pointerEvents: i === 0 ? 'auto' : 'none'
      })
    })

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top top',
        end: `+=${total * 120}%`,
        pin: pinWrapRef.current,
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress
          setScrollPct(Math.round(progress * 100))

          // Dispatch progress to 3D MainScene
          window.dispatchEvent(new CustomEvent('update-scene-progress', { detail: progress }))

          const currentIdx = Math.min(total - 1, Math.max(0, Math.floor(progress * total)))
          setActiveChapterIdx(currentIdx)
        }
      }
    })

    cards.forEach((card, idx) => {
      if (idx < total - 1) {
        const nextCard = cards[idx + 1]
        const stepTime = (idx + 1) * 2

        tl.to(card, { opacity: 0, y: -25, pointerEvents: 'none', duration: 0.8 }, stepTime - 0.4)
          .to(nextCard, { opacity: 1, y: 0, pointerEvents: 'auto', duration: 0.8 }, stepTime)
      }
    })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === containerRef.current) st.kill()
      })
    }
  }, [])

  // 2. Anime.js onScroll Synchronization Milestone Observer (Secondary System)
  useEffect(() => {
    if (!containerRef.current) return

    let animeInstance = null
    try {
      const reticleElement = containerRef.current.querySelector('.focal-reticle-border')
      if (reticleElement) {
        animeInstance = animate(reticleElement, {
          borderColor: ['rgba(56, 189, 248, 0.25)', 'rgba(0, 255, 170, 0.6)'],
          ease: 'linear',
          autoplay: onScroll({
            target: containerRef.current,
            enter: 'top top',
            leave: 'bottom bottom',
            sync: 0.5,
            onSyncComplete: () => {
              setSyncState('SYNCHRONIZED')
            }
          })
        })
      }
    } catch (err) {
      console.warn('Anime.js scroll observer initialized safely:', err)
    }

    return () => {
      if (animeInstance && typeof animeInstance.pause === 'function') {
        animeInstance.pause()
      }
    }
  }, [])

  return (
    <section className="services-pinned-container" id="services" ref={containerRef}>
      <div className="services-pinned-viewport" ref={pinWrapRef}>
        
        {/* Top Story Chapter Ribbon & Navigation */}
        <div className="services-top-bar">
          <div className="services-chapter-nav">
            {activeChapters.map((ch, i) => (
              <div
                key={ch.id}
                className={`chapter-nav-item ${i === activeChapterIdx ? 'active' : i < activeChapterIdx ? 'completed' : ''}`}
              >
                <span className="nav-num">{ch.chapterNum}</span>
                <span className="nav-title">{ch.id.replace('-', ' ').toUpperCase()}</span>
              </div>
            ))}
          </div>

          <div className="telemetry-readout">
            <span className="telemetry-label">SCROLL_PROGRESS:</span>
            <span className="telemetry-pct">{scrollPct}%</span>
            <div className="telemetry-bar-mini">
              <div className="bar-fill" style={{ width: `${scrollPct}%` }}></div>
            </div>
          </div>
        </div>

        <div className="services-stage-split">
          {/* Left Column: Interactive Story Chapter Card */}
          <div className="services-card-stack">
            {activeChapters.map((chapter, idx) => (
              <div
                className={`service-chapter-card story-chapter-card ${idx === activeChapterIdx ? 'is-active' : ''}`}
                key={chapter.id}
              >
                <div className="chapter-tagline">{chapter.label}</div>
                <h2 className="chapter-title">{chapter.title}</h2>
                <p className="chapter-desc">{chapter.description}</p>

                {/* Technical Specifications Grid */}
                <div className="chapter-capabilities">
                  <span className="capabilities-heading">Core Engineering Deliverables:</span>
                  <div className="capabilities-grid">
                    {chapter.specs.map((spec, j) => (
                      <div className="capability-pill" key={j}>
                        <span className="pill-dot">✦</span>
                        <span>{spec}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Engineering Telemetry Readout with Anime.js Sync Indicator */}
                <div className="osp-telemetry-badge">
                  <span className="telemetry-icon">⚡</span>
                  <code>{chapter.telemetry}</code>
                  <span className={`anime-sync-chip ${syncState === 'SYNCHRONIZED' ? 'synced' : ''}`}>
                    {syncState === 'SYNCHRONIZED' ? '● SYNC_LOCKED' : '○ OBSERVING'}
                  </span>
                </div>

                {/* Software Badges */}
                <div className="chapter-platforms">
                  <span className="platforms-heading">Engineering & CAD Platforms:</span>
                  <div className="tools-badge-row">
                    {chapter.tools.map((tool, k) => (
                      <span className="tool-chip" key={k}>{tool}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column: Transparent 3D Reticle Overlaying Live 3D Scene */}
          <div className="services-3d-focal-zone">
            <div className="focal-reticle-border">
              <div className="corner corner-tl"></div>
              <div className="corner corner-tr"></div>
              <div className="corner corner-bl"></div>
              <div className="corner corner-br"></div>
              
              <div className="focal-center-crosshair">
                <span className="crosshair-h"></span>
                <span className="crosshair-v"></span>
              </div>

              <div className="focal-status-label">
                <span>CHAPTER_0{activeChapterIdx + 1}_3D_TELEMETRY</span>
                <span className="telemetry-live">● BIDIRECTIONAL_SCRUB</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
