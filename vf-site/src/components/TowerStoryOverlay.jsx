import { useRef } from 'react'

export const TOWER_CHAPTERS = [
  {
    id: "hero",
    bandNum: "00",
    name: "TOWER OVERVIEW",
    title: "VF TECHNOLOGIES",
    align: "center"
  },
  {
    id: "about",
    bandNum: "01",
    name: "ABOUT VF TECHNOLOGIES",
    title: "ENGINEERED PRECISION & LEGACY",
    subtitle: "Turnkey Outside Plant (OSP) Engineering & Consulting",
    description: "We partner with utility providers, telecom carriers, and smart municipalities to engineer future-proof infrastructure, combining precision CAD modeling, strategic route design, and state-of-the-art field analysis.",
    align: "left",
    meta: "BAND_01 // ELEVATION: +6.0M // GANTRY_PLATFORM",
    items: ["20+ Years Telecom Experience", "Turnkey Fiber Engineering", "Precision CAD & GIS Modeling", "Field & Structural Analytics"]
  },
  {
    id: "services",
    bandNum: "02",
    name: "SERVICES & ENGINEERING",
    title: "END-TO-END INFRASTRUCTURE CAPABILITIES",
    subtitle: "From Subsurface Feasibility to Pole Load Certification",
    description: "Our multidisciplinary engineering teams deliver constructible plan-and-profile sets, NESC-compliant structural pole calculations, and real-time field data capture.",
    align: "right",
    meta: "BAND_02 // ELEVATION: +14.0M // SECTOR_ARRAY",
    items: ["OSP Fiber Route Engineering", "DOT & Municipal Permitting", "O-Calc / SPIDAcalc Pole Loading", "MUTCD Traffic Control Plans"]
  },
  {
    id: "clients",
    bandNum: "03",
    name: "CLIENTS & TRUST MATRIX",
    title: "TRUSTED BY TIER-1 OPERATORS NATIONWIDE",
    subtitle: "Carrier-Grade Reliability Across Critical Corridors",
    description: "Delivering engineering excellence to national telecom providers, regional fiber cooperatives, and hyperscale data center interconnect programs with a 99.8% first-pass approval rating.",
    align: "left",
    meta: "BAND_03 // ELEVATION: +22.0M // CARRIER_MOUNT",
    items: ["250+ Capital Projects Delivered", "150+ Enterprise Clients", "99.8% First-Pass Permit Rate", "Tier-1 Carrier Audits"]
  },
  {
    id: "careers",
    bandNum: "04",
    name: "TEAM & CAREERS",
    title: "SHAPING THE FUTURE OF CONNECTIVITY",
    subtitle: "Empowering Engineers, GIS Specialists & Analysts",
    description: "Join a high-performance culture that values technical rigor, mentorship, and work-life balance. We provide advanced training in 3GIS, SPIDAcalc, and AutoCAD Civil 3D.",
    align: "right",
    meta: "BAND_04 // ELEVATION: +30.0M // REST_PLATFORM",
    items: ["OSP Fiber Design Engineers", "GIS & Spatial Specialists", "Structural Pole Loading Analysts", "CAD Draftsmen (Civil 3D)"]
  },
  {
    id: "technology",
    bandNum: "05",
    name: "SIGNATURE FIBER PATH",
    title: "OPTICAL DATA TRANSMISSION",
    subtitle: "Entering the Cable Spine → Dense WDM Network",
    description: "Watch the vertical tower conduit expand as the camera enters the single-mode optical core. Luminous data packets travel at light speed, branching into dense multi-node network topologies.",
    align: "center",
    meta: "BAND_05 // ELEVATION: +38.0M // FIBER_CORE_PLUNGE",
    items: ["G.652.D Single-Mode Core", "Dense WDM Optical Ring", "10G XGS-PON Distribution", "<0.22 dB/KM Attenuation"]
  },
  {
    id: "contact",
    bandNum: "06",
    name: "CONSULTATION TERMINAL",
    title: "LAUNCH YOUR INFRASTRUCTURE PROGRAM",
    subtitle: "Direct Access to Senior Engineering Leadership",
    description: "Partner with our dedicated team of outside plant engineers, CAD draftsmen, and structural specialists for your next fiber expansion or pole audit program.",
    align: "left",
    meta: "BAND_06 // ELEVATION: +48.0M // TOP_BEACON",
    items: ["Rapid Scoping & Feasibility", "Emergency Make-Ready Audits", "Full Turnkey Permitting", "Direct Engineering Hotlines"]
  }
]

export default function TowerStoryOverlay({ activeIndex, scrollToChapter }) {
  const currentChapter = TOWER_CHAPTERS[activeIndex] || TOWER_CHAPTERS[0]

  return (
    <div className="tower-story-overlay-container">
      {TOWER_CHAPTERS.map((ch, idx) => {
        const isActive = idx === activeIndex
        const isHero = ch.id === 'hero'

        return (
          <div
            key={ch.id}
            className={`tower-chapter-screen ${isActive ? 'is-active-chapter' : ''} align-${ch.align}`}
          >
            <div className={`tower-editorial-card ${isHero ? 'hero-clean-card' : ''}`}>
              
              {/* Hero Official Logo Presentation */}
              {isHero && (
                <div className="hero-logo-emblem-wrapper">
                  <div className="hero-logo-ring">
                    <img src="/vf-logo.png" alt="Venkateswara Fiber Technologies" className="hero-official-logo" />
                  </div>
                </div>
              )}

              {/* Monospace Metadata Tag (Only on regular chapters) */}
              {!isHero && ch.meta && (
                <div className="chapter-meta-line">
                  <span className="chapter-badge">BAND {ch.bandNum}</span>
                  <span className="chapter-meta-text">{ch.meta}</span>
                </div>
              )}

              {/* Master Headline */}
              <h1 className="chapter-editorial-title">{ch.title}</h1>

              {/* Subtitle & Description (Only on regular chapters) */}
              {!isHero && ch.subtitle && (
                <h2 className="chapter-editorial-sub">{ch.subtitle}</h2>
              )}

              {!isHero && ch.description && (
                <p className="chapter-editorial-desc">{ch.description}</p>
              )}

              {/* Key Deliverables / Specs (Only on regular chapters) */}
              {!isHero && ch.items && (
                <div className="chapter-specs-grid">
                  {ch.items.map((item, i) => (
                    <div key={i} className="spec-item-pill">
                      <span className="spec-dot">✦</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Hero Action Prompt */}
              {isHero && (
                <div className="hero-scroll-prompt-btn" onClick={() => scrollToChapter(1)}>
                  <span>EXPLORE ABOUT VF TECHNOLOGIES</span>
                  <span className="prompt-arrow">➔</span>
                </div>
              )}

              {/* CTA for Contact Band */}
              {ch.id === 'contact' && (
                <div className="contact-action-wrapper">
                  <a href="mailto:info@vf-technologies.com" className="tower-cta-button">
                    SCHEDULE CONSULTATION ➔
                  </a>
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
