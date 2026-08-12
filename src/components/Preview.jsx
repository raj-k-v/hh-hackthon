import { useRef, useEffect, useState, useCallback } from 'react'

if (typeof CanvasRenderingContext2D !== 'undefined' && !CanvasRenderingContext2D.prototype.roundRect) {
  CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, radii) {
    const r = Array.isArray(radii) ? radii : [radii, radii, radii, radii]
    const [tl, tr, br, bl] = r.map(v => Math.min(v || 0, w / 2, h / 2))
    this.moveTo(x + tl, y)
    this.lineTo(x + w - tr, y)
    this.quadraticCurveTo(x + w, y, x + w, y + tr)
    this.lineTo(x + w, y + h - br)
    this.quadraticCurveTo(x + w, y + h, x + w - br, y + h)
    this.lineTo(x + bl, y + h)
    this.quadraticCurveTo(x, y + h, x, y + h - bl)
    this.lineTo(x, y + tl)
    this.quadraticCurveTo(x, y, x + tl, y)
    this.closePath()
  }
}

const PFP_SIZE = 1080
const CARD_WIDTH = 1080
const CARD_HEIGHT = 1350

function drawPFPFrame(ctx, img) {
  const size = PFP_SIZE
  ctx.canvas.width = size
  ctx.canvas.height = size

  // Draw photo centered and cropped to fill circle area
  const padding = 80
  const photoSize = size - padding * 2
  const photoX = padding
  const photoY = padding

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, size, size)
  bgGrad.addColorStop(0, '#0d3318')
  bgGrad.addColorStop(0.5, '#1a5c2a')
  bgGrad.addColorStop(1, '#2d8a42')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, size, size)

  // Pixel dots background
  ctx.fillStyle = 'rgba(232, 212, 77, 0.08)'
  for (let x = 0; x < size; x += 16) {
    for (let y = 0; y < size; y += 16) {
      ctx.fillRect(x, y, 3, 3)
    }
  }

  // Draw photo in circle
  ctx.save()
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, photoSize / 2, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()

  // Cover-fit the image
  const imgAspect = img.width / img.height
  let sx, sy, sw, sh
  if (imgAspect > 1) {
    sh = img.height
    sw = img.height
    sx = (img.width - sw) / 2
    sy = 0
  } else {
    sw = img.width
    sh = img.width
    sx = 0
    sy = (img.height - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoSize, photoSize)
  ctx.restore()

  // Circle border
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, photoSize / 2, 0, Math.PI * 2)
  ctx.strokeStyle = '#e8d44d'
  ctx.lineWidth = 8
  ctx.stroke()

  // Outer decorative ring
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, photoSize / 2 + 16, 0, Math.PI * 2)
  ctx.strokeStyle = 'rgba(232, 212, 77, 0.3)'
  ctx.lineWidth = 3
  ctx.stroke()

  // Bottom banner
  const bannerH = 120
  const bannerY = size - bannerH - 40
  ctx.fillStyle = '#0d3318'
  ctx.beginPath()
  ctx.roundRect(60, bannerY, size - 120, bannerH, 16)
  ctx.fill()
  ctx.strokeStyle = '#e8d44d'
  ctx.lineWidth = 3
  ctx.stroke()

  // Banner text
  ctx.fillStyle = '#e8d44d'
  ctx.font = 'bold 32px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('HACKER HOUSE', size / 2, bannerY + 45)

  ctx.fillStyle = 'rgba(232, 212, 77, 0.7)'
  ctx.font = '22px "Space Mono", monospace'
  ctx.fillText('GOA 2026', size / 2, bannerY + 80)

  // Corner accents
  const accentSize = 30
  ctx.strokeStyle = '#e84393'
  ctx.lineWidth = 4

  // Top-left
  ctx.beginPath()
  ctx.moveTo(30, 30 + accentSize)
  ctx.lineTo(30, 30)
  ctx.lineTo(30 + accentSize, 30)
  ctx.stroke()

  // Top-right
  ctx.beginPath()
  ctx.moveTo(size - 30 - accentSize, 30)
  ctx.lineTo(size - 30, 30)
  ctx.lineTo(size - 30, 30 + accentSize)
  ctx.stroke()

  // Bottom-left
  ctx.beginPath()
  ctx.moveTo(30, size - 30 - accentSize)
  ctx.lineTo(30, size - 30)
  ctx.lineTo(30 + accentSize, size - 30)
  ctx.stroke()

  // Bottom-right
  ctx.beginPath()
  ctx.moveTo(size - 30 - accentSize, size - 30)
  ctx.lineTo(size - 30, size - 30)
  ctx.lineTo(size - 30, size - 30 - accentSize)
  ctx.stroke()

  // Small dots pattern top-right
  ctx.fillStyle = 'rgba(232, 212, 77, 0.15)'
  for (let i = 0; i < 8; i++) {
    for (let j = 0; j < 4; j++) {
      ctx.fillRect(size - 200 + i * 12, 60 + j * 12, 4, 4)
    }
  }
}

