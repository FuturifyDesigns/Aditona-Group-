import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import About from './pages/About'
import Contact from './pages/Contact'
import CreativeMarketing from './pages/CreativeMarketing'
import Enquiry from './pages/Enquiry'
import EventSolutions from './pages/EventSolutions'
import GolfSolutions from './pages/GolfSolutions'
import Home from './pages/Home'
import Insights from './pages/Insights'
import NotFound from './pages/NotFound'
import OurWork from './pages/OurWork'
import RequestQuote from './pages/RequestQuote'
import AdminLayout from './pages/admin/AdminLayout'
import AdminLogin from './pages/admin/AdminLogin'
import CardsAdmin from './pages/admin/CardsAdmin'
import CopyAdmin from './pages/admin/CopyAdmin'
import EnquiriesAdmin from './pages/admin/EnquiriesAdmin'
import ProjectsAdmin from './pages/admin/ProjectsAdmin'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/event-solutions" element={<EventSolutions />} />
        <Route path="/creative-marketing" element={<CreativeMarketing />} />
        <Route path="/golf-solutions" element={<GolfSolutions />} />
        <Route path="/our-work" element={<OurWork />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/request-quote" element={<RequestQuote />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Navigate to="enquiries" replace />} />
        <Route path="enquiries" element={<EnquiriesAdmin />} />
        <Route path="copy" element={<CopyAdmin />} />
        <Route path="cards" element={<CardsAdmin />} />
        <Route path="projects" element={<ProjectsAdmin />} />
      </Route>
    </Routes>
  )
}
