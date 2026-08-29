import { useEffect, useRef } from 'react'
import { animate, onScroll, utils } from 'animejs'
import { clients, testimonials } from '../content'

export default function Partners() {
  const sectionRef = useRef()
  const trackRef = useRef()

  useEffect(() => {
    if (!sectionRef.current || !trackRef.current) return

    const partnerSettings = {
      enterVal: 30,
      leaveVal: 70,
    }

    // anime.js onScroll: Synchronize partner logos moving continuously RIGHT-TO-LEFT on scroll
    // Using direct playback progress sync: 1
    const marqueeAnim = animate(trackRef.current, {
      x: ['5%', '-45%'], // Right to left scroll movement
      ease: 'linear',
      autoplay: onScroll({
        target: sectionRef.current,
        enter: () => `top-=${partnerSettings.enterVal} bottom`,
        leave: () => `bottom+=${partnerSettings.leaveVal} top`,
        sync: 1, // Direct playback progress synchronization
      })
    })

    // Dynamic threshold modifier calling .refresh()
    const refreshAnim = animate(partnerSettings, {
      enterVal: 80,
      leaveVal: 110,
      duration: 3500,
      loop: true,
      alternate: true,
      onUpdate: () => {
        if (marqueeAnim._autoplay && typeof marqueeAnim._autoplay.refresh === 'function') {
          marqueeAnim._autoplay.refresh()
        }
      }
    })

    // Testimonials move right to left smoothly on scroll
    const testimonialCards = sectionRef.current.querySelectorAll('.testimonial-card')
    testimonialCards.forEach((card, idx) => {
      const shift = 70 + idx * 30
      animate(card, {
        x: [`${shift}px`, `-${shift}px`],
        ease: 'linear',
        autoplay: onScroll({
          target: sectionRef.current,
          enter: 'center bottom',
          leave: 'bottom top',
          sync: 0.3,
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
    <section className="partners section" id="partners" ref={sectionRef}>
      <div className="reveal" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <span className="section-label" style={{ justifyContent: 'center' }}>Trusted by Industry Leaders</span>
        <h2 className="section-title">Our Partners & Clients</h2>
      </div>

      <div className="logo-marquee-container">
        <div className="logo-marquee-track" ref={trackRef}>
          {clients.concat(clients).map((logo, idx) => (
            <div className="partner-logo-item" key={idx}>
              <img src={logo} alt="Partner Logo" loading="lazy" />
            </div>
          ))}
        </div>
      </div>

      <div className="testimonials-grid" style={{ marginTop: '5rem' }}>
        {testimonials.map((t, idx) => (
          <div className="testimonial-card reveal" key={idx}>
            <p className="testimonial-quote">{t.quote}</p>
            <span className="testimonial-author">— {t.source}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
