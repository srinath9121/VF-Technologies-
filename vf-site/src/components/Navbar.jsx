import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Navbar({ scrollToChapter }) {
  const [scrolled, setScrolled] = useState(false)
  const navRef = useRef()

  useEffect(() => {
    gsap.fromTo(navRef.current,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.0, ease: 'power3.out', delay: 0.3 }
    )

    const handleScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navItems = [
    { label: 'About', chapterIndex: 1 },
    { label: 'Engineering', chapterIndex: 2 },
    { label: 'Clients', chapterIndex: 3 },
    { label: 'Careers', chapterIndex: 4 },
    { label: 'Technology', chapterIndex: 5 },
    { label: 'Contact', chapterIndex: 6 }
  ]

  return (
    <header ref={navRef} className={`tower-navbar ${scrolled ? 'is-scrolled' : ''}`}>
      {/* Brand Logo with Official VF Emblem */}
      <div 
        className="navbar-brand-group" 
        onClick={() => scrollToChapter(0)}
        style={{ cursor: 'pointer' }}
      >
        <img src="/vf-logo.png" alt="VF Logo" className="navbar-logo-img" />
        <span className="brand-text-bold">VF TECHNOLOGIES</span>
      </div>

      {/* Menu Links */}
      <nav className="navbar-links-container">
        {navItems.map((item, idx) => (
          <button
            key={idx}
            className="nav-link-item"
            onClick={() => scrollToChapter(item.chapterIndex)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      {/* Action CTA */}
      <button 
        className="navbar-cta-teal"
        onClick={() => scrollToChapter(6)}
      >
        GET STARTED
      </button>
    </header>
  )
}