function drawBuilderCard(ctx, img, name, stack, builderTitle) {
  ctx.canvas.width = CARD_WIDTH
  ctx.canvas.height = CARD_HEIGHT

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, CARD_HEIGHT)
  bgGrad.addColorStop(0, '#fdf6e3')
  bgGrad.addColorStop(1, '#f5e8c0')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, CARD_WIDTH, CARD_HEIGHT)

  // Subtle dot pattern
  ctx.fillStyle = 'rgba(26, 92, 42, 0.04)'
  for (let x = 0; x < CARD_WIDTH; x += 20) {
    for (let y = 0; y < CARD_HEIGHT; y += 20) {
      ctx.fillRect(x, y, 3, 3)
    }
  }

  // Card background
  const cardMargin = 60
  const cardW = CARD_WIDTH - cardMargin * 2
  const cardH = CARD_HEIGHT - cardMargin * 2
  const cardX = cardMargin
  const cardY = cardMargin

  // Card shadow
  ctx.shadowColor = 'rgba(0,0,0,0.15)'
  ctx.shadowBlur = 30
  ctx.shadowOffsetY = 10

  // Card shape
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, cardH, 24)
  ctx.fill()

  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  // Top green bar
  const barH = 100
  ctx.fillStyle = '#1a5c2a'
  ctx.beginPath()
  ctx.roundRect(cardX, cardY, cardW, barH, [24, 24, 0, 0])
  ctx.fill()

  // Top bar text
  ctx.fillStyle = '#e8d44d'
  ctx.font = 'bold 36px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('HACKER HOUSE', CARD_WIDTH / 2, cardY + 45)
  ctx.fillStyle = 'rgba(232, 212, 77, 0.8)'
  ctx.font = '20px "Space Mono", monospace'
  ctx.fillText('GOA 2026 • BUILDER PASS', CARD_WIDTH / 2, cardY + 78)

  // Photo area - circle
  const photoRadius = 160
  const photoCenterX = CARD_WIDTH / 2
  const photoCenterY = cardY + barH + 50 + photoRadius

  ctx.save()
  ctx.beginPath()
  ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2)
  ctx.closePath()
  ctx.clip()

  // Cover-fit
  const imgAspect = img.width / img.height
  let sx, sy, sw, sh
  if (imgAspect > 1) {
    sh = img.height
    sw = img.height
    sx = (img.width - sw) / 2
    sy = 0
  } else {
    sw = img.width
    sh = img.width
    sx = 0
    sy = (img.height - sh) / 2
  }
  ctx.drawImage(img, sx, sy, sw, sh, photoCenterX - photoRadius, photoCenterY - photoRadius, photoRadius * 2, photoRadius * 2)
  ctx.restore()

  // Photo border
  ctx.beginPath()
  ctx.arc(photoCenterX, photoCenterY, photoRadius, 0, Math.PI * 2)
  ctx.strokeStyle = '#1a5c2a'
  ctx.lineWidth = 6
  ctx.stroke()

  // Outer ring
  ctx.beginPath()
  ctx.arc(photoCenterX, photoCenterY, photoRadius + 8, 0, Math.PI * 2)
  ctx.strokeStyle = '#e8d44d'
  ctx.lineWidth = 3
  ctx.stroke()

  // Name
  const nameY = photoCenterY + photoRadius + 60
  ctx.fillStyle = '#1a5c2a'
  ctx.font = 'bold 48px "Space Grotesk", sans-serif'
  ctx.textAlign = 'center'
  ctx.fillText(name.toUpperCase(), CARD_WIDTH / 2, nameY)

  // Underline accent
  const textWidth = ctx.measureText(name.toUpperCase()).width
  ctx.strokeStyle = '#e84393'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.moveTo(CARD_WIDTH / 2 - textWidth / 2 - 10, nameY + 10)
  ctx.lineTo(CARD_WIDTH / 2 + textWidth / 2 + 10, nameY + 10)
  ctx.stroke()

  // Builder title
  ctx.fillStyle = '#e84393'
  ctx.font = 'bold 30px "Space Mono", monospace'
  ctx.fillText(builderTitle, CARD_WIDTH / 2, nameY + 60)

  // Stack / Role
  if (stack) {
    ctx.fillStyle = '#1a5c2a'
    ctx.font = '26px "Space Mono", monospace'
    ctx.fillText(stack, CARD_WIDTH / 2, nameY + 110)
  }

  // Bottom info bar
  const bottomBarY = cardY + cardH - 120
  ctx.fillStyle = '#1a5c2a'
  ctx.beginPath()
  ctx.roundRect(cardX + 30, bottomBarY, cardW - 60, 70, 12)
  ctx.fill()

  ctx.fillStyle = '#e8d44d'
  ctx.font = '18px "Space Mono", monospace'
  ctx.fillText('GOA, INDIA • 28-31 OCT 2026 • #FrameInGoa', CARD_WIDTH / 2, bottomBarY + 44)

  // Decorative corner dots
  ctx.fillStyle = '#e84393'
  const corners = [
    [cardX + 20, cardY + 20],
    [cardX + cardW - 20, cardY + 20],
    [cardX + 20, cardY + cardH - 20],
    [cardX + cardW - 20, cardY + cardH - 20],
  ]
  corners.forEach(([cx, cy]) => {
    ctx.beginPath()
    ctx.arc(cx, cy, 6, 0, Math.PI * 2)
    ctx.fill()
  })

  // Small dot pattern decorations
  ctx.fillStyle = 'rgba(26, 92, 42, 0.08)'
  for (let i = 0; i < 6; i++) {
    for (let j = 0; j < 3; j++) {
      ctx.fillRect(cardX + 30 + i * 12, cardY + cardH - 50 + j * 12, 4, 4)
      ctx.fillRect(cardX + cardW - 110 + i * 12, cardY + cardH - 50 + j * 12, 4, 4)
    }
  }
}

