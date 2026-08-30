import { useEffect, useRef } from 'react'
import gsap from 'gsap'
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

    return () => {
      ctx.revert()
    }
  }, [])

  return (
    <section className="stats section" id="stats" ref={sectionRef}>
      <div className="reveal">
        <span className="section-label">By the Numbers</span>
        <h2 className="section-title">
          Scale & Impact Across <span className="gradient-text">Global Markets</span>
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
