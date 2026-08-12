import { useState } from 'react'

export default function BuilderForm({ onSubmit, onBack, builderTitle }) {
  const [name, setName] = useState('')
  const [stack, setStack] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), stack: stack.trim() || 'Builder' })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-hh-green-dark via-hh-green to-hh-green-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, #e8d44d 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 sm:py-12">
        <button onClick={onBack} className="text-hh-yellow/60 hover:text-hh-yellow font-mono text-sm mb-6 flex items-center gap-2 cursor-pointer">
          ← Back
        </button>

        <h2 className="text-hh-yellow font-display text-2xl sm:text-3xl font-bold mb-6">
          Your Details
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-hh-yellow font-display font-semibold text-sm mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Satoshi Nakamoto"
              className="w-full bg-hh-cream/10 border border-hh-yellow/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 font-mono text-sm focus:outline-none focus:border-hh-yellow/60 transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-hh-yellow font-display font-semibold text-sm mb-2">
              Stack / Role
            </label>
            <input
              type="text"
              value={stack}
              onChange={(e) => setStack(e.target.value)}
              placeholder="e.g. Full-Stack / Rust / AI"
              className="w-full bg-hh-cream/10 border border-hh-yellow/20 rounded-xl px-4 py-3.5 text-white placeholder-white/30 font-mono text-sm focus:outline-none focus:border-hh-yellow/60 transition-colors"
            />
          </div>

          <div className="bg-hh-yellow/10 border border-hh-yellow/20 rounded-xl p-4">
            <p className="text-hh-yellow/60 font-mono text-xs mb-1">Your generated builder title:</p>
            <p className="text-hh-yellow font-display font-bold text-lg">{builderTitle}</p>
          </div>

          <button
            type="submit"
            className="w-full bg-hh-yellow text-hh-green-dark font-mono font-bold text-base py-4 rounded-xl hover:bg-hh-yellow-light transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Generate Pass →
          </button>
        </form>
      </div>
    </div>
  )
}
