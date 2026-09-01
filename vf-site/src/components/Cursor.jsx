import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [isHovering, setIsHovering] = useState(false)
  const [coords, setCoords] = useState({ x: 0, y: 0 })

  useEffect(() => {
    // Only show custom cursor on non-touch desktop devices
    if (window.matchMedia('(pointer: coarse)').matches) return

    const onMouseMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY })

      // Instant inner laser point
      if (dotRef.current) {
        gsap.set(dotRef.current, { x: e.clientX, y: e.clientY })
      }

      // Smooth trailing reticle ring
      if (ringRef.current) {
        gsap.to(ringRef.current, {
          x: e.clientX,
          y: e.clientY,
          duration: 0.22,
          ease: 'power2.out'
        })
      }
    }

    const onMouseOver = (e) => {
      const target = e.target
      if (
        target.tagName.toLowerCase() === 'a' ||
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('.rail-dot') ||
        target.closest('.chapter-nav-item') ||
        target.closest('.service-chapter-card')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    document.addEventListener('mouseover', onMouseOver, { passive: true })

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  return (
    <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 9999, overflow: 'hidden' }}>
      {/* 1. Precise Center Laser Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#00ffa3',
          boxShadow: '0 0 8px #00ffa3',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          transition: 'transform 0.15s ease'
        }}
      />

      {/* 2. Trailing Engineering Reticle Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: isHovering ? '44px' : '26px',
          height: isHovering ? '44px' : '26px',
          borderRadius: '50%',
          border: isHovering ? '1.5px solid #00ffa3' : '1px solid rgba(0, 212, 255, 0.45)',
          backgroundColor: isHovering ? 'rgba(0, 255, 163, 0.08)' : 'transparent',
          boxShadow: isHovering ? '0 0 16px rgba(0, 255, 163, 0.35)' : 'none',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
          transition: 'width 0.25s ease, height 0.25s ease, border-color 0.25s ease, background-color 0.25s ease'
        }}
      />
    </div>
  )
}
