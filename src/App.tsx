import { useEffect, useRef, useState } from 'react'
import {
  AlertTriangle,
  ArrowDown,
  ArrowUpRight,
  Check,
  FileText,
  Github,
  Linkedin,
  Menu,
  Play,
  RefreshCw,
  Volume2,
  X,
} from 'lucide-react'

type LabState = 'loading' | 'ready' | 'error'
type RaceState = 'idle' | 'running' | 'success' | 'blocked'

const NAV_ITEMS = [
  ['01', 'Work', '#work'],
  ['02', 'Lab', '#lab'],
  ['03', 'About', '#about'],
  ['04', 'Contact', '#contact'],
]

const METRICS = [
  { value: '~30s → <2s', label: 'Landing-page LCP' },
  { value: '~5m → <30s', label: 'Claim review time' },
  { value: '3 → 2', label: 'Portals → shared libraries' },
  { value: '5+ years', label: 'Product engineering' },
]

const STRINGS = [
  { note: 'E₂', hz: 82.41 },
  { note: 'A₂', hz: 110 },
  { note: 'D₃', hz: 146.83 },
  { note: 'G₃', hz: 196 },
  { note: 'B₃', hz: 246.94 },
  { note: 'E₄', hz: 329.63 },
]

function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.12 },
    )

    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])
}

function ExternalLink({
  href,
  children,
  icon = <ArrowUpRight aria-hidden="true" />,
}: {
  href: string
  children: React.ReactNode
  icon?: React.ReactNode
}) {
  return (
    <a className="text-link" href={href} target="_blank" rel="noreferrer">
      <span>{children}</span>
      {icon}
    </a>
  )
}

function Masthead() {
  const [open, setOpen] = useState(false)

  return (
    <header className="masthead">
      <a className="brand" href="#top" aria-label="Sanyam Trehan, back to top">
        <span>ST</span>
        <span className="brand-mark">/26</span>
      </a>
      <p className="masthead-role">Senior Software Engineer<br />Frontend-focused / Full-stack</p>
      <button
        className="menu-toggle"
        type="button"
        aria-expanded={open}
        aria-controls="site-navigation"
        onClick={() => setOpen((value) => !value)}
      >
        <span>Menu</span>
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      <nav id="site-navigation" className={open ? 'nav is-open' : 'nav'} aria-label="Primary navigation">
        {NAV_ITEMS.map(([number, label, href]) => (
          <a key={href} href={href} onClick={() => setOpen(false)}>
            <span>{number}</span>
            {label}
          </a>
        ))}
      </nav>
    </header>
  )
}

function Hero() {
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <div className="hero-kicker">
        <span className="eyebrow">Himachal Pradesh, India / Remote</span>
        <span className="availability"><i aria-hidden="true" /> Open to the right role</span>
      </div>
      <div className="hero-title-wrap">
        <p className="hero-index" aria-hidden="true">PORTFOLIO<br />2026</p>
        <h1 id="hero-title">
          <span>I make complex</span>
          <span><em>software</em> feel</span>
          <span>inevitable.</span>
        </h1>
      </div>
      <div className="hero-bottom">
        <p>
          Sanyam Trehan is a senior software engineer who turns slow,
          fragmented product surfaces into fast, resilient systems—from Figma
          to API to production.
        </p>
        <a className="jump-link" href="#work">
          Explore selected systems
          <ArrowDown aria-hidden="true" />
        </a>
      </div>
    </section>
  )
}

function Metrics() {
  return (
    <section className="metrics" aria-label="Selected outcomes" data-reveal>
      {METRICS.map((metric, index) => (
        <article key={metric.label}>
          <span className="metric-index">0{index + 1}</span>
          <strong>{metric.value}</strong>
          <p>{metric.label}</p>
        </article>
      ))}
    </section>
  )
}

