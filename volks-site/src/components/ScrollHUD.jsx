import { useEffect, useRef, useState } from 'react'
import { animate, onScroll, utils } from 'animejs'

export default function ScrollHUD() {
  const progressBarRef = useRef()
  const percentTextRef = useRef()
  const [scrollDepth, setScrollDepth] = useState(0)

  useEffect(() => {
    // Dynamic scroll threshold setting for HUD refresh()
    const hudSettings = {
      enter: 10,
      leave: 10,
    }

    // Top progress bar synced directly to total page scroll
    const barAnim = animate(progressBarRef.current, {
      scaleX: [0, 1],
      ease: 'linear',
      autoplay: onScroll({
        enter: () => `top-=${hudSettings.enter} top`,
        leave: () => `bottom+=${hudSettings.leave} bottom`,
        sync: 1, // 1:1 playback progress
      })
    })

    // Dynamic threshold update calling .refresh()
    const refreshAnim = animate(hudSettings, {
      enter: 50,
      leave: 50,
      duration: 4000,
      loop: true,
      alternate: true,
      onUpdate: () => {
        if (barAnim._autoplay && typeof barAnim._autoplay.refresh === 'function') {
          barAnim._autoplay.refresh()
        }
      }
    })

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, Math.round((window.scrollY / totalHeight) * 100)))
        setScrollDepth(progress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (refreshAnim && typeof refreshAnim.pause === 'function') {
        refreshAnim.pause()
      }
    }
  }, [])

  return (
    <>
      {/* Top Cybernetic Scroll Progress Bar */}
      <div className="scroll-hud-top-bar">
        <div className="scroll-hud-progress-fill" ref={progressBarRef} />
      </div>

      {/* Floating Vertical HUD Badge */}
      <div className="scroll-hud-badge">
        <div className="hud-indicator-dot" />
        <span className="hud-label">NET_DEPTH</span>
        <span className="hud-value" ref={percentTextRef}>
          {scrollDepth.toString().padStart(2, '0')}%
        </span>
        <div className="hud-scanline" />
      </div>
    </>
  )
}
