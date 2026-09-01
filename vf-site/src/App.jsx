import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import MainScene from './components/MainScene'
import Navbar from './components/Navbar'
import TowerStoryOverlay, { TOWER_CHAPTERS } from './components/TowerStoryOverlay'
import ScrollHUD from './components/ScrollHUD'
import Cursor from './components/Cursor'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const lenisRef = useRef(null)
  const scrollProgressRef = useRef(0)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    // 1. Lenis smooth scroll engine
    const lenis = new Lenis({
      duration: 1.4,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
      syncTouch: true,
      syncTouchLerp: 0.075,
      autoResize: true
    })
    lenisRef.current = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const updateLenis = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(updateLenis)
    gsap.ticker.lagSmoothing(0)

    // 2. GSAP ScrollTrigger for Vertical Tower Pinned Journey
    const totalChapters = TOWER_CHAPTERS.length

    const trigger = ScrollTrigger.create({
      trigger: '.tower-pinned-viewport',
      start: 'top top',
      end: `+=${totalChapters * 120}%`,
      pin: true,
      scrub: 1.0,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress
        const curIdx = Math.min(totalChapters - 1, Math.max(0, Math.floor(self.progress * totalChapters)))
        setActiveIndex(curIdx)
      }
    })

    return () => {
      gsap.ticker.remove(updateLenis)
      lenis.destroy()
      trigger.kill()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  // Smooth glide to any tower chapter band
  const scrollToChapter = (chapterIndex) => {
    const totalChapters = TOWER_CHAPTERS.length
    const targetProgress = chapterIndex / (totalChapters - 1)
    const pinContainer = document.querySelector('.tower-pinned-viewport')

    if (pinContainer && lenisRef.current) {
      const pinTop = pinContainer.offsetTop
      const pinDistance = totalChapters * 1.2 * window.innerHeight
      const targetScroll = pinTop + targetProgress * pinDistance
      lenisRef.current.scrollTo(targetScroll, { duration: 1.6 })
    }
  }

  return (
    <div className="tower-experience-root">
      {/* Precision Laser & Reticle Cursor */}
      <Cursor />

      {/* Vertical Altitude Chapter Rail */}
      <ScrollHUD activeIndex={activeIndex} scrollToChapter={scrollToChapter} />

      {/* Persistent 3D Telecom Tower World Canvas */}
      <MainScene scrollProgressRef={scrollProgressRef} />

      {/* Top Architectural Header */}
      <Navbar scrollToChapter={scrollToChapter} />

      {/* Pinned Tower Story Overlay Viewport */}
      <div className="tower-pinned-viewport">
        <TowerStoryOverlay activeIndex={activeIndex} scrollToChapter={scrollToChapter} />
      </div>
    </div>
  )
}
