import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Stats from './components/Stats'
import Services from './components/Services'
import Partners from './components/Partners'
import Careers from './components/Careers'
import Contact from './components/Contact'
import ThreeCanvas from './components/ThreeCanvas'
import ScrollHUD from './components/ScrollHUD'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Lenis ultra-smooth scroll optimized for zero lag and crisp stops
    const lenis = new Lenis({
      duration: 0.8, // Snappy, short duration to eliminate "halfway" floaty feeling
      easing: (t) => 1 - Math.pow(1 - t, 4), // Quartic ease out: fast start, decisive stop
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.2, // Makes mouse wheel input instantly responsive
      smoothTouch: false,
      touchMultiplier: 2,
      syncTouch: true,
    })
    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    
    // Create a dedicated ticker function so we can remove it cleanly
    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }
    
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    // Cinematic Reveal animations with 3D tilt
    const revealElements = document.querySelectorAll('.reveal')
    revealElements.forEach((el) => {
      gsap.fromTo(el,
        { opacity: 0, y: 50, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 88%',
            toggleActions: 'play none none none',
          }
        }
      )
    })

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -80 })
    }
  }

  return (
    <>
      <ScrollHUD />
      <ThreeCanvas />
      <Navbar scrollTo={scrollTo} />
      <main className="content-wrapper">
        <Hero />
        <About />
        <Stats />
        <Services />
        <Partners />
        <Careers />
        <Contact />
      </main>
      <footer className="footer">
        <p>© Copyright 2025 - Volks Resources. All Rights Reserved.</p>
      </footer>
    </>
  )
}
