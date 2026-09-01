import { useEffect, useState } from 'react'
import { TOWER_CHAPTERS } from './TowerStoryOverlay'

export default function ScrollHUD({ activeIndex, scrollToChapter }) {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll <= 0) return
      const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll))
      setScrollProgress(Math.round(progress * 100))
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentElevation = Math.round(scrollProgress * 0.48) // 0 to 48 meters

  return (
    <>
      {/* 1. Left-Side Minimal Altitude Chapter Rail */}
      <aside className="tower-altitude-rail">
        <div className="altitude-rail-header">
          <span className="rail-pulse">●</span>
          <span>TOWER ALTITUDE</span>
        </div>
        <div className="current-elevation-display">
          +{currentElevation}.0M
        </div>

        <ul className="altitude-chapter-list">
          {TOWER_CHAPTERS.map((ch, idx) => {
            const isActive = idx === activeIndex

            return (
              <li
                key={ch.id}
                className={`altitude-item ${isActive ? 'is-active-altitude' : ''}`}
                onClick={() => scrollToChapter(idx)}
              >
                <span className="altitude-num">{ch.bandNum}</span>
                <span className="altitude-name">{ch.name}</span>
              </li>
            )
          })}
        </ul>
      </aside>

      {/* 2. Top-Right Global Live Telemetry Line */}
      <div className="top-scroll-progress-line">
        <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }}></div>
      </div>
    </>
  )
}
