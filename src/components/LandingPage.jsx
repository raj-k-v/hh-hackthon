import { useState } from 'react'

export default function LandingPage({ onFormatSelect }) {
  const [activeFormat, setActiveFormat] = useState('card')

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Top bar */}
      <div className="relative z-10 flex items-center justify-between px-4 sm:px-8 py-4">
        <img
          src="/2-47.svg"
          alt="2:47 PM STUDIO"
          className="h-16 sm:h-20 w-auto object-contain select-none mt-5 sm:mt-0"
        />

        {/* Sliding format selection widget */}
        <div className="flex flex-col items-center w-[130px] sm:w-[150px]">
          {/* Sliding window */}
          <div className="h-[48px] overflow-hidden relative w-full">
            <div
              className="transition-transform duration-300 ease-in-out"
              style={{ transform: activeFormat === 'card' ? 'translateY(0)' : 'translateY(-50px)' }}
            >
              {/* BUILD ID button */}
              <button
                onClick={() => onFormatSelect('card')}
                className="h-[48px] w-full relative bg-hh-yellow text-hh-green-dark font-display text-sm sm:text-base px-4 overflow-hidden cursor-pointer hover:bg-hh-yellow-light transition-all flex flex-col justify-center items-center"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: "repeating-linear-gradient(45deg, #1a5c2a, #1a5c2a 6px, #e84393 6px, #e84393 12px, #e8d44d 12px, #e8d44d 18px)" }}
                />
                <span className="tracking-wider whitespace-nowrap select-none">BUILD ID</span>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5"
                  style={{ background: "repeating-linear-gradient(45deg, #1a5c2a, #1a5c2a 6px, #e84393 6px, #e84393 12px, #e8d44d 12px, #e8d44d 18px)" }}
                />
              </button>

              {/* Spacer between two buttons in the slide */}
              <div className="h-[2px]" />

              {/* PFP FRAME button */}
              <button
                onClick={() => onFormatSelect('pfp')}
                className="h-[48px] w-full relative bg-hh-yellow text-hh-green-dark font-display text-sm sm:text-base px-4 overflow-hidden cursor-pointer hover:bg-hh-yellow-light transition-all flex flex-col justify-center items-center"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1.5"
                  style={{ background: "repeating-linear-gradient(45deg, #1a5c2a, #1a5c2a 6px, #e84393 6px, #e84393 12px, #e8d44d 12px, #e8d44d 18px)" }}
                />
                <span className="tracking-wider whitespace-nowrap select-none">PFP FRAME</span>
                <div
                  className="absolute bottom-0 left-0 right-0 h-1.5"
                  style={{ background: "repeating-linear-gradient(45deg, #1a5c2a, #1a5c2a 6px, #e84393 6px, #e84393 12px, #e8d44d 12px, #e8d44d 18px)" }}
                />
              </button>
            </div>
          </div>

          {/* Full-width pink toggle arrow */}
          <button
            onClick={() => setActiveFormat(prev => prev === 'card' ? 'pfp' : 'card')}
            className="w-full mt-1 text-white transition-colors flex items-center justify-center py-2 cursor-pointer"
            style={{ backgroundColor: '#FF0080' }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = '#cc0066'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = '#FF0080'}
            aria-label="Switch template format"
          >
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${activeFormat === 'pfp' ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Hero section */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 pt-24 sm:pt-28 md:pt-32 pb-12 w-full mx-auto">
        <div className="relative w-full flex justify-center items-center px-4 select-none">
          {/* Hacker House logo */}
          <img
            src="/Hacker house.png"
            alt="Hacker House"
            className="w-[75%] sm:w-[65%] md:w-[60%] h-auto max-h-[90px] sm:max-h-[120px] md:max-h-[150px] object-contain"
          />
          {/* Goa Hindi logo overlay - floating */}
          <img
            src="/goa_hindi.svg"
            alt="Goa"
            className="absolute w-[18%] min-w-[50px] max-w-[130px] top-1/2 left-[50.5%] drop-shadow-lg"
            style={{ animation: 'floatGoa 3s ease-in-out infinite' }}
          />
        </div>

        {/* Info bar */}
        <div className="w-full mt-10 px-4 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-hh-yellow text-xs sm:text-sm tracking-wider uppercase">
          <span>GOA, INDIA  •  28 - 31 OCT 2026</span>
          <span>2:47 PM STUDIO</span>
        </div>
      </div>


      {/* Footer */}
      <div className="relative z-10 text-center pb-8 px-4">
        <p className="text-hh-yellow/40 font-body text-xs tracking-wider">
          #FrameInGoa • HH GOA 2026 • August 28–31, 2026 • Goa, India
        </p>
        <p className="text-hh-yellow/30 font-body text-xs mt-1">
          Built for HH Goa 2026 builders &amp; attendees.
        </p>
      </div>
    </div>
  )
}
