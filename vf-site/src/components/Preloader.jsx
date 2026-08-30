import { useEffect, useState } from 'react'

export default function Preloader() {
  const [progress, setProgress] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isDone, setIsDone] = useState(false)

  useEffect(() => {
    // Fast initial asset & shader compilation counter
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => setIsLoaded(true), 250)
          setTimeout(() => setIsDone(true), 900)
          return 100
        }
        const step = Math.floor(Math.random() * 25) + 15
        return Math.min(100, prev + step)
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  if (isDone) return null

  return (
    <div className={`site-preloader-overlay ${isLoaded ? 'preloader-exit' : ''}`}>
      <div className="preloader-content">
        
        {/* Holographic Glowing VF Monogram */}
        <div className="preloader-logo-ring">
          <span className="preloader-monogram">VF</span>
          <div className="ring-spin"></div>
        </div>

        {/* Brand Name */}
        <h2 className="preloader-title">VF TECHNOLOGIES</h2>
        <span className="preloader-tagline">NEXT-GENERATION TELECOM & FIBER ENGINEERING</span>

        {/* Live Initializing Telemetry Line */}
        <div className="preloader-progress-box">
          <div className="preloader-bar-outer">
            <div className="preloader-bar-fill" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="preloader-telemetry-text">
            <span>CORE_INITIALIZATION_3D</span>
            <span>{progress}%</span>
          </div>
        </div>

      </div>
    </div>
  )
}
