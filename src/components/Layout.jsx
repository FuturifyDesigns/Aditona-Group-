import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import EditModeBar from '../cms/EditModeBar'
import { hardRefreshScroll, setupScrollDefaults, softRefreshScroll } from '../lib/scroll'
import Footer from './Footer'
import Header from './Header'
import WhatsAppFab from './WhatsAppFab'

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

  useEffect(() => {
    setupScrollDefaults()
  }, [])

  useEffect(() => {
    window.scrollTo(0, 0)
    const root = mainRef.current || document
    const id = window.setTimeout(() => {
      hardRefreshScroll(root)
    }, 40)

    const onLoad = () => softRefreshScroll()
    window.addEventListener('load', onLoad)

    return () => {
      window.clearTimeout(id)
      window.removeEventListener('load', onLoad)
    }
  }, [location.pathname])

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
