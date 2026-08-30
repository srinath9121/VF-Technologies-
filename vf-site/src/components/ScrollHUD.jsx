import { useEffect, useState } from 'react'

const CHAPTER_LIST = [
  { id: 'hero', num: '01', name: 'HERO // ENTRANCE' },
  { id: 'about', num: '02', name: 'ABOUT // CAPABILITIES' },
  { id: 'stats', num: '03', name: 'SCALE // METRICS' },
  { id: 'osp-fiber', num: '04', name: 'OSP FIBER' },
  { id: 'permitting-engineering', num: '05', name: 'PERMITTING & CAD' },
  { id: 'network-planning', num: '06', name: 'NETWORK TOPOLOGY' },
  { id: 'pole-loading', num: '07', name: 'POLE LOADING' },
  { id: 'traffic-control', num: '08', name: 'TRAFFIC CONTROL' },
  { id: 'app-design', num: '09', name: 'FIELD APP DESIGN' },
  { id: 'partners', num: '10', name: 'CLIENTS & TRUST' },
  { id: 'careers', num: '11', name: 'TEAM & CAREERS' },
  { id: 'contact', num: '12', name: 'CONSULTATION TERMINAL' }
]

export default function ScrollHUD() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeChapterIndex, setActiveChapterIndex] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight
      if (totalScroll <= 0) return

      const progress = Math.min(1, Math.max(0, window.scrollY / totalScroll))
      setScrollProgress(Math.round(progress * 100))

      // Determine active chapter based on total page scroll progress
      const targetIndex = Math.min(CHAPTER_LIST.length - 1, Math.floor(progress * CHAPTER_LIST.length))
      setActiveChapterIndex(targetIndex)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const currentChapter = CHAPTER_LIST[activeChapterIndex] || CHAPTER_LIST[0]

  return (
    <>
      {/* 1. Left Vertical Chapter Tracker Indicator */}
      <aside className="persistent-chapter-rail">
        <div className="chapter-rail-indicator">
          <span className="current-rail-num">{currentChapter.num}</span>
          <span className="current-rail-title">{currentChapter.name}</span>
          <span className="rail-pulse-dot">●</span>
        </div>

        {/* Minimalist vertical step dots */}
        <div className="chapter-rail-dots">
          {CHAPTER_LIST.map((ch, idx) => (
            <div
              key={ch.id}
              className={`rail-dot ${idx === activeChapterIndex ? 'active' : idx < activeChapterIndex ? 'passed' : ''}`}
              title={ch.name}
            >
              <div className="dot-inner"></div>
            </div>
          ))}
        </div>
      </aside>

      {/* 2. Top-Right Global Live Telemetry & Scroll Progress Bar */}
      <div className="top-scroll-progress-line">
        <div className="scroll-progress-fill" style={{ width: `${scrollProgress}%` }}></div>
      </div>

      {/* 3. Bottom-Right Engineering HUD HUD */}
      <div className="persistent-scroll-hud">
        <div className="hud-metric">
          <span className="hud-label">TELEMETRY_LATENCY</span>
          <span className="hud-val">12ms // 60FPS</span>
        </div>
        <div className="hud-divider"></div>
        <div className="hud-metric">
          <span className="hud-label">GLOBAL_PROGRESS</span>
          <span className="hud-val-accent">{scrollProgress}%</span>
        </div>
      </div>
    </>
  )
}
