import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { clients, testimonials } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Partners() {
  const sectionRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // 1. Header reveal
      gsap.fromTo('.clients-story-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.clients-story-header',
            start: 'top 85%'
          }
        }
      )

      // 2. Spatial Logo Field staggered floating entrance
      gsap.fromTo('.client-logo-card',
        { opacity: 0, scale: 0.85, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.clients-logo-grid',
            start: 'top 80%'
          }
        }
      )

      // 3. Client Trust & Testimonial Cards entrance
      gsap.fromTo('.trust-review-card',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.trust-reviews-grid',
            start: 'top 80%'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section className="clients-trust-section section" id="partners" ref={sectionRef}>
      <div className="clients-trust-container">
        
        {/* Story Section Ribbon */}
        <div className="clients-story-header">
          <div className="story-pill">
            <span className="pill-pulse"></span>
            <span>CHAPTER 07 // CLIENT ECOSYSTEM & TRUST</span>
          </div>
          
          <h2 className="clients-main-heading">
            Trusted by Telecom Leaders<br/>& Municipal Partners.
          </h2>
          
          <p className="clients-main-subtitle">
            Partnering with top tier fiber carriers, utility co-ops, and infrastructure providers to engineer high-capacity networks nationwide.
          </p>
        </div>

        {/* Spatial Logo Field */}
        <div className="clients-logo-grid">
          {clients.map((logoUrl, idx) => (
            <div className="client-logo-card" key={idx}>
              <div className="logo-glow-halo"></div>
              <img src={logoUrl} alt={`Partner / Client Logo ${idx + 1}`} className="client-brand-img" />
            </div>
          ))}
        </div>

        {/* Verified Industry Reviews & Testimonials */}
        <div className="trust-reviews-grid">
          {testimonials.map((t, idx) => (
            <div className="trust-review-card" key={idx}>
              <div className="review-stars-row">
                ⭐⭐⭐⭐⭐
              </div>
              <p className="review-quote-text">
                "{t.quote}"
              </p>
              <div className="review-author-meta">
                <div className="author-avatar-dot">✦</div>
                <div className="author-details">
                  <h4>{t.source.split(' — ')[0]}</h4>
                  <span>{t.source.split(' — ')[1] || 'Infrastructure Executive'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Subtle Bridge toward Careers chapter */}
        <div className="clients-career-bridge">
          <span className="bridge-tag">NEXT IN STORY // THE TEAM BEHIND EVERY DEPLOYMENT</span>
          <div className="bridge-line"></div>
        </div>

      </div>
    </section>
  )
}
