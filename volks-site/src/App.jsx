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
    // Lenis ultra-smooth scroll
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    })
    lenisRef.current = lenis

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
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
