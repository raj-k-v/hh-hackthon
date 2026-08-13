import { useState, useCallback, useEffect, useRef } from 'react'
import LandingPage from './components/LandingPage'
import PhotoUpload from './components/PhotoUpload'
import BuilderForm from './components/BuilderForm'
import Preview from './components/Preview'
import LoadingScreen from './components/LoadingScreen'

const TITLES = [
  "Pixel Wizard", "Bug Whisperer", "Code Alchemist", "Stack Overlord",
  "Deploy Destroyer", "API Hacker", "Terminal Cowboy", "Merge Conflict Champion",
  "Coffee-to-Code Converter", "404 Finder", "Rust Evangelist", "Full-Stack Yoda",
  "Git Commit Samurai", "Docker Captain", "Kernel Whisperer", "Syntax Samurai",
  "Blockchain Bard", "Data Wrangler", "Cloud Nomad", "Open Source Monk",
  "Night Owl Coder", "Debugging Detective", "Refactoring Renegade", "Sudo Sprinter",
  "Prompt Engineer Pro", "AI Whisperer", "Smart Contract Sage", "UI Sorcerer",
  "Backend Buccaneer", "Frontend Phoenix", "Goa Hackathon Hero", "Vibe Coder",
  "Zero-Lag Legend", "Async Avenger", "CSS Maestro", "Wasm Warlord",
  "Byte Titan", "Algorithm Architect", "State Manager", "Infinite Looper",
  "Solana Scholar", "Ethereum Enchanter", "Cyber Nomad", "Mainnet Maverick",
  "Hackathon Hustler", "Production Rogue", "Ship It Specialist", "Dark Mode Ninja",
  "Regex Ruler", "GPU Gladiator", "LLM Conductor", "Memory Leak Hunter",
]

function generateTitle() {
  return TITLES[Math.floor(Math.random() * TITLES.length)]
}

