import { useEffect, useRef } from 'react'
import { animate, onScroll } from 'animejs'
import { careers } from '../content'

export default function Careers() {
  const sectionRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    // anime.js onScroll: Right-to-left glide on CTA banner
    const ctaWrap = sectionRef.current.querySelector('.careers-card')
    if (ctaWrap) {
      animate(ctaWrap, {
        x: ['60px', '-60px'],
        ease: 'linear',
        autoplay: onScroll({
          target: sectionRef.current,
          enter: 'top bottom',
          leave: 'bottom top',
          sync: 0.25,
        })
      })
    }
  }, [])

  return (
    <section className="careers section" id="careers" ref={sectionRef}>
      <div className="careers-card reveal">
        <div className="reveal">
          <span className="section-label" style={{ justifyContent: 'center' }}>Join Our Team</span>
          <h2 className="section-title">{careers.heading}</h2>
          <p className="section-subtitle" style={{ margin: '0 auto 2rem' }}>{careers.subtitle}</p>
        </div>
        <p className="careers-cta-text reveal">{careers.cta}</p>
        <div className="reveal">
          <button className="btn-primary">View Open Positions</button>
        </div>
      </div>
    </section>
  )
}
