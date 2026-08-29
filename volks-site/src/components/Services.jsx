import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { services } from '../content'
import Service3DStage from './Service3DStage'

const ospLogos = [
  { name: "AutoCAD", url: "https://volksresources.com/assets/images/services/logo/logo-AutoCAD.jpg" },
  { name: "3GIS", url: "https://volksresources.com/assets/images/services/logo/logo-3GIS.jpg" },
  { name: "Aramis", url: "https://volksresources.com/assets/images/services/logo/logo-Aramis.jpg" },
  { name: "Frogs", url: "https://volksresources.com/assets/images/services/logo/logo-Frogs.jpg" },
  { name: "MicroStation", url: "https://volksresources.com/assets/images/services/logo/logo-MicroStation.jpg" }
]

export default function Services() {
  const triggerRef = useRef(null)
  const pinWrapRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    if (!triggerRef.current || !pinWrapRef.current) return

    const cards = pinWrapRef.current.querySelectorAll('.service-stage-card')

    // Create a GSAP ScrollTrigger Pinned Scrub Timeline
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: triggerRef.current,
        start: 'top top',
        end: '+=250%',
        pin: pinWrapRef.current,
        scrub: 0.8, // Smooth scrub
        onUpdate: (self) => {
          setScrollProgress(self.progress)
        }
      }
    })

    // Scrub card transitions:
    // Card 0 active: 0 -> 0.33
    // Card 1 active: 0.33 -> 0.66
    // Card 2 active: 0.66 -> 1.0

    // Initial state: Card 0 is visible, 1 and 2 are below
    gsap.set(cards[0], { opacity: 1, y: 0 })
    gsap.set(cards[1], { opacity: 0, y: 80 })
    gsap.set(cards[2], { opacity: 0, y: 80 })

    tl.to(cards[0], { opacity: 0, y: -60, duration: 1 }, 1)
      .to(cards[1], { opacity: 1, y: 0, duration: 1 }, 1)
      .to(cards[1], { opacity: 0, y: -60, duration: 1 }, 2.5)
      .to(cards[2], { opacity: 1, y: 0, duration: 1 }, 2.5)

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach(st => {
        if (st.trigger === triggerRef.current) st.kill()
      })
    }
  }, [])

  return (
    <section className="services-pinned-section" id="services" ref={triggerRef}>
      <div className="services-pinned-wrap" ref={pinWrapRef}>
        
        {/* Section Header */}
        <div className="services-pinned-header">
          <span className="section-label">Core Capabilities</span>
          <h2 className="section-title">
            Engineering & <span className="gradient-text">Infrastructure</span>
          </h2>
        </div>

        <div className="services-stage-grid">
          {/* Left Column: Interactive 3D WebGL Pinned Model */}
          <div className="services-stage-3d-col">
            <div className="service-stage-canvas-card">
              <div className="stage-tech-header">
                <span className="stage-mode-tag">
                  {scrollProgress < 0.33 ? '🛰️ WIRELESS_ARRAY_V1' : scrollProgress < 0.66 ? '⚡ OSP_CONDUIT_GRID' : '🖧 DATACENTER_RACKS'}
                </span>
                <span className="stage-phase-counter">
                  PHASE 0{scrollProgress < 0.33 ? '1' : scrollProgress < 0.66 ? '2' : '3'} / 03
                </span>
              </div>
              
              <Service3DStage progress={scrollProgress} />

              <div className="stage-scrub-bar">
                <div
                  className="stage-scrub-fill"
                  style={{ width: `${Math.min(100, Math.max(0, scrollProgress * 100))}%` }}
                />
              </div>
            </div>
          </div>

          {/* Right Column: Scrubbed HTML Content Cards */}
          <div className="services-stage-content-col">
            {services.map((svc, i) => (
              <div className={`service-stage-card card-index-${i}`} key={i}>
                <div className="service-card-tagline">SPECIALIZATION 0{i + 1}</div>
                <h3>
                  <img src={svc.icon} alt="" />
                  {svc.title}
                </h3>
                <p>{svc.description}</p>
                
                {svc.subsections && (
                  <>
                    <div className="service-tags">
                      {svc.subsections.map((sub, j) => (
                        <span className="service-tag" key={j}>{sub}</span>
                      ))}
                    </div>
                    <div className="osp-tools-wrap">
                      <span className="osp-tools-label">Drafting & Design Platforms:</span>
                      <div className="osp-tools-grid">
                        {ospLogos.map((tool, k) => (
                          <div className="osp-tool-logo" key={k} title={tool.name}>
                            <img src={tool.url} alt={tool.name} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
