import { useEffect, useRef } from 'react'
import { animate, onScroll, utils } from 'animejs'
import { contact } from '../content'

export default function Contact() {
  const sectionRef = useRef()

  useEffect(() => {
    if (!sectionRef.current) return

    const contactSettings = {
      enterVal: 35,
      leaveVal: 65,
    }

    // anime.js onScroll: Office cards 3D perspective flip & right-to-left glide
    const officeCards = sectionRef.current.querySelectorAll('.office-card')
    const animations = []

    officeCards.forEach((card, idx) => {
      const shift = 80 + idx * 40
      const anim = animate(card, {
        x: [`${shift}px`, `-${shift}px`],
        rotateX: ['12deg', '-6deg'],
        ease: 'linear',
        autoplay: onScroll({
          target: sectionRef.current,
          enter: () => `top-=${contactSettings.enterVal} bottom`,
          leave: () => `bottom+=${contactSettings.leaveVal} top`,
          sync: 0.35,
        })
      })
      animations.push(anim)
    })

    // Dynamic threshold update calling .refresh()
    const refreshAnim = animate(contactSettings, {
      enterVal: 75,
      leaveVal: 110,
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

    return () => {
      if (refreshAnim && typeof refreshAnim.pause === 'function') {
        refreshAnim.pause()
      }
    }
  }, [])

  return (
    <section className="contact section" id="contact" ref={sectionRef}>
      <div className="reveal">
        <span className="section-label">Get in Touch</span>
        <h2 className="section-title">
          Let's Build the <span className="gradient-text">Future Together</span>
        </h2>
        <p className="section-subtitle">{contact.subtitle}</p>
      </div>

      <div className="contact-grid">
        <form className="contact-form reveal" onSubmit={(e) => e.preventDefault()}>
          <div className="form-row">
            <div className="form-group">
              <label>First Name</label>
              <input type="text" placeholder="John" />
            </div>
            <div className="form-group">
              <label>Last Name</label>
              <input type="text" placeholder="Doe" />
            </div>
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input type="email" placeholder="john@company.com" />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="tel" placeholder="+1 (972) 000-0000" />
          </div>
          <div className="form-group">
            <label>Project Scope / Message</label>
            <textarea placeholder="Tell us about your telecom, utility, or fiber project..." />
          </div>
          <button className="btn-primary glow-btn" type="submit" style={{ alignSelf: 'flex-start' }}>
            <span>Send Transmission</span>
          </button>
        </form>

        <div className="offices-list reveal">
          {contact.offices.map((office, i) => (
            <div className="office-card" key={i}>
              <div className="office-region-badge">{office.region} HUB</div>
              <h4>{office.region} Operations</h4>
              <p>📞 <a href={`tel:${office.phone}`}>{office.phone}</a></p>
              <p>✉️ <a href={`mailto:${office.email}`}>{office.email}</a></p>
              <p>📍 {office.address}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
