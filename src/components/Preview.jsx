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

function drawStripedBorderCanvas(ctx, width, height, scaleX) {
  const borderWidth = Math.max(10, Math.round(14 * scaleX))

  const patternCanvas = document.createElement('canvas')
  const pSize = 36
  patternCanvas.width = pSize
  patternCanvas.height = pSize
  const pCtx = patternCanvas.getContext('2d')

  pCtx.fillStyle = '#1a5c2a'
  pCtx.fillRect(0, 0, pSize, pSize)

  const step = pSize / 3
  for (let offset = -pSize * 2; offset < pSize * 2; offset += step * 3) {
    pCtx.fillStyle = '#e84393'
    pCtx.beginPath()
    pCtx.moveTo(offset, 0)
    pCtx.lineTo(offset + step, 0)
    pCtx.lineTo(offset + step + pSize, pSize)
    pCtx.lineTo(offset + pSize, pSize)
    pCtx.closePath()
    pCtx.fill()

    pCtx.fillStyle = '#e8d44d'
    pCtx.beginPath()
    pCtx.moveTo(offset + step, 0)
    pCtx.lineTo(offset + step * 2, 0)
    pCtx.lineTo(offset + step * 2 + pSize, pSize)
    pCtx.lineTo(offset + step + pSize, pSize)
    pCtx.closePath()
    pCtx.fill()
  }

  const pattern = ctx.createPattern(patternCanvas, 'repeat')

  ctx.save()
  ctx.lineWidth = borderWidth * 2
  ctx.strokeStyle = pattern
  ctx.beginPath()
  ctx.roundRect(0, 0, width, height, 16 * scaleX)
  ctx.stroke()
  ctx.restore()
}

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
  ctx.clearRect(0, 0, size, size)

  // 1. User photo (cover-fit into full square canvas)
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

  ctx.drawImage(img, sx, sy, sw, sh, 0, 0, size, size)

  // 2. Overlay gradient at bottom for text contrast
  const grad = ctx.createLinearGradient(0, size - 300, 0, size)
  grad.addColorStop(0, 'rgba(0, 0, 0, 0)')
  grad.addColorStop(0.6, 'rgba(0, 95, 50, 0.85)')
  grad.addColorStop(1, 'rgba(0, 95, 50, 0.98)')
  ctx.fillStyle = grad
  ctx.fillRect(0, size - 300, size, 300)

  // 3. Decorative Frame Elements
  const inset = 40
  ctx.strokeStyle = '#e8d44d'
  ctx.lineWidth = 12
  ctx.strokeRect(inset, inset, size - inset * 2, size - inset * 2)

  // Inner thin border
  ctx.strokeStyle = '#005f32'
  ctx.lineWidth = 3
  ctx.strokeRect(inset + 10, inset + 10, size - (inset + 10) * 2, size - (inset + 10) * 2)

  // Banner text at bottom
  const bannerY = size - 160
  ctx.fillStyle = '#e8d44d'
  ctx.font = 'bold 32px "Space Mono", monospace'
  ctx.textAlign = 'center'
  ctx.fillText('HACKER HOUSE', size / 2, bannerY + 45)

  ctx.fillStyle = 'rgba(232, 212, 77, 0.7)'
  ctx.font = '22px "Space Mono", monospace'
  ctx.fillText('GOA 2026', size / 2, bannerY + 80)

  // Draw 4-sided uniform striped border onto Canvas
  drawStripedBorderCanvas(ctx, size, size, 1)
}

function drawBuilderCard(ctx, img, frameImg, name, stack, builderTitle) {
  const width = frameImg.naturalWidth || frameImg.width || 1080
  const height = frameImg.naturalHeight || frameImg.height || 1350

  ctx.canvas.width = width
  ctx.canvas.height = height

  ctx.clearRect(0, 0, width, height)

  // 1. Draw base frame id.png
  ctx.drawImage(frameImg, 0, 0, width, height)

  const scaleX = width / 1080
  const scaleY = height / 1350

  // 2. Draw Profile Photo with exact aspect ratio cover-fit (no stretching)
  const photoW = 340 * scaleX
  const photoH = 410 * scaleY
  const photoX = (width - photoW) / 2
  const photoY = 320 * scaleY
  const borderRadius = 18 * scaleX

  const targetAspect = photoW / photoH
  const imgAspect = img.width / img.height
  let sx, sy, sw, sh
  if (imgAspect > targetAspect) {
    sh = img.height
    sw = img.height * targetAspect
    sx = (img.width - sw) / 2
    sy = 0
  } else {
    sw = img.width
    sh = img.width / targetAspect
    sx = 0
    sy = (img.height - sh) / 2
  }

  ctx.save()
  ctx.beginPath()
  ctx.roundRect(photoX, photoY, photoW, photoH, borderRadius)
  ctx.closePath()
  ctx.clip()
  ctx.drawImage(img, sx, sy, sw, sh, photoX, photoY, photoW, photoH)
  ctx.restore()

  // Photo border stroke
  ctx.beginPath()
  ctx.roundRect(photoX, photoY, photoW, photoH, borderRadius)
  ctx.strokeStyle = 'rgba(232, 212, 77, 0.8)'
  ctx.lineWidth = 3.5 * scaleX
  ctx.stroke()

  // 3. Draw Name next to NAME: line (Bigger, resting right on line)
  const nameX = 425 * scaleX
  const nameY = 825 * scaleY
  ctx.save()
  ctx.fillStyle = '#FF0080'
  ctx.font = `bold ${Math.round(44 * scaleX)}px "Anton", "Space Grotesk", sans-serif`
  ctx.textAlign = 'left'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)'
  ctx.shadowBlur = 4
  ctx.shadowOffsetY = 1 * scaleY
  ctx.fillText(name.toUpperCase(), nameX, nameY)
  ctx.restore()

  // 4. Draw Stack on ROLE: line
  const roleX = 425 * scaleX
  const roleY = 897 * scaleY
  const displayStack = (stack || 'BUILDER').toUpperCase()
  ctx.save()
  ctx.fillStyle = '#005f32'
  ctx.font = `900 ${Math.round(34 * scaleX)}px "Space Mono", monospace`
  ctx.textAlign = 'left'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.25)'
  ctx.shadowBlur = 3
  ctx.shadowOffsetY = 1 * scaleY
  ctx.fillText(displayStack, roleX, roleY)
  ctx.restore()

  // 5. Draw Assigned Builder Title at bottom of the card (Larger & Bolder)
  if (builderTitle) {
    const titleText = builderTitle.toUpperCase()
    const titleY = 1282 * scaleY
    const titleX = width / 2

    ctx.save()
    ctx.textAlign = 'center'
    ctx.font = `bold ${Math.round(40 * scaleX)}px "Anton", "Space Grotesk", sans-serif`

    // Badge metrics & pill container
    const metrics = ctx.measureText(titleText)
    const paddingX = 30 * scaleX
    const badgeW = metrics.width + paddingX * 2
    const badgeH = 56 * scaleY
    const badgeX = titleX - badgeW / 2
    const badgeY = titleY - 40 * scaleY

    // Draw pill badge backdrop
    ctx.beginPath()
    ctx.roundRect(badgeX, badgeY, badgeW, badgeH, 14 * scaleX)
    ctx.fillStyle = 'rgba(0, 50, 25, 0.95)'
    ctx.fill()
    ctx.strokeStyle = '#e8d44d'
    ctx.lineWidth = 3.5 * scaleX
    ctx.stroke()

    // Draw Title text
    ctx.fillStyle = '#e8d44d'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
    ctx.shadowBlur = 5
    ctx.fillText(titleText, titleX, titleY)
    ctx.restore()
  }

  // 6. Draw 4-sided uniform 45deg striped border directly onto Canvas
  drawStripedBorderCanvas(ctx, width, height, scaleX)
}

