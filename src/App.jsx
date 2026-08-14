import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  ArrowLeft,
  Flower2,
  Leaf,
  Mail,
  Play,
  Sparkles,
} from 'lucide-react'
import { LAUNCH_DATE, assets } from './siteConfig'
import introVideo from './assets/into-video.mp4'
import './App.css'

function InstagramIcon({ size = 17, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="12" r="3.7" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="16.9" cy="7.1" r="1" fill="currentColor" />
    </svg>
  )
}

function FacebookIcon({ size = 17, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path
        d="M14 8.35h2.35V4.6c-.4-.06-1.78-.18-3.39-.18-3.35 0-5.65 2.04-5.65 5.79v3.26H4v4.18h3.31V24h4.18v-6.35h3.27l.52-4.18h-3.79v-2.84c0-1.21.34-2.28 2.51-2.28Z"
        fill="currentColor"
      />
    </svg>
  )
}

function LinkedInIcon({ size = 17, ...props }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" {...props}>
      <path d="M6.2 9.2h3.1v9.7H6.2V9.2Zm1.55-4.7a1.8 1.8 0 1 1 0 3.6 1.8 1.8 0 0 1 0-3.6Z" fill="currentColor" />
      <path d="M11.1 9.2h2.95v1.33h.04c.41-.78 1.42-1.6 2.92-1.6 3.12 0 3.69 2.05 3.69 4.72v5.25h-3.08v-4.66c0-1.11-.02-2.54-1.55-2.54-1.55 0-1.79 1.21-1.79 2.46v4.74H11.1V9.2Z" fill="currentColor" />
    </svg>
  )
}

const founderMessageTamil =
  'ஒவ்வொரு பட்டிலும் ஒரு கதை இருக்கிறது. அந்தக் கதையை அழகாக நெய்து, உங்கள் வாழ்க்கையின் அழகான தருணங்களுடன் இணைப்பதே அருள்மதி சில்க்ஸின் பயணம்.'

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.86, ease: [0.22, 1, 0.36, 1] },
  },
}

const stagger = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.13,
      delayChildren: 0.18,
    },
  },
}

