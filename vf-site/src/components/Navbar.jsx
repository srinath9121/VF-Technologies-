import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animate } from 'animejs'
import { hero } from '../content'

gsap.registerPlugin(ScrollTrigger)

const NAV_SECTIONS = ['hero', 'about', 'services', 'partners', 'careers', 'contact']

export default function Navbar({ scrollTo }) {
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('hero')
  const navRef = useRef()

  useEffect(() => {
    // GSAP: Navbar slides down from top on page load
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.5 }
    )

    // Scroll state for glass blur effect
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll, { passive: true })

    // GSAP ScrollTrigger: Track active section and animate the active nav link
    NAV_SECTIONS.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      ScrollTrigger.create({
        trigger: el,
        start: 'top 60%',
        end: 'bottom 40%',
        onEnter: () => setActiveSection(id),
        onEnterBack: () => setActiveSection(id),
      })
    })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo" onClick={() => scrollTo('hero')} style={{ cursor: 'pointer' }}>
        <img src={hero.logo} alt="VF Technologies" />
        <span className="navbar-brand-name">VF Technologies</span>
      </div>
      <ul className="navbar-links">
        {[
          ['about', 'About'],
          ['services', 'Engineering'],
          ['partners', 'Clients'],
          ['careers', 'Careers'],
          ['contact', 'Contact']
        ].map(([id, label]) => (
          <li key={id}>
            <a
              data-section={id}
              onClick={() => scrollTo(id)}
              className={activeSection === id ? 'nav-link-active' : ''}
              style={{ cursor: 'pointer' }}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <button className="navbar-cta btn-primary-teal" onClick={() => scrollTo('contact')}>
        Get Started
      </button>
    </nav>
  )
}

