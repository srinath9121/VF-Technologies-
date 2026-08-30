import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animate, onScroll, stagger } from 'animejs'
import { careers } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Careers() {
  const sectionRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    // GSAP ScrollTrigger: Scale + fade in the card as it enters viewport
    gsap.fromTo(sectionRef.current.querySelector('.careers-card'),
      { scale: 0.92, opacity: 0, y: 60 },
      {
        scale: 1, opacity: 1, y: 0,
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          toggleActions: 'play none none none',
        }
      }
    )

    // Anime.js: Staggered entrance of the inner reveal elements
    const innerEls = sectionRef.current.querySelectorAll('.careers-card .reveal')
    animate(innerEls, {
      opacity: [0, 1],
      translateY: ['40px', '0px'],
      duration: 900,
      delay: stagger(150, { start: 400 }),
      ease: 'outExpo',
    })

    // Anime.js onScroll: Subtle floating glide on the whole card as you scroll past
    animate(sectionRef.current.querySelector('.careers-card'), {
      translateY: ['20px', '-20px'],
      ease: 'linear',
      autoplay: onScroll({
        target: sectionRef.current,
        enter: 'top bottom',
        leave: 'bottom top',
        sync: 0.18,
      })
    })

    // Anime.js: Continuous subtle breathing glow on the CTA button
    animate(sectionRef.current.querySelector('.btn-primary'), {
      boxShadow: [
        '0 0 18px rgba(0,212,255,0.3)',
        '0 0 40px rgba(0,212,255,0.75)',
        '0 0 18px rgba(0,212,255,0.3)',
      ],
      duration: 2200,
      loop: true,
      ease: 'inOutSine',
    })

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.trigger === sectionRef.current) t.kill()
      })
    }
  }, [])

  return (
    <section className="careers section" id="careers" ref={sectionRef}>
      <div className="careers-card">
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
