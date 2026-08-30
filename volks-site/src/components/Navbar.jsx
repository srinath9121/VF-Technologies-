import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { animate } from 'animejs'
import { hero } from '../content'

gsap.registerPlugin(ScrollTrigger)

const NAV_SECTIONS = ['hero', 'about', 'services', 'careers', 'contact']

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

  // Anime.js: pulse glow on active link whenever it changes
  useEffect(() => {
    const activeEl = navRef.current?.querySelector(`[data-section="${activeSection}"]`)
    if (!activeEl) return
    animate(activeEl, {
      textShadow: ['0 0 0px rgba(0,212,255,0)', '0 0 18px rgba(0,212,255,0.85)', '0 0 0px rgba(0,212,255,0)'],
      duration: 700,
      ease: 'outExpo',
    })
  }, [activeSection])

  return (
    <nav ref={navRef} className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo">
        <img src={hero.logo} alt="Volks Resources" />
      </div>
      <ul className="navbar-links">
        {[['about','About'],['services','Services'],['careers','Careers'],['contact','Contact']].map(([id, label]) => (
          <li key={id}>
            <a
              data-section={id}
              onClick={() => scrollTo(id)}
              className={activeSection === id ? 'nav-link-active' : ''}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
      <button className="navbar-cta" onClick={() => scrollTo('contact')}>
        Get in Touch
      </button>
    </nav>
  )
}

