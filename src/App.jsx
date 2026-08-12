import { useState, useCallback } from 'react'
import LandingPage from './components/LandingPage'
import PhotoUpload from './components/PhotoUpload'
import BuilderForm from './components/BuilderForm'
import Preview from './components/Preview'

const TITLES = [
  "Pixel Wizard", "Bug Whisperer", "Code Alchemist", "Stack Overlord",
  "Deploy Destroyer", "API Hacker", "Terminal Cowboy", "Merge Conflict Champion",
  "Coffee-to-Code Converter", "404 Finder", "Rust Evangelist", "Full-Stack Yoda",
  "Git Commit Samurai", "Docker Captain", "Kernel Whisperer", "Syntax Samurai",
  "Blockchain Bard", "Data Wrangler", "Cloud Nomad", "Open Source Monk",
  "Night Owl Coder", "Debugging Detective", "Refactoring Renegade", "Sudo Sprinter",
  "Prompt Engineer Pro", "AI Whisperer", "Smart Contract Sage", "UI Sorcerer",
  "Backend Buccaneer", "Frontend Phoenix",
]

function generateTitle() {
  return TITLES[Math.floor(Math.random() * TITLES.length)]
}

export default function App() {
  const [step, setStep] = useState('landing')
  const [format, setFormat] = useState(null)
  const [photo, setPhoto] = useState(null)
  const [name, setName] = useState('')
  const [stack, setStack] = useState('')
  const [builderTitle] = useState(generateTitle)

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

  if (step === 'landing') {
    return <LandingPage onFormatSelect={handleFormatSelect} />
  }

  if (step === 'upload') {
    return (
      <PhotoUpload
        onUpload={handlePhotoUpload}
        onBack={handleBack}
        format={format}
      />
    )
  }

  if (step === 'form') {
    return (
      <BuilderForm
        onSubmit={handleFormSubmit}
        onBack={handleBack}
        builderTitle={builderTitle}
      />
    )
  }

  if (step === 'preview') {
    return (
      <Preview
        photo={photo}
        name={name}
        stack={stack}
        builderTitle={builderTitle}
        format={format}
        onBack={handleBack}
        onStartOver={handleStartOver}
      />
    )
  }

  return null
}