function ClaimReviewDemo() {
  const [reviewed, setReviewed] = useState(false)

  return (
    <div className="claim-demo" aria-label="Interactive claim review demonstration">
      <div className="demo-bar">
        <span>CLAIM / GK-2841</span>
        <span className={reviewed ? 'status status-approved' : 'status'}>
          {reviewed ? 'READY FOR DECISION' : 'AWAITING REVIEW'}
        </span>
      </div>
      <div className="claim-grid">
        <div className="receipt">
          <span className="receipt-word">PHARMACY</span>
          <i />
          <i />
          <i />
          <strong>₹ 2,840.00</strong>
          <span>04 / 10 / 2026</span>
        </div>
        <div className="claim-details">
          <div>
            <span>Member</span>
            <strong>ST-0928</strong>
          </div>
          <div>
            <span>Allowance</span>
            <strong>₹ 7,160 left</strong>
          </div>
          <div className="claim-findings" aria-live="polite">
            <span>Review signal</span>
            {reviewed ? (
              <ul>
                <li><Check aria-hidden="true" /> Receipt is legible</li>
                <li><Check aria-hidden="true" /> Category matches</li>
                <li><Check aria-hidden="true" /> Within allowance</li>
              </ul>
            ) : (
              <p>Run the assisted review to surface the decision context.</p>
            )}
          </div>
        </div>
      </div>
      <button className="demo-action" type="button" onClick={() => setReviewed((value) => !value)}>
        {reviewed ? <RefreshCw aria-hidden="true" /> : <Play aria-hidden="true" />}
        {reviewed ? 'Reset review' : 'Run assisted review'}
      </button>
    </div>
  )
}

