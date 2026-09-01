import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { hero } from '../content'

export default function Hero() {
  const heroRef = useRef()

  useEffect(() => {
    if (!heroRef.current) return
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out', duration: 1.4 } })
      
      tl.fromTo('.hero-cinematic-tagline',
        { opacity: 0, y: -25, scale: 0.9 },
        { opacity: 1, y: 0, scale: 1, duration: 1 }
      )
      .fromTo('.hero-cinematic-heading .word-span', 
        { y: 90, opacity: 0, rotateX: 45, filter: 'blur(10px)' },
        { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)', stagger: 0.07 },
        "-=0.7"
      )
      .fromTo('.hero-cinematic-subtitle',
        { y: 30, opacity: 0, filter: 'blur(8px)' },
        { y: 0, opacity: 1, filter: 'blur(0px)', duration: 1 },
        "-=0.8"
      )
      .fromTo('.hero-telemetry-strip',
        { opacity: 0, y: 30, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1 },
        "-=0.7"
      )
      .fromTo('.hero-scroll-indicator',
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.8 },
        "-=0.4"
      )
    }, heroRef)

    return () => ctx.revert()
  }, [])

  const words = (hero.headlines[0] || "Venkateswara Fiber Technologies & Telecom Infrastructure").split(' ')

  return (
    <section className="hero-cinematic" id="home" ref={heroRef}>
      <div className="hero-cinematic-content">
        

        
        {/* Master Heading with Holographic Glow */}
        <h1 className="hero-cinematic-heading">
          {words.map((word, i) => (
            <span className="word-span" key={i} style={{ display: 'inline-block', marginRight: '0.28em' }}>{word}</span>
          ))}
        </h1>
        
        <p className="hero-cinematic-subtitle">
          {hero.subtitle}
        </p>



        {/* Scroll Indicator */}
        <div className="hero-scroll-indicator">
          <div className="mouse">
            <div className="wheel"></div>
          </div>
          <span className="scroll-cue-text">SCROLL TO DIVE INTO OPTICAL NETWORK</span>
        </div>
      </div>
    </section>
  )
}