function AnimatedLetters({ text }) {
  return (
    <em className="animated-letters" aria-label={text}>
      {text.split('').map((letter, index) => (
        <motion.span
          aria-hidden="true"
          className="animated-letter"
          key={`${letter}-${index}`}
          initial={{ opacity: 0, y: 34, rotateX: -72, filter: 'blur(7px)' }}
          animate={{
            opacity: [0, 1, 1, 0.72, 1],
            y: [34, 0, 0, -6, 0],
            rotateX: [-72, 0, 0, 8, 0],
            filter: ['blur(7px)', 'blur(0px)', 'blur(0px)', 'blur(1px)', 'blur(0px)'],
          }}
          transition={{
            delay: 0.7 + index * 0.045,
            duration: 3.8,
            ease: [0.22, 1, 0.36, 1],
            repeat: Infinity,
            repeatDelay: 1.6,
            repeatType: 'loop',
          }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </em>
  )
}

function IntroVideo({ onComplete }) {
  const videoRef = useRef(null)
  const [needsPlay, setNeedsPlay] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [progress, setProgress] = useState(0)
  const knobOffset = 9 - progress * 0.18
  const progressPosition = `calc(${progress}% + ${knobOffset}px)`

  const startVideo = () => {
    const playAttempt = videoRef.current?.play()
    playAttempt?.then(() => setNeedsPlay(false)).catch(() => setNeedsPlay(true))
  }

  useEffect(() => {
    startVideo()
  }, [])

  useEffect(() => {
    let animationFrame

    const updateProgress = () => {
      const video = videoRef.current
      if (video && Number.isFinite(video.duration) && video.duration > 0) {
        setProgress(Math.min(100, (video.currentTime / video.duration) * 100))
      }
      animationFrame = window.requestAnimationFrame(updateProgress)
    }

    animationFrame = window.requestAnimationFrame(updateProgress)
    return () => window.cancelAnimationFrame(animationFrame)
  }, [])

  return (
    <motion.div
      className="intro-video-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <video
        ref={videoRef}
        src={introVideo}
        autoPlay
        muted
        playsInline
        preload="auto"
        onCanPlay={startVideo}
        onPlaying={() => setNeedsPlay(false)}
        onEnded={onComplete}
        onError={() => setHasError(true)}
        aria-label="Arulmathi Silks introduction"
      />
      <div className="intro-progress" role="status" aria-label={`Introduction ${Math.round(progress)}% complete`}>
        <div className="loader-thread" aria-hidden="true">
          <span style={{ width: progressPosition }} />
          <i className="loader-knob" style={{ left: progressPosition }} />
        </div>
        <p>
          Weaving Heritage
          <span>{Math.round(progress)}%</span>
        </p>
      </div>
      {needsPlay && !hasError && (
        <button className="intro-play-button" type="button" onClick={startVideo}>
          <Play size={18} fill="currentColor" />
          Play introduction
        </button>
      )}
      {hasError && (
        <div className="intro-video-error" role="alert">
          <p>The introduction video could not be played.</p>
          <button type="button" onClick={onComplete}>Continue to website</button>
        </div>
      )}
    </motion.div>
  )
}

function useCountdown(targetDate) {
  const targetTime = useMemo(() => new Date(targetDate).getTime(), [targetDate])
  const [remaining, setRemaining] = useState(() => Math.max(0, targetTime - Date.now()))

  useEffect(() => {
    const updateRemaining = () => setRemaining(Math.max(0, targetTime - Date.now()))
    updateRemaining()

    const interval = window.setInterval(updateRemaining, 1000)
    document.addEventListener('visibilitychange', updateRemaining)

    return () => {
      window.clearInterval(interval)
      document.removeEventListener('visibilitychange', updateRemaining)
    }
  }, [targetTime])

  const totalSeconds = Math.floor(remaining / 1000)

  return {
    isLive: remaining <= 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function Header() {
  return (
    <motion.header
      className="site-header"
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
    >
      <a className="brand-mark interactive" href="/" aria-label="Arulmathi Silks home">
        <img src={assets.logoImage} alt="Arulmathi Silks" />
      </a>
      <div className="nav-marks" aria-label="Silk Mark and Handloom Mark certifications">
        <span className="nav-mark-frame">
          <img src={assets.navImage1} alt="Handloom Mark" />
        </span>
        <span className="nav-mark-frame">
          <img src={assets.navImage2} alt="Silk Mark" />
        </span>
          <span className="nav-mark-frame">
          <img src={assets.navImage3} alt="Silk Mark" />
        </span>
      </div>
      <div className="nav-right">
        <p>Pure Silk. Pure Heritage.</p>
      </div>
    </motion.header>
  )
}

function HeroBackground() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    if (reducedMotion || window.matchMedia('(pointer: coarse)').matches) return undefined

    const handlePointerMove = (event) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 16
      const y = (event.clientY / window.innerHeight - 0.5) * 10
      setPosition({ x, y })
    }

    window.addEventListener('pointermove', handlePointerMove)
    return () => window.removeEventListener('pointermove', handlePointerMove)
  }, [reducedMotion])

  return (
    <div className="hero-background" aria-hidden="true">
      <motion.img
        src={assets.heroImage}
        alt=""
        loading="eager"
        fetchPriority="high"
        decoding="async"
        animate={reducedMotion ? false : { x: position.x, y: position.y, scale: 1.025 }}
        transition={{ type: 'spring', stiffness: 50, damping: 24, mass: 0.7 }}
      />
      <div className="overlay overlay-left" />
      <div className="overlay overlay-bottom" />
      <div className="overlay overlay-vignette" />
    </div>
  )
}

function AtmosphericGlow() {
  return (
    <div className="atmosphere" aria-hidden="true">
      <span className="glow glow-one" />
      <span className="glow glow-two" />
      <span className="light-speck speck-one" />
      <span className="light-speck speck-two" />
      <span className="light-speck speck-three" />
    </div>
  )
}

function BrandValues() {
  const values = [
    { title: 'Authentic', subtitle: 'Pure Silks', Icon: Flower2 },
    { title: 'Heritage', subtitle: 'Weaves', Icon: Sparkles },
    { title: 'Timeless', subtitle: 'Elegance', Icon: Leaf },
  ]

  return (
    <motion.div className="brand-values" variants={fadeUp}>
      {values.map(({ title, subtitle, Icon }) => (
        <div className="brand-value" key={title}>
          <span aria-hidden="true" />
          <Icon aria-hidden="true" strokeWidth={1.25} />
          <strong>{title}</strong>
          <em>{subtitle}</em>
        </div>
      ))}
    </motion.div>
  )
}

function Countdown() {
  const countdown = useCountdown(LAUNCH_DATE)
  const units = [
    ['Days', countdown.days],
    ['Hours', countdown.hours],
    ['Minutes', countdown.minutes],
    ['Seconds', countdown.seconds],
  ]

  return (
    <motion.section className="countdown" variants={fadeUp} aria-label="Launch countdown">
      <p className="section-kicker">Launching In</p>
      {countdown.isLive ? (
        <motion.div
          className="live-state"
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          Now Open
        </motion.div>
      ) : (
        <div className="countdown-grid">
          {units.map(([label, value]) => (
            <div className="countdown-tile interactive" key={label}>
              <strong aria-label={`${value} ${label}`}>{String(value).padStart(2, '0')}</strong>
              <span>{label}</span>
            </div>
          ))}
        </div>
      )}
    </motion.section>
  )
}

function FounderMessage() {
  const [isOpen, setIsOpen] = useState(false)
  const closeStory = () => {
    setIsOpen(false)
    window.requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    })
  }

  return (
    <>
      <motion.aside className="founder-panel" variants={fadeUp}>
        <div className="founder-media">
          <video src={assets.founderVideo} muted playsInline preload="metadata" />
        </div>
        <div className="founder-copy">
          <p className="section-kicker">A Message From Our Founder</p>
          <blockquote lang="ta">{founderMessageTamil}</blockquote>
          <div className="founder-actions">
            <button
              className="story-trigger interactive"
              type="button"
              onClick={() => setIsOpen(true)}
              aria-label="Open founder story"
            >
              <span>
                <Play size={17} fill="currentColor" aria-hidden="true" />
              </span>
              Our Story
            </button>
            <p className="founder-signature">
              <b>Ponnuvel C</b>
              <span>Founder</span>
            </p>
          </div>
        </div>
      </motion.aside>
      <FounderStoryModal isOpen={isOpen} onClose={closeStory} />
    </>
  )
}

