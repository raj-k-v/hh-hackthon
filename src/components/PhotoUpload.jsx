import { useState, useRef, useCallback } from 'react'

export default function PhotoUpload({ onUpload, onBack, format }) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const processFile = useCallback((file) => {
    if (!file) return
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
    const isImage = validTypes.includes(file.type) || file.name.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)
    if (!isImage) {
      alert('Please upload a valid image file (JPG, PNG, WEBP, or HEIC).')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }, [processFile])

  const handleChange = useCallback((e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }, [processFile])

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
            {format === 'pfp' ? 'PFP FRAME' : '01 • PHOTO'}
          </span>
          <span className="font-mono text-[10px] text-hh-yellow/60 uppercase tracking-widest">
            HH GOA 2026
          </span>
        </div>

        <h2 className="text-hh-yellow font-display text-2xl sm:text-3xl mb-1 text-center tracking-wide drop-shadow-md">
          {format === 'pfp' ? 'Upload Your Photo' : 'Builder Photo'}
        </h2>
        <p className="text-white/70 font-mono text-[11px] sm:text-xs mb-6 text-center">
          JPG, PNG, WEBP or HEIC • Max 10MB
        </p>

        {!preview ? (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={`
              relative border-2 border-dashed rounded-2xl p-8 sm:p-10 text-center cursor-pointer transition-all duration-300 group/drop bg-black/40 backdrop-blur-md overflow-hidden
              ${dragActive
                ? 'border-[#FF0080] bg-[#FF0080]/15 scale-[1.02]'
                : 'border-hh-yellow/40 hover:border-[#FF0080] hover:bg-black/60 shadow-inner'
              }
            `}
          >
            {/* Corner Bracket Accents */}
            <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-hh-yellow/60 group-hover/drop:border-[#FF0080]" />
            <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-hh-yellow/60 group-hover/drop:border-[#FF0080]" />
            <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-hh-yellow/60 group-hover/drop:border-[#FF0080]" />
            <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-hh-yellow/60 group-hover/drop:border-[#FF0080]" />

            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
              onChange={handleChange}
              className="hidden"
            />

            {/* Glowing Upload Icon Circle */}
            <div className="w-16 h-16 rounded-full border-2 border-hh-yellow/50 group-hover/drop:border-[#FF0080] group-hover/drop:scale-110 flex items-center justify-center mx-auto mb-4 bg-black/40 transition-all duration-300 shadow-[0_0_15px_rgba(232,212,77,0.15)] group-hover/drop:shadow-[0_0_20px_rgba(255,0,128,0.4)]">
              <svg className="w-8 h-8 text-hh-yellow group-hover/drop:text-[#FF0080] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>

            <p className="text-hh-yellow font-display text-base sm:text-lg mb-1 tracking-wide group-hover/drop:text-white transition-colors">
              Drop photo here or click to browse
            </p>
            <p className="text-white/40 font-mono text-[11px] mb-4">
              High resolution photo recommended
            </p>
            <span className="inline-block px-4 py-1.5 rounded-full bg-hh-yellow/10 border border-hh-yellow/40 text-hh-yellow font-mono text-xs uppercase tracking-wider group-hover/drop:bg-[#FF0080] group-hover/drop:text-white group-hover/drop:border-[#FF0080] transition-all shadow-md">
              Choose File
            </span>
          </div>
        ) : (
          <div className="space-y-4 animate-fadeIn">
            <div className="rounded-2xl overflow-hidden border-2 border-hh-yellow/40 bg-black/40 p-2 shadow-inner">
              <img
                src={preview}
                alt="Uploaded preview"
                className="w-full max-h-[260px] sm:max-h-[280px] object-contain rounded-xl mx-auto"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPreview(null)}
                className="flex-1 bg-black/40 text-white/80 hover:text-white font-mono text-xs py-3 rounded-xl border border-white/20 hover:border-white/40 hover:bg-black/60 transition-all cursor-pointer uppercase tracking-wider"
              >
                ← Change
              </button>
              <button
                onClick={() => onUpload(preview)}
                className="flex-1 bg-[#FF0080] hover:bg-[#cc0066] text-white font-display text-sm py-3 rounded-xl transition-all cursor-pointer tracking-wider shadow-lg hover:shadow-[0_0_20px_rgba(255,0,128,0.5)] flex items-center justify-center gap-1.5"
              >
                <span>Use Photo</span>
                <span className="text-base">→</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
