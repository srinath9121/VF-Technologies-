import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { about } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // 1. Scrubbed progressive lighting of the main statement
      const statementWords = sectionRef.current.querySelectorAll('.story-word')
      gsap.fromTo(statementWords,
        { opacity: 0.2, color: '#475569' },
        {
          opacity: 1,
          color: '#ffffff',
          stagger: 0.05,
          scrollTrigger: {
            trigger: '.about-statement-box',
            start: 'top 75%',
            end: 'bottom 45%',
            scrub: 0.8
          }
        }
      )

      // 2. Cinematic cards slide & fade in
      gsap.fromTo('.about-pillar-card',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.about-pillars-grid',
            start: 'top 82%'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const headingWords = about.heading.split(' ')

  return (
    <section className="about-cinematic section" id="about" ref={sectionRef}>
      <div className="about-cinematic-container">
        
        {/* Section Header */}
        <div className="about-story-header">
          <div className="story-pill">
            <span className="pill-pulse"></span>
            <span>CHAPTER 00 // ORIGIN & MISSION</span>
          </div>
          <span className="chapter-index">00 / ABOUT</span>
        </div>

        {/* Big Progressive Scrubbing Statement */}
        <div className="about-statement-box">
          <h2 className="about-statement-text">
            {headingWords.map((word, i) => (
              <span className="story-word" key={i} style={{ display: 'inline-block', marginRight: '0.28em' }}>{word}</span>
            ))}
          </h2>
          <p className="about-statement-sub">
            {about.mission}
          </p>
        </div>

        {/* Visual Engineering Pillars Grid */}
        <div className="about-pillars-grid">
          <div className="about-pillar-card photo-card">
            <div className="card-image-wrap">
              <img src={about.images[0]} alt="VF Technologies Engineering" />
              <div className="image-overlay-hud">
                <span className="hud-badge">FIELD_OPERATIONS</span>
                <span className="hud-coords">37.7749° N, 122.4194° W</span>
              </div>
            </div>
            <div className="card-caption">
              <h3>Field-Proven Precision</h3>
              <p>{about.paragraphs[1]}</p>
            </div>
          </div>

          <div className="about-pillar-card spec-card">
            <div className="spec-card-header">
              <div className="spec-icon">⚡</div>
              <div>
                <span className="spec-tag">CORE METHODOLOGY</span>
                <h3>Engineering Standards</h3>
              </div>
            </div>
            <p className="spec-body">{about.paragraphs[2]}</p>
            
            <div className="spec-tags-list">
              {about.values.map((v, i) => (
                <div className="spec-tag-item" key={i}>
                  <span className="tag-check">✔</span>
                  <span>{v.name}</span>
                </div>
              ))}
            </div>

            <div className="spec-card-footer">
              <span className="footer-status">● VERIFIED_CAD_WORKFLOWS</span>
              <a href="#services" className="footer-link">Explore OSP Fiber Chapter ↘</a>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
