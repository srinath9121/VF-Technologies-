import { useEffect, useRef } from 'react'
import gsap from 'gsap'

export const STORY_CHAPTERS = [
  {
    id: "inception",
    menuId: "about",
    num: "01",
    label: "■ FUTURE // INCEPTION",
    headline: "WE ENGINEER THE DIGITAL ARTERIES OF TELECOM INFRASTRUCTURE",
    description: "For over a decade, VF Technologies has pioneered carrier-grade Outside Plant (OSP) fiber optic networks, connecting millions of endpoints across metropolitan corridors and rural landscapes.",
    telemetry: "CORE: 288F_OPTICAL // LOSS: 0.22_dB/KM // NESC_TIER: 1.0",
    tags: ["Outside Plant", "Fiber Optic Networks", "Subsurface SUE"]
  },
  {
    id: "osp-fiber",
    menuId: "engineering",
    num: "02",
    label: "■ INNOVATION // OSP FIBER",
    headline: "HIGH-DENSITY AERIAL & UNDERGROUND FIBER HIGHWAYS",
    description: "Precision route planning, directional bore (HDD) alignments, micro-trench engineering, and splice schematics engineered to minimize civil disruption and maximize long-term optical throughput.",
    telemetry: "FIBER_COUNT: 432F // CONDUIT: 4_WAY_MICRO // ROUTE_LEN: 145_KM",
    tags: ["Micro-Trenching", "Directional Bore (HDD)", "Splice Architecture"]
  },
  {
    id: "permitting",
    menuId: "engineering",
    num: "03",
    label: "■ COLLABORATION // CAD & PERMITS",
    headline: "CONSTRUCTIBLE PLAN-AND-PROFILE PERMITTING PACKAGES",
    description: "Seamless jurisdictional approvals across State DOTs, railroad crossings, environmental protection corridors, and municipal rights-of-way designed for rapid field deployment.",
    telemetry: "JURISDICTION: STATE_DOT // ROW_CLEARANCE: 60_FT // SCALE: 1:20",
    tags: ["DOT ROW Approvals", "Railroad Crossings", "Subsurface Interference"]
  },
  {
    id: "topology",
    menuId: "engineering",
    num: "04",
    label: "■ EXCELLENCE // DENSE WDM",
    headline: "RESILIENT OPTICAL NETWORK TOPOLOGY & ROUTING",
    description: "Dense Wavelength Division Multiplexing (DWDM), Fiber Distribution Hub (FDH) placement, and auto-failover ring architectures delivering 99.999% carrier uptime.",
    telemetry: "TOPOLOGY: DENSE_WDM // SPLIT_RATIO: 1:32 // RING_LATENCY: <0.5ms",
    tags: ["XGS-PON 10G", "Dense WDM", "Central Office Termination"]
  },
  {
    id: "structural",
    menuId: "engineering",
    num: "05",
    label: "■ PURPOSE // POLE LOADING",
    headline: "FINITE ELEMENT STRUCTURAL STRESS & NESC COMPLIANCE",
    description: "Advanced finite-element pole modeling under extreme heavy wind, ice, and span tension loading. Full Make-Ready Engineering (MRE) remediations for utility attachments.",
    telemetry: "POLE_CLASS: CLASS_2_45FT // WIND_LOAD: 90_MPH // SAFETY_FACTOR: 1.67",
    tags: ["O-Calc Pro", "SPIDAcalc", "Make-Ready Engineering"]
  },
  {
    id: "clients",
    menuId: "clients",
    num: "06",
    label: "■ LEGACY // CARRIER TRUST",
    headline: "TRUSTED BY TIER-1 TELECOM OPERATORS NATIONWIDE",
    description: "Delivering engineering excellence to national telecom providers, regional fiber cooperatives, smart municipalities, and hyperscale data center interconnect corridors.",
    telemetry: "SATISFACTION: 99.8% // PROJECTS: 450+ // FIELD_AUDITS: 25,000+",
    tags: ["Tier-1 Carriers", "Fiber Co-Ops", "Hyperscale Interconnect"]
  },
  {
    id: "careers",
    menuId: "careers",
    num: "07",
    label: "■ CULTURE // TEAM & CAREERS",
    headline: "JOIN THE NEXT GENERATION OF INFRASTRUCTURE PIONEERS",
    description: "We are empowering CAD engineers, GIS specialists, structural analysts, and field coordinators to shape the physical fabric of global digital connectivity.",
    telemetry: "POSITIONS: OPEN // WORK_MODE: HYBRID // LOCATION: GLOBAL",
    tags: ["GIS Specialists", "OSP Engineers", "Structural Analysts"]
  },
  {
    id: "contact",
    menuId: "contact",
    num: "08",
    label: "■ TERMINAL // CONSULTATION",
    headline: "ACCELERATE YOUR TELECOM INFRASTRUCTURE DEPLOYMENT",
    description: "Partner with our dedicated team of outside plant engineers, CAD draftsmen, and structural specialists for your next fiber expansion program.",
    telemetry: "STATUS: ACTIVE // RESPONSE_TIME: <2_HOURS // SECURE_LINE",
    tags: ["Project Scoping", "Route Feasibility", "Emergency MRE"]
  }
]

export default function HorizontalStory({ activeIndex, scrollToChapter }) {
  const storyTrackRef = useRef(null)

  return (
    <div className="horizontal-story-wrapper">
      <div className="horizontal-story-track" ref={storyTrackRef}>
        {STORY_CHAPTERS.map((ch, idx) => (
          <section
            key={ch.id}
            id={ch.id}
            className={`horizontal-story-panel ${idx === activeIndex ? 'is-active-panel' : ''}`}
          >
            <div className="story-panel-inner">
              
              {/* Bottom-Center Bold Typography Section (Matching Reference Layout) */}
              <div className="story-center-card">
                
                {/* Chapter Tagline */}
                <div className="story-chapter-label">{ch.label}</div>

                {/* Master Uppercase Bold Heading */}
                <h1 className="story-main-headline">{ch.headline}</h1>

                {/* Subtitle Description */}
                <p className="story-subtitle-desc">{ch.description}</p>

                {/* Tags and Deliverables */}
                <div className="story-tags-row">
                  {ch.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="story-tag-pill">{tag}</span>
                  ))}
                </div>

                {/* Bottom Technical Telemetry Badge */}
                <div className="story-telemetry-badge">
                  <span className="telemetry-pulse-dot">⚡</span>
                  <code>{ch.telemetry}</code>
                </div>

                {/* Quick Consultation CTA for Contact Chapter */}
                {ch.id === 'contact' && (
                  <div className="contact-cta-wrapper">
                    <a href="mailto:info@vf-technologies.com" className="primary-cta-button">
                      INITIATE CONSULTATION ➔
                    </a>
                  </div>
                )}
              </div>

            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