export default function Preview({ photo, name, stack, builderTitle, format, onBack, onStartOver }) {
  const canvasRef = useRef(null)
  const [generating, setGenerating] = useState(true)
  const [generatedUrl, setGeneratedUrl] = useState(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !photo) return

    setGenerating(true)
    const ctx = canvas.getContext('2d')

    if (format === 'pfp') {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        drawPFPFrame(ctx, img)
        setGenerating(false)
        setGeneratedUrl(canvas.toDataURL('image/png'))
      }
      img.src = photo
    } else {
      let loadedCount = 0
      const img = new Image()
      const frameImg = new Image()

      img.crossOrigin = 'anonymous'
      frameImg.crossOrigin = 'anonymous'

      const checkBothLoaded = () => {
        loadedCount++
        if (loadedCount === 2) {
          drawBuilderCard(ctx, img, frameImg, name, stack, builderTitle)
          setGenerating(false)
          setGeneratedUrl(canvas.toDataURL('image/png'))
        }
      }

      img.onload = checkBothLoaded
      frameImg.onload = checkBothLoaded

      img.src = photo
      frameImg.src = '/id.png'
    }
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
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-3 animate-fadeIn">
      <div className={`relative z-10 w-full mx-auto px-2 ${format === 'pfp' ? 'max-w-[320px] sm:max-w-[360px]' : 'max-w-xs sm:max-w-sm md:max-w-md'}`}>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-hh-yellow font-display text-lg sm:text-xl tracking-wide drop-shadow-md">
            Your {format === 'pfp' ? 'PFP Frame' : 'Builder Pass'}
          </h2>
          <button onClick={onStartOver} className="text-hh-yellow/80 hover:text-hh-yellow font-mono text-[11px] uppercase tracking-wider cursor-pointer bg-black/40 px-2.5 py-1 rounded border border-hh-yellow/30">
            Start Over
          </button>
        </div>

        {/* Canvas (hidden but rendered) */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Preview */}
        {generating ? (
          <div className="bg-black/40 rounded-2xl border border-hh-yellow/30 p-8 text-center">
            <p className="text-hh-yellow font-mono text-sm animate-pulse">Generating pass...</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-center">
              {generatedUrl && (
                <img
                  src={generatedUrl}
                  alt="Generated pass"
                  className={`w-full object-contain rounded-2xl drop-shadow-2xl transition-all ${
                    format === 'pfp' ? 'max-h-[250px] sm:max-h-[280px]' : 'max-h-[360px] sm:max-h-[420px] md:max-h-[460px]'
                  }`}
                />
              )}
            </div>

            <div className="flex gap-2.5 max-w-sm mx-auto">
              <button
                onClick={handleDownload}
                className="flex-1 bg-hh-yellow text-hh-green-dark font-display text-xs sm:text-sm py-2.5 rounded-xl hover:bg-hh-yellow-light transition-colors flex items-center justify-center gap-1.5 cursor-pointer tracking-wide shadow-lg"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
              <button
                onClick={handleShareX}
                className="flex-1 bg-[#1d1d1f] text-white font-display text-xs sm:text-sm py-2.5 rounded-xl hover:bg-[#333] transition-colors flex items-center justify-center gap-1.5 cursor-pointer tracking-wide shadow-lg"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
                Share on X
              </button>
            </div>

            <p className="text-hh-yellow/70 font-body text-[11px] text-center mt-1 drop-shadow">
              Download the image, then attach it to your tweet with #FrameInGoa
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
