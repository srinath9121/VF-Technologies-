import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { contact } from '../content'

gsap.registerPlugin(ScrollTrigger)

export default function Contact() {
  const sectionRef = useRef()
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })

  useEffect(() => {
    if (!sectionRef.current) return

    const ctx = gsap.context(() => {
      // 1. Header reveal
      gsap.fromTo('.contact-story-header',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-story-header',
            start: 'top 85%'
          }
        }
      )

      // 2. Contact Split Grid reveal
      gsap.fromTo('.contact-split-grid',
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.contact-split-grid',
            start: 'top 80%'
          }
        }
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (formData.name && formData.email) {
      setFormSubmitted(true)
    }
  }

  return (
    <section className="contact-terminal-section section" id="contact" ref={sectionRef}>
      <div className="contact-terminal-container">
        
        {/* Story Section Ribbon */}
        <div className="contact-story-header">
          <div className="story-pill">
            <span className="pill-pulse"></span>
            <span>CHAPTER 09 // CONNECTION & CONSULTATION</span>
          </div>
          
          <h2 className="contact-main-heading">
            {contact.heading || "Let's Build What's Next."}
          </h2>
          
          <p className="contact-main-subtitle">
            {contact.subtitle || "Ready to launch your fiber build or streamline your engineering pipeline? Contact our engineering team for consultation."}
          </p>
        </div>

        {/* Main Contact Split Layout */}
        <div className="contact-split-grid">
          
          {/* Left Column: Direct Office & Telemetry Coordinates */}
          <div className="contact-coordinates-card">
            <div className="card-header-badge">
              <span className="coord-dot">●</span>
              <span>ENGINEERING HEADQUARTERS</span>
            </div>

            <div className="hq-details-block">
              <h3>{contact.offices[0]?.region || "Global Headquarters"}</h3>
              <p className="hq-address">{contact.offices[0]?.address || "VF Technologies Engineering Operations, North America"}</p>
            </div>

            <div className="contact-direct-links">
              <a href={`tel:${contact.offices[0]?.phone?.replace(/[^0-9+]/g, '') || '+18005550199'}`} className="direct-link-item">
                <span className="link-icon">📞</span>
                <div className="link-text">
                  <label>DIRECT TELEPHONE</label>
                  <span>{contact.offices[0]?.phone || "+1 (800) 555-0199"}</span>
                </div>
              </a>

              <a href={`mailto:${contact.offices[0]?.email || 'contact@vf-technologies.com'}`} className="direct-link-item">
                <span className="link-icon">✉️</span>
                <div className="link-text">
                  <label>ENGINEERING INQUIRIES</label>
                  <span>{contact.offices[0]?.email || "contact@vf-technologies.com"}</span>
                </div>
              </a>
            </div>

            <div className="availability-indicator">
              <span className="pulse-green"></span>
              <span>OPERATIONS: ACTIVE & ACCEPTING NEW BUILDS</span>
            </div>
          </div>

          {/* Right Column: Accessible Engineering Consultation Form */}
          <div className="contact-form-card">
            <div className="form-header-badge">
              <span>DIRECT CONSULTATION GATEWAY</span>
            </div>

            {formSubmitted ? (
              <div className="form-success-state">
                <span className="success-icon">✓</span>
                <h3>Consultation Request Received</h3>
                <p>An engineering team lead will review your project parameters and respond within 24 hours.</p>
                <button
                  type="button"
                  className="btn-primary-teal btn-reset"
                  onClick={() => { setFormSubmitted(false); setFormData({ name: '', email: '', message: '' }) }}
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form className="engineering-consult-form" onSubmit={handleSubmit}>
                <div className="form-field-group">
                  <label htmlFor="fullName">Full Name / Organization</label>
                  <input
                    type="text"
                    id="fullName"
                    required
                    placeholder="e.g. Alex Morgan (Chief Engineer)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="workEmail">Business Email</label>
                  <input
                    type="email"
                    id="workEmail"
                    required
                    placeholder="alex@carrier-infrastructure.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>

                <div className="form-field-group">
                  <label htmlFor="projectScope">Engineering Scope / Message</label>
                  <textarea
                    id="projectScope"
                    rows="4"
                    required
                    placeholder="Describe your fiber route, permitting requirements, or pole loading scope..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  ></textarea>
                </div>

                <button type="submit" className="btn-primary-teal btn-submit-terminal">
                  Transmit Consultation Request ↗
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </section>
  )
}
