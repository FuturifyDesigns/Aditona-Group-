import { useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import EditModeBar from '../cms/EditModeBar'
import Footer from './Footer'
import Header from './Header'
import WhatsAppFab from './WhatsAppFab'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const WA_BY_PATH = {
  '/event-solutions':
    'Hello Aditona Group — I am interested in Event Solutions.',
  '/creative-marketing':
    'Hello Aditona Group — I am interested in Creative & Marketing.',
  '/golf-solutions':
    'Hello Aditona Group — I am interested in Golf Solutions.',
  '/request-quote':
    'Hello Aditona Group — I would like to request a quote.',
  '/enquiry': 'Hello Aditona Group — I would like to make an enquiry.',
  '/contact': 'Hello Aditona Group — I would like to get in touch.',
}

export default function Layout() {
  const location = useLocation()
  const mainRef = useRef(null)

  useGSAP(
    () => {
      window.scrollTo(0, 0)
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduced || !mainRef.current) {
        requestAnimationFrame(() => ScrollTrigger.refresh())
        return
      }

      gsap.fromTo(
        mainRef.current,
        { opacity: 0.4 },
        {
          opacity: 1,
          duration: 0.45,
          ease: 'power2.out',
          onComplete: () => ScrollTrigger.refresh(),
        },
      )
    },
    { dependencies: [location.pathname], revertOnUpdate: true },
  )

  const waMessage = WA_BY_PATH[location.pathname]

  return (
    <>
      <EditModeBar />
      <Header />
      <main className="page" ref={mainRef}>
        <Outlet context={{ waMessage }} />
      </main>
      <Footer />
      <WhatsAppFab message={waMessage} />
    </>
  )
}
