import { useState } from 'react'

export default function BuilderForm({ onSubmit, onBack, builderTitle, onRerollTitle }) {
  const [name, setName] = useState('')
  const [stack, setStack] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), stack: stack.trim() || 'Builder' })
  }

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-4 animate-fadeIn">
      <div className="relative z-10 max-w-md w-full green-paper-card p-6 sm:p-8 relative overflow-hidden group">
        
        {/* Top Striped Tape Accent */}
        <div
          className="absolute top-0 left-0 right-0 h-2 opacity-80"
          style={{ background: "repeating-linear-gradient(45deg, #1a5c2a, #1a5c2a 8px, #e84393 8px, #e84393 16px, #e8d44d 16px, #e8d44d 24px)" }}
        />

        {/* Step Badge */}
        <div className="flex items-center justify-between mb-3 pt-2">
          <span className="font-mono text-[11px] tracking-widest text-[#FF0080] uppercase font-bold bg-[#FF0080]/15 px-2.5 py-1 rounded-full border border-[#FF0080]/30">
            02 • BUILDER DETAILS
          </span>
          <span className="font-mono text-[10px] text-hh-yellow/60 uppercase tracking-widest">
            HH GOA 2026
          </span>
        </div>

        <h2 className="text-hh-yellow font-display text-2xl sm:text-3xl mb-1 text-center tracking-wide drop-shadow-md">
          Your Details
        </h2>
        <p className="text-white/70 font-mono text-[11px] sm:text-xs mb-6 text-center">
          Personalize your official Hacker House Builder Pass
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-hh-yellow font-mono tracking-wider uppercase text-xs mb-2 font-bold flex items-center justify-between">
              <span>Full Name</span>
              <span className="text-[#FF0080]">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Satoshi Nakamoto"
              className="w-full bg-black/40 border-2 border-hh-yellow/30 focus:border-[#FF0080] rounded-xl px-4 py-3 text-white placeholder-white/30 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF0080]/30 transition-all shadow-inner"
              required
            />
          </div>

          <div>
            <label className="block text-hh-yellow font-mono tracking-wider uppercase text-xs mb-2 font-bold">
              Stack / Role
            </label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              placeholder="e.g. Full-Stack / Rust / AI"
              className="w-full bg-black/40 border-2 border-hh-yellow/30 focus:border-[#FF0080] rounded-xl px-4 py-3 text-white placeholder-white/30 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#FF0080]/30 transition-all shadow-inner"
            />
          </div>

          {/* Builder Title Badge Box */}
          <div className="bg-black/50 border border-hh-yellow/40 rounded-xl p-4 relative overflow-hidden group/badge shadow-inner">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-hh-yellow/60 font-mono text-[11px] uppercase tracking-wider">Assigned Title:</span>
              {onRerollTitle && (
                <button
                  type="button"
                  onClick={onRerollTitle}
                  className="text-[#FF0080] hover:text-white font-mono text-[10px] uppercase font-bold tracking-widest bg-[#FF0080]/20 hover:bg-[#FF0080] px-2.5 py-1 rounded-md transition-colors cursor-pointer flex items-center gap-1 active:scale-95"
                  title="Randomize Title"
                >
                  <span>Shuffle</span>
                  <span className="text-xs">↻</span>
                </button>
              )}
            </div>
            <p className="text-hh-yellow font-display text-lg sm:text-xl tracking-wide drop-shadow-sm">
              {builderTitle}
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF0080] hover:bg-[#cc0066] text-white font-display text-base py-3.5 rounded-xl transition-all cursor-pointer tracking-wider shadow-lg hover:shadow-[0_0_25px_rgba(255,0,128,0.5)] flex items-center justify-center gap-2 mt-2 active:scale-98"
          >
            <span>Generate Pass</span>
            <span className="text-lg">→</span>
          </button>
        </form>
      </div>
    </div>
  )
}
