import { useEffect, useState } from 'react'
import gsap from 'gsap'

export default function Cursor() {
  const [isHovering, setIsHovering] = useState(false)
  const [isHoveringImage, setIsHoveringImage] = useState(false)

  useEffect(() => {
    const cursor = document.querySelector('.custom-cursor')
    if (!cursor) return

    const onMouseMove = (e) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15,
        ease: 'power2.out',
      })
    }

    const onMouseOver = (e) => {
      const target = e.target
      
      if (
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'button' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('navbar-logo')
      ) {
        setIsHovering(true)
        setIsHoveringImage(false)
      } else if (target.tagName.toLowerCase() === 'img') {
        setIsHovering(false)
        setIsHoveringImage(true)
      } else {
        setIsHovering(false)
        setIsHoveringImage(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseover', onMouseOver)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseover', onMouseOver)
    }
  }, [])

  return (
    <div 
      className={`custom-cursor ${isHovering ? 'cursor-hover' : ''} ${isHoveringImage ? 'cursor-image' : ''}`}
    />
  )
}
