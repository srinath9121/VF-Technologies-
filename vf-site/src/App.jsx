import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Preloader from './components/Preloader'
import MainScene from './components/MainScene'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Services from './components/Services'
import Partners from './components/Partners'
import Careers from './components/Careers'
import Contact from './components/Contact'
import ScrollHUD from './components/ScrollHUD'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef(null)

  useEffect(() => {
    // Lenis smooth scroll synchronized seamlessly with GSAP ScrollTrigger
    const lenis = new Lenis({
      duration: 1.0,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
      smoothTouch: false
    })
    lenisRef.current = lenis

    // Bidirectional sync between Lenis and GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update)
    
    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }
    
    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  const scrollTo = (id) => {
    const el = document.getElementById(id)
    if (el && lenisRef.current) {
      lenisRef.current.scrollTo(el, { offset: -70 })
    }
  }

  return (
    <>
      <Preloader />
      <ScrollHUD />
      <MainScene />
      <Navbar scrollTo={scrollTo} />
      
      <main className="content-wrapper">
        <Hero />
        <About />
        <Services />
        <Partners />
        <Careers />
        <Contact />
      </main>

      <footer className="footer">
        <p>© Copyright 2025 - VF Technologies. All Rights Reserved.</p>
      </footer>
    </>
  )
}
