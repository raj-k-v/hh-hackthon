import { useEffect, useState } from 'react'

export default function LoadingScreen({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [fadeOut, setFadeOut] = useState(false)

  useEffect(() => {
    // Animate progress from 0 to 100 over ~1.8s
    const start = performance.now()
    const duration = 1800

    const tick = (now) => {
      const elapsed = now - start
      const p = Math.min(elapsed / duration, 1)
      // ease-out curve
      const eased = 1 - Math.pow(1 - p, 3)
      setProgress(Math.round(eased * 100))
      if (p < 1) {
        requestAnimationFrame(tick)
      } else {
        // Short pause then fade out
        setTimeout(() => {
          setFadeOut(true)
          setTimeout(onDone, 500)
        }, 200)
      }
    }

    requestAnimationFrame(tick)
  }, [onDone])

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #0a2e14 0%, #0d3318 50%, #091f0d 100%)',
        opacity: fadeOut ? 0 : 1,
        transition: 'opacity 0.5s ease',
        pointerEvents: fadeOut ? 'none' : 'all',
      }}
    >
      {/* Subtle dot grid */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: 'radial-gradient(circle, #e8d44d 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: 'repeating-linear-gradient(90deg, #1a5c2a, #1a5c2a 8px, #e84393 8px, #e84393 16px, #e8d44d 16px, #e8d44d 24px)' }}
      />

      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-8 w-full max-w-sm">
        <div className="flex flex-col items-center gap-3">
          <img src="/2-47.svg" alt="2:47 PM Studio" className="h-12 opacity-90" />
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-hh-yellow/60" />
            <span className="text-hh-yellow/50 font-mono text-[10px] tracking-[0.3em] uppercase">presents</span>
            <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-hh-yellow/60" />
          </div>
          <p className="text-white/80 font-mono text-[11px] tracking-[0.4em] uppercase mt-1">Hacker House · Goa 2026</p>
        </div>

        {/* Thin elegant line progress bar */}
        <div className="w-full flex flex-col gap-2">
          <div className="relative w-full h-[1px] bg-white/10 rounded-full overflow-hidden">
            {/* Glow fill */}
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-none"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #005f32, #e84393, #e8d44d)',
                boxShadow: '0 0 8px 1px rgba(232, 67, 147, 0.6)',
                transition: 'width 0.05s linear',
              }}
            />
            {/* Traveling sparkle */}
            <div
              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full"
              style={{
                left: `calc(${progress}% - 3px)`,
                background: '#fff',
                boxShadow: '0 0 6px 2px rgba(255,255,255,0.9), 0 0 12px 4px rgba(232, 67, 147, 0.7)',
                transition: 'left 0.05s linear',
              }}
            />
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/20 font-mono text-[9px] tracking-widest uppercase">Loading</span>
            <span className="text-hh-yellow/60 font-mono text-[9px] tabular-nums">{progress}%</span>
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px]"
        style={{ background: 'repeating-linear-gradient(90deg, #e8d44d, #e8d44d 8px, #e84393 8px, #e84393 16px, #1a5c2a 16px, #1a5c2a 24px)' }}
      />
    </div>
  )
}
