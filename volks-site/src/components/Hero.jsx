import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { animate, onScroll } from 'animejs'
import { hero } from '../content'

export default function Hero() {
  const contentRef = useRef()
  const sectionRef = useRef()

  useEffect(() => {
    // GSAP entrance animation
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } })
      tl.fromTo('.hero-tagline', { opacity: 0, y: 30, letterSpacing: '0.6em' }, { opacity: 1, y: 0, letterSpacing: '0.3em', duration: 1.2, delay: 0.2 })
        .fromTo('.hero-headline', { opacity: 0, scale: 0.92, y: 40 }, { opacity: 1, scale: 1, y: 0, duration: 1.4 }, '-=0.8')
        .fromTo('.hero-subtitle', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, '-=0.8')
        .fromTo('.hero-cta-group', { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1 }, '-=0.7')
    }, contentRef)

    // anime.js onScroll: Sync hero content opacity and Y to scroll
    animate('.hero-content', {
      opacity: [1, 0],
      translateY: ['0px', '-100px'],
      scale: [1, 0.95],
      ease: 'linear',
      autoplay: onScroll({
        target: sectionRef.current,
        enter: 'top top',
        leave: 'bottom top',
        sync: true,
      })
    })

    // Scroll indicator animation
    animate('.hero-scroll-indicator', {
      opacity: [1, 0],
      ease: 'linear',
      autoplay: onScroll({
        target: sectionRef.current,
        enter: 'top top',
        leave: 'center top',
        sync: true,
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <section className="hero section" id="hero" ref={sectionRef}>
      <div className="hero-content" ref={contentRef}>
        <div className="hero-badge-wrap">
          <span className="cyber-pill">⚡ TELECOM & UTILITY INFRASTRUCTURE</span>
        </div>

        <p className="hero-tagline">{hero.tagline}</p>
        
        <h1 className="hero-headline">
          Empowering Smarter Cities with{' '}
          <span className="gradient-text neon-glow">Seamless Connectivity</span>
        </h1>
        
        <p className="hero-subtitle">{hero.subtitle}</p>

        <div className="hero-cta-group">
          <a href="#services" className="btn-primary glow-btn">
            <span>Explore Services</span>
          </a>
          <a href="#contact" className="btn-outline cyber-btn">
            <span>Contact Us</span>
          </a>
        </div>
      </div>

      <div className="hero-scroll-indicator">
        <span>SCROLL TO EXPLORE</span>
        <div className="scroll-line" />
      </div>
    </section>
  )
}