function FounderStoryModal({ isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }

    document.body.classList.add('modal-open')
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.classList.remove('modal-open')
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="story-modal"
          role="dialog"
          aria-modal="true"
          aria-label="Founder story"
          initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          animate={{ opacity: 1, backdropFilter: 'blur(18px)' }}
          exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          onClick={onClose}
        >
          <motion.div
            className="story-shell"
            initial={{ opacity: 0, scale: 0.94, y: 24, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, scale: 0.96, y: 12, filter: 'blur(8px)' }}
            transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
            onClick={(event) => event.stopPropagation()}
          >
            <button className="story-back interactive" type="button" onClick={onClose}>
              <ArrowLeft size={16} aria-hidden="true" />
              Back Home
            </button>
            <video src={assets.founderVideo} controls autoPlay playsInline />
            <div>
              <p className="section-kicker">Arulmathi Silks</p>
              <h2>Heritage, held in every thread.</h2>
              <p lang="ta">{founderMessageTamil}</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function SocialLinks() {
  const links = [
    ['Instagram', InstagramIcon, 'https://www.instagram.com/arulmathisilksofficial'],
    ['Facebook', FacebookIcon, 'https://www.facebook.com/share/1EG2rWiHwa/'],
    [
      'LinkedIn',
      LinkedInIcon,
      'https://www.linkedin.com/in/arulmathi-silks-987769424?utm_source=share_via&utm_content=profile&utm_medium=member_android',
    ],
  ]

  return (
    <div className="social-links" aria-label="Social links">
      {links.map(([label, Icon, href]) => (
        <a className="interactive" href={href} aria-label={label} key={label} target="_blank" rel="noreferrer">
          <Icon size={17} strokeWidth={1.5} aria-hidden="true" />
        </a>
      ))}
    </div>
  )
}

function EmailNotify() {
  return (
    <form className="notify-form" onSubmit={(event) => event.preventDefault()}>
      <label className="sr-only" htmlFor="notify-email">
        Email address
      </label>
      <Mail size={16} aria-hidden="true" />
      <input id="notify-email" type="email" placeholder="Enter your email address" autoComplete="email" />
      <button className="interactive" type="submit">
        Notify Me
      </button>
    </form>
  )
}

function FooterBar() {
  return (
    <footer className="footer-bar">
      <div className="footer-social">
        <p>Stay Connected</p>
        <SocialLinks />
      </div>
      <EmailNotify />
    </footer>
  )
}

function HeroContent() {
  return (
    <motion.main className="hero-content" variants={stagger} initial="hidden" animate="show">
      <motion.h1 variants={fadeUp}>
        <span>Timeless Beauty</span>
        <AnimatedLetters text="Coming Soon . . ." />
      </motion.h1>
      <motion.p className="hero-copy" variants={fadeUp}>
        Our website is under construction. We are crafting a richer, more elegant experience for
        you.
      </motion.p>
      <BrandValues />
      <Countdown />
      <FounderMessage />
      <FooterBar />
    </motion.main>
  )
}

function LuxuryComingSoon() {
  return (
    <div className="luxury-page">
      <Header />
      <HeroBackground />
      <AtmosphericGlow />
      <HeroContent />
    </div>
  )
}

function App() {
  const [stage, setStage] = useState('intro')

  return (
    <AnimatePresence mode="wait">
      {stage === 'intro' && (
        <IntroVideo key="intro" onComplete={() => setStage('site')} />
      )}
      {stage === 'site' && <LuxuryComingSoon key="site" />}
    </AnimatePresence>
  )
}

export default App
