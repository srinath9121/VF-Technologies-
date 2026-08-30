import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { leadership, careers } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Careers() {
  const sectionRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // 1. Header entrance
      gsap.fromTo('.careers-story-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.careers-story-header',
            start: 'top 85%'
          }
        }
      )

      // 2. Team portraits parallax stagger
      gsap.fromTo('.team-portrait-card',
        { opacity: 0, y: 60, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.careers-team-grid',
            start: 'top 80%'
          }
        }
      )

      // 3. Careers CTA Banner entrance
      gsap.fromTo('.careers-cta-banner',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.careers-cta-banner',
            start: 'top 85%'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="careers-team-section section" id="careers" ref={sectionRef}>
      <div className="careers-team-container">
        
        {/* Story Section Ribbon */}
        <div className="careers-story-header">
          <div className="story-pill">
            <span className="pill-pulse"></span>
            <span>CHAPTER 08 // THE HUMAN CORE & CAREERS</span>
          </div>
          
          <h2 className="careers-main-heading">
            {careers.heading || "Build What's Next With Us."}
          </h2>
          
          <p className="careers-main-subtitle">
            {careers.subtitle || "Join a multidisciplinary team of fiber engineers, CAD designers, structural analysts, and software developers shaping next-generation connectivity."}
          </p>
        </div>

        {/* Cinematic Team Leadership Grid */}
        <div className="careers-team-grid">
          {leadership.map((member, idx) => (
            <div className="team-portrait-card" key={idx}>
              <div className="portrait-image-wrapper">
                <img src={member.image} alt={member.name} className="portrait-img" />
                <div className="portrait-gradient-overlay"></div>
                <div className="portrait-hud-tag">
                  <span>LEADERSHIP // 0{idx + 1}</span>
                </div>
              </div>
              
              <div className="portrait-meta-content">
                <h3 className="member-name">{member.name}</h3>
                <span className="member-title">{member.title}</span>
                <p className="member-bio">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Opportunity & Recruitment CTA Banner */}
        <div className="careers-cta-banner">
          <div className="cta-banner-content">
            <div className="cta-left">
              <span className="cta-tag">OPEN CAREER PATHWAYS</span>
              <h3>Ready to Shape National Infrastructure?</h3>
              <p>{careers.cta}</p>
            </div>
            <div className="cta-right">
              <a href="#contact" className="btn-primary-teal btn-careers">
                Explore Open Positions ↗
              </a>
            </div>
          </div>
        </div>

        {/* Transition Bridge toward Contact Terminal */}
        <div className="careers-contact-bridge">
          <span className="bridge-tag">NEXT // DIRECT ENGINEERING CONSULTATION & CONTACT</span>
          <div className="bridge-line"></div>
        </div>

      </div>
    </section>
  )
}
