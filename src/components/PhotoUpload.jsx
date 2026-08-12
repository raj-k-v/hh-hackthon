import { useState, useRef, useCallback } from 'react'

export default function PhotoUpload({ onUpload, onBack, format }) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState(null)
  const inputRef = useRef(null)

  const processFile = useCallback((file) => {
    if (!file) return

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
    if (!validTypes.includes(file.type) && !file.name.match(/\.(jpg|jpeg|png|webp|heic|heif)$/i)) {
      alert('Please upload a JPG, PNG, WEBP, or HEIC image.')
      return
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File is too large. Max 10MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target.result)
    }
    reader.readAsDataURL(file)
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }, [processFile])

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleChange = useCallback((e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }, [processFile])

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

        <h2 className="text-hh-yellow font-display text-2xl sm:text-3xl font-bold mb-2">
          {format === 'pfp' ? 'Upload Your Photo' : 'Builder Photo'}
        </h2>
        <p className="text-white/50 font-mono text-xs sm:text-sm mb-8">
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
              border-2 border-dashed rounded-2xl p-10 sm:p-14 text-center cursor-pointer transition-all
              ${dragActive
                ? 'border-hh-yellow bg-hh-yellow/10'
                : 'border-hh-yellow/30 bg-hh-yellow/5 hover:border-hh-yellow/60 hover:bg-hh-yellow/10'
              }
            `}
          >
            <input
              ref={inputRef}
              type="file"
              accept=".jpg,.jpeg,.png,.webp,.heic,.heif,image/jpeg,image/png,image/webp,image/heic,image/heif"
              onChange={handleChange}
              className="hidden"
            />
            <div className="w-16 h-16 rounded-full border-2 border-hh-yellow/40 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-hh-yellow/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
            </div>
            <p className="text-hh-yellow font-display font-semibold text-base sm:text-lg mb-1">
              Drop your photo here or click to browse
            </p>
            <p className="text-white/40 font-mono text-xs">
              JPG, PNG, WEBP or HEIC • Max 10MB
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border-2 border-hh-yellow/30 bg-black/20">
              <img
                src={preview}
                alt="Uploaded preview"
                className="w-full max-h-[350px] object-contain"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setPreview(null)}
                className="flex-1 bg-white/10 text-white font-mono text-sm py-3 rounded-xl hover:bg-white/20 transition-colors cursor-pointer"
              >
                Choose Different
              </button>
              <button
                onClick={() => onUpload(preview)}
                className="flex-1 bg-hh-yellow text-hh-green-dark font-mono font-bold text-sm py-3 rounded-xl hover:bg-hh-yellow-light transition-colors cursor-pointer"
              >
                Use This Photo →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
