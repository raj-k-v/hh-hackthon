export default function LandingPage({ onFormatSelect }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-hh-green-dark via-hh-green to-hh-green-light relative overflow-hidden">
      {/* Pixel grid background */}
      <div className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `radial-gradient(circle, #e8d44d 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      {/* Large centered dot pattern */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-15"
        style={{
          backgroundImage: `radial-gradient(circle, #e8d44d 2px, transparent 2px)`,
          backgroundSize: '16px 16px',
        }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4">
        <div className="flex flex-col leading-none">
          <span className="text-hh-yellow font-mono text-xl sm:text-2xl font-bold tracking-tight">2:47 PM</span>
          <span className="text-hh-yellow font-mono text-sm sm:text-base tracking-widest">STUDIO</span>
        </div>
        <div className="flex items-center gap-4 sm:gap-6">
          <span className="text-white/70 font-mono text-xs sm:text-sm tracking-widest uppercase hidden sm:block">Check Hype</span>
          <button
            onClick={() => document.getElementById('formats').scrollIntoView({ behavior: 'smooth' })}
            className="bg-hh-yellow text-hh-green-dark font-mono font-bold text-sm sm:text-base px-5 py-2.5 border-2 border-hh-pink border-dashed hover:bg-hh-yellow-light transition-colors cursor-pointer"
          >
            CREATE
          </button>
        </div>
      </div>

      {/* Hero section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-8 sm:pt-16 pb-12">
        <h1 className="text-hh-yellow font-display text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-bold text-center leading-none tracking-tight drop-shadow-lg">
          HACKER
          <span className="relative inline-block mx-2 sm:mx-4">
            HOUSE
            <span className="absolute -top-4 sm:-top-6 left-1/2 -translate-x-1/2 text-hh-pink font-display text-xl sm:text-3xl md:text-4xl font-bold rotate-[-8deg] drop-shadow-md" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.3)'}}>
              गोवा
            </span>
          </span>
        </h1>

        {/* Info bar */}
        <div className="mt-8 sm:mt-12 bg-black/30 backdrop-blur-sm rounded-full px-6 sm:px-10 py-3 sm:py-4 flex flex-wrap items-center justify-center gap-2 sm:gap-4">
          <span className="text-hh-yellow font-mono text-xs sm:text-sm tracking-wider">GOA, INDIA</span>
          <span className="text-hh-yellow/50">•</span>
          <span className="text-hh-yellow font-mono text-xs sm:text-sm tracking-wider">28 - 31 OCT 2026</span>
          <span className="text-hh-yellow/50 hidden sm:inline">•</span>
          <span className="text-hh-yellow font-mono text-xs sm:text-sm tracking-wider hidden sm:inline">2:47 PM STUDIO</span>
        </div>
      </div>

      {/* Format selection */}
      <div id="formats" className="relative z-10 px-4 sm:px-8 pb-16 max-w-4xl mx-auto">
        <p className="text-hh-yellow/70 font-mono text-xs sm:text-sm text-center mb-6 tracking-wider uppercase">Choose your format</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <button
            onClick={() => onFormatSelect('pfp')}
            className="group bg-hh-yellow/10 border-2 border-hh-yellow/30 rounded-2xl p-6 sm:p-8 text-left hover:bg-hh-yellow/20 hover:border-hh-yellow transition-all cursor-pointer"
          >
            <div className="text-3xl sm:text-4xl mb-3">🖼️</div>
            <h3 className="text-hh-yellow font-display text-lg sm:text-xl font-bold mb-2">PFP Frame</h3>
            <p className="text-white/60 font-mono text-xs sm:text-sm leading-relaxed">
              A frame that sits around your photo — ready-to-use X profile picture with HH Goa branding.
            </p>
          </button>
          <button
            onClick={() => onFormatSelect('card')}
            className="group bg-hh-yellow/10 border-2 border-hh-yellow/30 rounded-2xl p-6 sm:p-8 text-left hover:bg-hh-yellow/20 hover:border-hh-yellow transition-all cursor-pointer"
          >
            <div className="text-3xl sm:text-4xl mb-3">🪪</div>
            <h3 className="text-hh-yellow font-display text-lg sm:text-xl font-bold mb-2">Builder ID Card</h3>
            <p className="text-white/60 font-mono text-xs sm:text-sm leading-relaxed">
              An event badge with your photo, name, stack & a fun builder title. Post as an image.
            </p>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center pb-8 px-4">
        <p className="text-hh-yellow/40 font-mono text-xs tracking-wider">
          #FrameInGoa • HH GOA 2026 • August 28–31, 2026 • Goa, India
        </p>
        <p className="text-hh-yellow/30 font-mono text-xs mt-1">
          Built for HH Goa 2026 builders & attendees.
        </p>
      </div>
    </div>
  )
}
