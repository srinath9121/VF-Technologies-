import { useEffect, useRef } from 'react'
import { animate, onScroll } from 'animejs'
import { about } from '../content'

export default function About() {
  const sectionRef = useRef()
  const imageStackRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    const scrollSettings = {
      enter: 20,
      leave: 60,
    }

    // anime.js onScroll: Images on the LEFT smoothly animate from Right to Left as you scroll down
    const images = sectionRef.current.querySelectorAll('.about-image-stack img')
    const animations = []

    images.forEach((img, idx) => {
      const shift = 150 + idx * 60
      const anim = animate(img, {
        x: [`${shift}px`, `-${shift}px`], // Moves right to left
        ease: 'linear',
        autoplay: onScroll({
          target: sectionRef.current,
          enter: () => `top-=${scrollSettings.enter} bottom`,
          leave: () => `bottom+=${scrollSettings.leave} top`,
          sync: 0.35,
        })
      })
      animations.push(anim)
    })

    // Dynamic threshold animation calling ScrollObserver.refresh()
    const refreshAnim = animate(scrollSettings, {
      enter: 80,
      leave: 100,
      duration: 3000,
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

    // Value cards glide right-to-left
    const cards = sectionRef.current.querySelectorAll('.value-card')
    cards.forEach((card, idx) => {
      const offset = 40 + (idx % 3) * 20
      animate(card, {
        x: [`${offset}px`, `-${offset}px`],
        ease: 'linear',
        autoplay: onScroll({
          target: sectionRef.current,
          enter: 'center bottom',
          leave: 'bottom top',
          sync: 0.25,
        })
      })
    })

    return () => {
      if (refreshAnim && typeof refreshAnim.pause === 'function') {
        refreshAnim.pause()
      }
    }
  }, [])

  return (
    <section className="about section" id="about" ref={sectionRef}>
      <div className="reveal">
        <span className="section-label">Who We Are</span>
        <h2 className="section-title">{about.heading}</h2>
        <p className="section-subtitle">{about.mission}</p>
      </div>

      <div className="about-grid">
        {/* Images on the LEFT */}
        <div className="about-visual reveal">
          <div className="about-image-stack" ref={imageStackRef}>
            <img src={about.images[0]} alt="Volks Resources team" />
            <img src={about.images[1]} alt="Volks Resources operations" />
          </div>
        </div>

        {/* Content on the RIGHT */}
        <div className="about-text reveal">
          {about.paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>

      <div className="values-grid">
        {about.values.map((v, i) => (
          <div className="value-card reveal" key={i}>
            <img src={v.icon} alt={v.name} />
            <h4>{v.name}</h4>
          </div>
        ))}
      </div>
    </section>
  )
}