function OpenTuneDemo() {
  const [active, setActive] = useState(0)
  const audioContext = useRef<AudioContext | null>(null)

  function playTone(index: number) {
    setActive(index)
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext
    if (!AudioContextCtor) return
    const context = audioContext.current ?? new AudioContextCtor()
    audioContext.current = context
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.type = 'sine'
    oscillator.frequency.value = STRINGS[index].hz
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.18, context.currentTime + 0.02)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.72)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.75)
  }

  return (
    <div className="tuner-demo" aria-label="OpenTune reference-tone demonstration">
      <div className="demo-bar">
        <span>OPENTUNE / STANDARD</span>
        <span>{STRINGS[active].hz.toFixed(2)} HZ</span>
      </div>
      <div className="tuner-face">
        <div className="tuner-scale" aria-hidden="true">
          {Array.from({ length: 17 }).map((_, index) => <i key={index} />)}
        </div>
        <div className="needle" key={active} aria-hidden="true" />
        <strong>{STRINGS[active].note}</strong>
        <span>IN TUNE</span>
      </div>
      <div className="string-picker" aria-label="Play guitar reference tone">
        {STRINGS.map((string, index) => (
          <button
            key={string.note}
            type="button"
            className={active === index ? 'is-active' : ''}
            onClick={() => playTone(index)}
            aria-label={`Play ${string.note}, ${string.hz} hertz`}
          >
            <Volume2 aria-hidden="true" />
            <span>{string.note}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

function CheckoutDemo() {
  const [requests, setRequests] = useState<RaceState[]>(Array(10).fill('idle'))
  const [running, setRunning] = useState(false)
  const timers = useRef<number[]>([])

  useEffect(() => () => timers.current.forEach(window.clearTimeout), [])

  function runRace() {
    timers.current.forEach(window.clearTimeout)
    setRunning(true)
    setRequests(Array(10).fill('running'))
    const resultOrder = [6, 1, 8, 3, 0, 9, 4, 2, 7, 5]
    resultOrder.forEach((requestIndex, order) => {
      const timer = window.setTimeout(() => {
        setRequests((current) => {
          const next = [...current]
          next[requestIndex] = order < 3 ? 'success' : 'blocked'
          return next
        })
        if (order === resultOrder.length - 1) setRunning(false)
      }, 220 + order * 115)
      timers.current.push(timer)
    })
  }

  const successes = requests.filter((state) => state === 'success').length
  const blocked = requests.filter((state) => state === 'blocked').length

  return (
    <div className="checkout-demo" aria-label="Checkout concurrency test demonstration">
      <div className="demo-bar">
        <span>INVENTORY CONTENTION / TEST 07</span>
        <span>STOCK: 03</span>
      </div>
      <div className="race-grid" aria-live="polite">
        {requests.map((state, index) => (
          <div key={index} className={`race-row race-${state}`}>
            <span>REQ_{String(index + 1).padStart(2, '0')}</span>
            <i />
            <strong>
              {state === 'idle' && 'WAITING'}
              {state === 'running' && 'LOCKING'}
              {state === 'success' && '201 ORDERED'}
              {state === 'blocked' && '409 BLOCKED'}
            </strong>
          </div>
        ))}
      </div>
      <div className="race-footer">
        <p><strong>{successes}</strong> orders / <strong>{blocked}</strong> protected</p>
        <button className="demo-action" type="button" onClick={runRace} disabled={running}>
          <Play aria-hidden="true" />
          {running ? 'Race in progress' : 'Run 10 checkouts'}
        </button>
      </div>
    </div>
  )
}

function StreamDemo() {
  const [progress, setProgress] = useState(42)
  const totalSeconds = 7342
  const elapsedSeconds = Math.round((progress / 100) * totalSeconds)
  const format = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  return (
    <div className="stream-demo" aria-label="SVP HTTP range streaming demonstration">
      <div className="demo-bar">
        <span>SVP / HOME NETWORK</span>
        <span>206 PARTIAL CONTENT</span>
      </div>
      <div className="stream-stage">
        <div className="stream-frame">
          <span>FRAME / {String(Math.round(progress * 24)).padStart(4, '0')}</span>
          <strong>LOCAL<br />FIRST.</strong>
        </div>
        <div className="stream-route" aria-label="Streaming route">
          <span>LAPTOP</span>
          <i><b style={{ width: `${progress}%` }} /></i>
          <span>TV</span>
        </div>
      </div>
      <div className="scrubber">
        <div><span>{format(elapsedSeconds)}</span><span>{format(totalSeconds)}</span></div>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(event) => setProgress(Number(event.target.value))}
          aria-label="Video playback position"
        />
      </div>
    </div>
  )
}

function ProjectHeader({
  index,
  type,
  title,
  intro,
  stack,
  links,
}: {
  index: string
  type: string
  title: string
  intro: string
  stack: string
  links?: React.ReactNode
}) {
  return (
    <div className="project-copy">
      <div className="project-label"><span>{index}</span><span>{type}</span></div>
      <h3>{title}</h3>
      <p>{intro}</p>
      <p className="stack-line">{stack}</p>
      {links && <div className="project-links">{links}</div>}
    </div>
  )
}

function Work() {
  return (
    <section className="work" id="work" aria-labelledby="work-heading">
      <div className="section-intro" data-reveal>
        <span className="section-number">01 / SELECTED SYSTEMS</span>
        <h2 id="work-heading">Proof lives in<br /><em>the interaction.</em></h2>
        <p>Four systems, shown as working ideas—not logo walls or polished screenshots with the difficult parts cropped out.</p>
      </div>

      <article className="project project-left" data-reveal>
        <ProjectHeader
          index="01"
          type="Production system / GoKlaim"
          title="Five minutes of friction, compressed to thirty seconds."
          intro="An LLM-assisted claim review flow that rotates receipts, surfaces decision context and keeps the human reviewer in control. Built across interface, prompts and APIs with a backend collaborator."
          stack="Angular / NestJS / OpenAI API / TypeScript"
        />
        <ClaimReviewDemo />
      </article>

      <article className="project project-right" data-reveal>
        <OpenTuneDemo />
        <ProjectHeader
          index="02"
          type="Independent product / OpenTune"
          title="A guitar tuner that refuses the subscription tax."
          intro="An offline-ready browser tuner with every alternate tuning unlocked. Pitch detection and audio synthesis stay in testable TypeScript modules; the interface turns frequency into something a musician can feel."
          stack="Next.js / Web Audio / SVG / TypeScript / PWA"
          links={(
            <>
              <ExternalLink href="https://opentune-five.vercel.app">Open live product</ExternalLink>
              <ExternalLink href="https://github.com/sanyamtrehan/opentune" icon={<Github aria-hidden="true" />}>View source</ExternalLink>
            </>
          )}
        />
      </article>

      <article className="project project-left" data-reveal>
        <ProjectHeader
          index="03"
          type="Engineering exercise / Checkout service"
          title="Correct under pressure—not only in the happy path."
          intro="A transactional checkout and rewards service designed around retries, contention and failure. Ten checkouts can race for three units; exactly three win, and the service proves why."
          stack="NestJS / PostgreSQL / TypeORM / Jest / Docker"
          links={<ExternalLink href="https://github.com/sanyamtrehan/neustackapp-be-assignment" icon={<Github aria-hidden="true" />}>Read the decisions</ExternalLink>}
        />
        <CheckoutDemo />
      </article>

      <article className="project project-right project-last" data-reveal>
        <StreamDemo />
        <ProjectHeader
          index="04"
          type="Daily-use tool / SVP"
          title="Instant seeking, across the room and over the network."
          intro="A home media server built for an actual living room: recursive library scanning, a custom player and byte-range streaming for immediate seeking from laptop to TV."
          stack="Angular / NestJS / RxJS / HTTP Range Requests"
          links={<ExternalLink href="https://github.com/sanyamtrehan/SVP" icon={<Github aria-hidden="true" />}>View source</ExternalLink>}
        />
      </article>
    </section>
  )
}

function StateLab() {
  const [state, setState] = useState<LabState>('loading')
  const states: LabState[] = ['loading', 'ready', 'error']

  return (
    <div className="state-lab">
      <div className="state-controls" role="group" aria-label="Preview component state">
        {states.map((item, index) => (
          <button
            key={item}
            type="button"
            className={state === item ? 'is-active' : ''}
            onClick={() => setState(item)}
          >
            <span>0{index + 1}</span>
            {item}
          </button>
        ))}
      </div>
      <div className="state-preview" aria-live="polite">
        <div className="preview-header">
          <span>LEAVE / POLICY</span>
          <span>STATE: {state.toUpperCase()}</span>
        </div>
        <div className={`preview-body preview-${state}`}>
          {state === 'loading' && (
            <>
              <RefreshCw className="spin" aria-hidden="true" />
              <strong>Checking policy…</strong>
              <p>Resolving allowance, overlap and weekend rules.</p>
            </>
          )}
          {state === 'ready' && (
            <>
              <Check aria-hidden="true" />
              <strong>4 days available</strong>
              <p>18–21 November · no conflicts found.</p>
              <button type="button">Submit leave request</button>
            </>
          )}
          {state === 'error' && (
            <>
              <AlertTriangle aria-hidden="true" />
              <strong>The policy service took too long.</strong>
              <p>Your dates are saved. Retry without filling the form again.</p>
              <button type="button" onClick={() => setState('loading')}>Retry safely</button>
            </>
          )}
        </div>
      </div>
      <pre className="state-output" aria-label="State output"><code>{JSON.stringify({
        status: state,
        preservesInput: state === 'error',
        nextAction: state === 'ready' ? 'submit' : state === 'error' ? 'retry' : null,
      }, null, 2)}</code></pre>
    </div>
  )
}

function Lab() {
  return (
    <section className="lab" id="lab" aria-labelledby="lab-heading">
      <div className="lab-heading" data-reveal>
        <span className="section-number">02 / INTERFACE LAB</span>
        <h2 id="lab-heading">The loading state is<br />part of the product.</h2>
        <p>Switch the component state. The interface preserves intent, makes the system legible and gives failure a useful next step.</p>
      </div>
      <div data-reveal><StateLab /></div>
      <div className="architecture" data-reveal>
        <div className="architecture-title">
          <span>REQUEST / RESPONSE PATH</span>
          <p>Full stack is not a list of technologies. It is the willingness to follow a failure all the way down.</p>
        </div>
        <div className="architecture-flow" aria-label="System architecture flow">
          <div><span>01</span><strong>Intent</strong><small>accessible UI</small></div>
          <i aria-hidden="true" />
          <div><span>02</span><strong>State</strong><small>predictable cache</small></div>
          <i aria-hidden="true" />
          <div><span>03</span><strong>Contract</strong><small>typed API</small></div>
          <i aria-hidden="true" />
          <div><span>04</span><strong>Truth</strong><small>safe transaction</small></div>
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section className="about" id="about" aria-labelledby="about-heading">
      <div className="about-head" data-reveal>
        <span className="section-number">03 / FIELD NOTES</span>
        <h2 id="about-heading">Engineering with<br /><em>a design eye.</em></h2>
      </div>
      <div className="principles" data-reveal>
        <article>
          <span>01</span>
          <h3>Performance is interface design.</h3>
          <p>A 30-second page is not a backend problem or a frontend problem. It is a broken promise to the person waiting.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Reuse is a product decision.</h3>
          <p>The best shared component reduces inconsistency for users and decision fatigue for the team—not just duplicate code.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Failure deserves a designed path.</h3>
          <p>Retries, stale data, partial responses and impossible states are where engineering quality becomes visible.</p>
        </article>
      </div>
      <div className="career" data-reveal>
        <div className="career-intro">
          <p className="eyebrow">FROM INTERN TO SENIOR / SAME PRODUCT LINE</p>
          <p>Five years of compounding context: from building screens to shaping architecture, mentoring developers and owning systems across the stack.</p>
        </div>
        <ol>
          <li><time>2025—NOW</time><div><strong>The Ninja Studio</strong><span>Senior Software Engineer</span></div></li>
          <li><time>2023—2025</time><div><strong>Koverhoop</strong><span>Senior Software Engineer</span></div></li>
          <li><time>2021—2023</time><div><strong>Koverhoop</strong><span>Full Stack Engineer / Intern</span></div></li>
        </ol>
      </div>
      <div className="capability-line" data-reveal>
        <span>WORKING RANGE</span>
        <p>React · Angular · TypeScript · Next.js · NestJS · PostgreSQL · Web Audio · PWA · Accessibility · Testing · CI/CD · Product design</p>
      </div>
    </section>
  )
}

function Contact() {
  return (
    <footer className="contact" id="contact">
      <div className="contact-top" data-reveal>
        <span className="section-number">04 / CONTACT</span>
        <p>Have a difficult product surface,<br />a system that needs untangling,<br />or a team that values both?</p>
      </div>
      <a className="email-link" href="mailto:trehansanyam@gmail.com">
        <span>Let’s talk.</span>
        <ArrowUpRight aria-hidden="true" />
      </a>
      <div className="contact-meta">
        <span>Himachal Pradesh, India / Open to remote</span>
        <div>
          <ExternalLink href="https://github.com/sanyamtrehan" icon={<Github aria-hidden="true" />}>GitHub</ExternalLink>
          <ExternalLink href="https://www.linkedin.com/in/sanyam-trehan" icon={<Linkedin aria-hidden="true" />}>LinkedIn</ExternalLink>
          <a className="text-link" href="/Sanyam_Trehan_Resume.pdf" download>
            <span>Résumé</span><FileText aria-hidden="true" />
          </a>
        </div>
      </div>
      <div className="colophon">
        <span>Designed & engineered by Sanyam Trehan</span>
        <span>© {new Date().getFullYear()} / Set in Newsreader + Manrope</span>
      </div>
    </footer>
  )
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext
  }
}

export default function App() {
  useReveal()

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Masthead />
      <main id="main-content">
        <Hero />
        <Metrics />
        <Work />
        <Lab />
        <About />
      </main>
      <Contact />
    </>
  )
}