export default function App() {
  const [loading, setLoading]   = useState(true)
  const [step, setStep]         = useState('landing')
  const [format, setFormat]     = useState(null) // 'card' | 'pfp'
  const [photo, setPhoto]       = useState(null)
  const [name, setName]         = useState('')
  const [stack, setStack]       = useState('')
  const [builderTitle, setBuilderTitle] = useState(generateTitle)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef(null)
  const hasInteractedRef = useRef(false)

  const handleRerollTitle = useCallback(() => {
    setBuilderTitle(generateTitle())
  }, [])

  // Audio setup
  useEffect(() => {
    const audio = new Audio('/audio.wav')
    audio.loop = true
    audio.volume = 0.5
    audioRef.current = audio

    // Attempt autoplay
    audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))

    // Fallback: Start audio on user's first click if browser blocked initial autoplay
    const handleFirstInteraction = () => {
      if (hasInteractedRef.current) return
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {})
      }
    }
    window.addEventListener('click', handleFirstInteraction, { once: true })

    return () => {
      window.removeEventListener('click', handleFirstInteraction)
      audio.pause()
    }
  }, [])

  const toggleAudio = useCallback((e) => {
    if (e) {
      e.stopPropagation()
      e.preventDefault()
    }
    hasInteractedRef.current = true
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }, [])

  const handleFormatSelect = useCallback((selectedFormat) => {
    setFormat(selectedFormat)
    setStep('upload')
  }, [])

  const handlePhotoUpload = useCallback((photoDataUrl) => {
    setPhoto(photoDataUrl)
    if (format === 'pfp') {
      setStep('preview')
    } else {
      setStep('form')
    }
  }, [format])

  const handleFormSubmit = useCallback((formData) => {
    setName(formData.name)
    setStack(formData.stack)
    setStep('preview')
  }, [])

  const handleBack = useCallback(() => {
    if (step === 'preview') {
      if (format === 'pfp') {
        setStep('upload')
        setPhoto(null)
      } else {
        setStep('form')
      }
    } else if (step === 'form') {
      setStep('upload')
      setPhoto(null)
    } else if (step === 'upload') {
      setStep('landing')
      setFormat(null)
      setPhoto(null)
    }
  }, [step, format])

  const handleStartOver = useCallback(() => {
    setStep('landing')
    setFormat(null)
    setPhoto(null)
    setName('')
    setStack('')
  }, [])

  // 2D Translate coordinates
  let translateX = 0
  let translateY = 0

  if (step !== 'landing') {
    if (format === 'pfp') {
      translateY = -100
    } else {
      translateX = -100
    }
  }

  const isLanding = step === 'landing'

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-hh-green">
      {/* LOADING SCREEN */}
      {loading && <LoadingScreen onDone={() => setLoading(false)} />}


      {/* FIXED BACKGROUND LAYER - Mobile */}
      <div
        className="fixed inset-0 pointer-events-none z-0 block sm:hidden"
        style={{
          backgroundImage: `url('/bg-mobile.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* FIXED BACKGROUND LAYER - Desktop */}
      <div
        className="fixed inset-0 pointer-events-none z-0 hidden sm:block"
        style={{
          backgroundImage: `url('/bg.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }}
      />

      {/* DYNAMIC FLOATING PINK ARROW BUTTONS */}

      {/* 1. RIGHT ARROW (Home Page → Build ID) */}
      <button
        onClick={() => handleFormatSelect('card')}
        className={`fixed right-4 sm:right-8 top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white shadow-xl flex items-center justify-center group cursor-pointer border-2 border-white/30 transition-all duration-500 cubic-bezier(0.77,0,0.175,1) ${
          isLanding
            ? 'scale-100 opacity-100 pointer-events-auto hover:scale-110 active:scale-95'
            : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#FF0080' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cc0066'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF0080'}
        title="Build ID Card"
        aria-label="Go to Build ID Card"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* 2. BOTTOM ARROW (Home Page ↓ PFP Frame) */}
      <button
        onClick={() => handleFormatSelect('pfp')}
        className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white shadow-xl flex items-center justify-center group cursor-pointer border-2 border-white/30 transition-all duration-500 cubic-bezier(0.77,0,0.175,1) ${
          isLanding
            ? 'scale-100 opacity-100 pointer-events-auto hover:scale-110 active:scale-95'
            : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#FF0080' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cc0066'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF0080'}
        title="PFP Frame"
        aria-label="Go to PFP Frame"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* 3. LEFT BACK ARROW (Build ID Flow ← Back) */}
      <button
        onClick={handleBack}
        className={`fixed left-4 sm:left-8 top-1/4 sm:top-1/2 -translate-y-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white shadow-xl flex items-center justify-center group cursor-pointer border-2 border-white/30 transition-all duration-500 cubic-bezier(0.77,0,0.175,1) ${
          !isLanding && format === 'card'
            ? 'scale-100 opacity-100 pointer-events-auto hover:scale-110 active:scale-95'
            : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#FF0080' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cc0066'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF0080'}
        title="Back"
        aria-label="Go Back"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* 4. TOP BACK ARROW (PFP Frame Flow ↑ Back) */}
      <button
        onClick={handleBack}
        className={`fixed top-4 left-1/2 -translate-x-1/2 z-30 w-12 h-12 sm:w-14 sm:h-14 rounded-full text-white shadow-xl flex items-center justify-center group cursor-pointer border-2 border-white/30 transition-all duration-500 cubic-bezier(0.77,0,0.175,1) ${
          !isLanding && format === 'pfp'
            ? 'scale-100 opacity-100 pointer-events-auto hover:scale-110 active:scale-95'
            : 'scale-0 opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: '#FF0080' }}
        onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cc0066'}
        onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF0080'}
        title="Back"
        aria-label="Go Back"
      >
        <svg className="w-6 h-6 sm:w-7 sm:h-7 transition-transform group-hover:-translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* 5. SPINNING VINYL RECORD & AUDIO TOGGLE (Bottom-Left Corner) */}
      <div
        onClick={toggleAudio}
        className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 pointer-events-auto select-none cursor-pointer group"
        title={isPlaying ? "Click to Mute Music" : "Click to Play Music"}
      >
        <div className="relative w-32 h-32 sm:w-44 sm:h-44 md:w-52 md:h-52 flex items-center justify-center">
          {/* Vinyl Disc Image */}
          <img
            src="/vinal.png"
            alt="Vinyl Record"
            className={`w-full h-full object-contain animate-spin-vinyl transition-all duration-500 ease-out ${
              isPlaying
                ? 'brightness-105 opacity-100 drop-shadow-[0_10px_25px_rgba(0,0,0,0.6)] group-hover:scale-105'
                : 'brightness-45 opacity-60 grayscale-[60%] scale-95 drop-shadow-[0_5px_15px_rgba(0,0,0,0.4)]'
            }`}
            style={{ animationPlayState: isPlaying ? 'running' : 'paused' }}
          />

          {/* Elegant Neon Pink Slash Overlay when Muted */}
          {!isPlaying && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none animate-fadeIn">
              <svg className="w-full h-full p-2" viewBox="0 0 100 100">
                <defs>
                  <linearGradient id="slashGlow" x1="0%" y1="100%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#FF0080" />
                    <stop offset="50%" stopColor="#ff52b4" />
                    <stop offset="100%" stopColor="#FF0080" />
                  </linearGradient>
                  <filter id="neonShadow" x="-20%" y="-20%" width="140%" height="140%">
                    <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor="#FF0080" floodOpacity="0.8" />
                  </filter>
                </defs>

                {/* Dark outline for high contrast against background */}
                <line x1="24" y1="76" x2="76" y2="24" stroke="rgba(0, 0, 0, 0.75)" strokeWidth="5.5" strokeLinecap="round" />
                {/* Glowing neon pink slash */}
                <line x1="24" y1="76" x2="76" y2="24" stroke="url(#slashGlow)" strokeWidth="3" strokeLinecap="round" filter="url(#neonShadow)" />
              </svg>
            </div>
          )}
        </div>
      </div>


      {/* MOVING CONTENT LAYER */}
      <div
        className="relative z-10 w-full h-full"
        style={{
          transform: `translate3d(${translateX}vw, ${translateY}vh, 0)`,
          transition: 'transform 0.6s cubic-bezier(0.77, 0, 0.175, 1)',
          willChange: 'transform',
        }}
      >
        {/* Landing Screen at (0, 0) */}
        <div className="absolute top-0 left-0 w-full h-full overflow-y-auto">
          <LandingPage onFormatSelect={handleFormatSelect} />
        </div>

        {/* --- HORIZONTAL STAGE FOR BUILD ID (100vw, 0) --- */}
        <div className="absolute top-0 left-[100vw] w-full h-full overflow-y-auto">
          {format === 'card' && step === 'upload' && (
            <PhotoUpload
              onUpload={handlePhotoUpload}
              onBack={handleBack}
              format={format}
            />
          )}
          {format === 'card' && step === 'form' && (
            <BuilderForm
              onSubmit={handleFormSubmit}
              onBack={handleBack}
              builderTitle={builderTitle}
              onRerollTitle={handleRerollTitle}
            />
          )}
          {format === 'card' && step === 'preview' && (
            <Preview
              photo={photo}
              name={name}
              stack={stack}
              builderTitle={builderTitle}
              format={format}
              onBack={handleBack}
              onStartOver={handleStartOver}
            />
          )}
        </div>

        {/* --- VERTICAL STAGE FOR PFP FRAME (0, 100vh) --- */}
        <div className="absolute top-[100vh] left-0 w-full h-full overflow-y-auto">
          {format === 'pfp' && step === 'upload' && (
            <PhotoUpload
              onUpload={handlePhotoUpload}
              onBack={handleBack}
              format={format}
            />
          )}
          {format === 'pfp' && step === 'preview' && (
            <Preview
              photo={photo}
              name={name}
              stack={stack}
              builderTitle={builderTitle}
              format={format}
              onBack={handleBack}
              onStartOver={handleStartOver}
            />
          )}
        </div>
      </div>
    </div>
  )
}
