import { useEffect, useState } from 'react'
import { hero } from '../content'

export default function Navbar({ scrollTo }) {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-logo">
        <img src={hero.logo} alt="Volks Resources" />
      </div>
      <ul className="navbar-links">
        <li><a onClick={() => scrollTo('about')}>About</a></li>
        <li><a onClick={() => scrollTo('services')}>Services</a></li>
        <li><a onClick={() => scrollTo('careers')}>Careers</a></li>
        <li><a onClick={() => scrollTo('contact')}>Contact</a></li>
      </ul>
      <button className="navbar-cta" onClick={() => scrollTo('contact')}>
        Get in Touch
      </button>
    </nav>
  )
}
