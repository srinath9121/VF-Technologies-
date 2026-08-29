import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animate, onScroll, utils } from 'animejs'
import { stats } from '../content'

export default function Stats() {
  const sectionRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    // 1. GSAP Counter numbers ticking up on viewport entry
    const ctx = gsap.context(() => {
      const counters = sectionRef.current.querySelectorAll('.stat-number')
      counters.forEach((counter) => {
        const target = parseFloat(counter.dataset.value)
        const suffix = counter.dataset.suffix || ''
        const obj = { val: 0 }

        gsap.to(obj, {
          val: target,
          duration: 2.2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (target >= 1000) {
              counter.textContent = Math.floor(obj.val).toLocaleString() + suffix
            } else {
              counter.textContent = Math.floor(obj.val) + suffix
            }
          }
        })
      })
    }, sectionRef)

    // 2. Anime.js onScroll: 3D perspective rotation + right-to-left glide on cards
    const statSettings = {
      enterDeg: 15,
      leaveDeg: 25,
    }

    const statItems = sectionRef.current.querySelectorAll('.stat-item')
    const animations = []

    statItems.forEach((item, idx) => {
      const shift = 60 + (idx % 4) * 25
      const anim = animate(item, {
        x: [`${shift}px`, `-${shift}px`],
        rotateY: ['-12deg', '12deg'], // 3D Y-axis tilt on scroll
        scale: [0.95, 1.05, 0.95],
        ease: 'linear',
        autoplay: onScroll({
          target: sectionRef.current,
          enter: () => `top-=${statSettings.enterDeg} bottom`,
          leave: () => `bottom+=${statSettings.leaveDeg} top`,
          sync: 0.35, // Smooth sync mode
        })
      })
      animations.push(anim)
    })

    // 3. Dynamic modifier updating thresholds and triggering .refresh()
    const refreshAnim = animate(statSettings, {
      enterDeg: 45,
      leaveDeg: 60,
      duration: 3200,
      loop: true,
      alternate: true,
      onUpdate: () => {
        animations.forEach(a => {
          if (a._autoplay && typeof a._autoplay.refresh === 'function') {
            a._autoplay.refresh()
          }
        })
      }
    })

    return () => {
      ctx.revert()
      if (refreshAnim && typeof refreshAnim.pause === 'function') {
        refreshAnim.pause()
      }
    }
  }, [])

  return (
    <section className="stats section" id="stats" ref={sectionRef}>
      <div className="reveal">
        <span className="section-label">By the Numbers</span>
        <h2 className="section-title">
          Scale & Impact Across <span className="gradient-text">22+ States</span>
        </h2>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-item reveal" key={i}>
            <div className="stat-glow-orb" />
            <div
              className="stat-number"
              data-value={s.value}
              data-suffix={s.suffix}
            >
              0
            </div>
            <div className="stat-label">{s.label}</div>
            <div className="stat-card-tech-corner" />
          </div>
        ))}
      </div>
    </section>
  )
}