export default function Preview({ photo, name, stack, builderTitle, format, onBack, onStartOver }) {
  const canvasRef = useRef(null)
  const [generating, setGenerating] = useState(true)
  const [generatedUrl, setGeneratedUrl] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !photo) return

    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => {
      if (format === 'pfp') {
        drawPFPFrame(ctx, img)
      } else {
        drawBuilderCard(ctx, img, name, stack, builderTitle)
      }
      setGenerating(false)
      setGeneratedUrl(canvas.toDataURL('image/png'))
    }
    img.src = photo
  }, [photo, format, name, stack, builderTitle])

  const handleDownload = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = format === 'pfp' ? 'hh-goa-2026-pfp.png' : 'hh-goa-2026-pass.png'
    link.href = canvas.toDataURL('image/png', 1.0)
    link.click()
  }, [format])

  const handleShareX = useCallback(() => {
    const text = encodeURIComponent(
      `Just generated my ${format === 'pfp' ? 'PFP frame' : 'Builder ID'} for HH Goa 2026! 🇮🇳🔥\n\n#FrameInGoa #HHGoa2026 #HackerHouse`
    )
    window.open(`https://x.com/intent/tweet?text=${text}`, '_blank')
  }, [format])

  return (
    <div className="min-h-screen bg-gradient-to-b from-hh-green-dark via-hh-green to-hh-green-light relative overflow-hidden">
      <div className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle, #e8d44d 1px, transparent 1px)`,
          backgroundSize: '20px 20px',
        }}
      />

      <div className="relative z-10 max-w-lg mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-6">
          <button onClick={onBack} className="text-hh-yellow/60 hover:text-hh-yellow font-mono text-sm flex items-center gap-2 cursor-pointer">
            ← Back
          </button>
          <button onClick={onStartOver} className="text-hh-yellow/60 hover:text-hh-yellow font-mono text-sm cursor-pointer">
            Start Over
          </button>
        </div>

        <h2 className="text-hh-yellow font-display text-2xl sm:text-3xl font-bold mb-6 text-center">
          Your {format === 'pfp' ? 'PFP Frame' : 'Builder Pass'}
        </h2>

        {/* Canvas (hidden but rendered) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Preview */}
        {generating ? (
          <div className="bg-white/5 rounded-2xl border border-hh-yellow/20 p-10 text-center">
            <p className="text-hh-yellow font-mono text-sm animate-pulse">Generating...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border-2 border-hh-yellow/30 bg-black/20">
              {generatedUrl && (
                <img
                  src={generatedUrl}
                  alt="Generated pass"
                  className="w-full"
                />
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleDownload}
                className="flex-1 bg-hh-yellow text-hh-green-dark font-mono font-bold text-sm py-3.5 rounded-xl hover:bg-hh-yellow-light transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
              <button
                onClick={handleShareX}
                className="flex-1 bg-[#1d1d1f] text-white font-mono font-bold text-sm py-3.5 rounded-xl hover:bg-[#333] transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
            </div>

            <p className="text-hh-yellow/40 font-mono text-xs text-center mt-2">
              Download the image, then attach it to your tweet with #FrameInGoa
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
