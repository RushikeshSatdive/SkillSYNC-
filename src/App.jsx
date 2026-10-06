import { Route, Routes } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import { ToastStack } from './components/ui/Kit'
import ErrorBoundary from './components/ErrorBoundary'
import SiteLayout from './components/layout/SiteLayout'
import AppLayout from './components/layout/AppLayout'

import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import SkillProfile from './pages/SkillProfile'
import GapAnalysis from './pages/GapAnalysis'
import Matching from './pages/Matching'
import PeerProfile from './pages/PeerProfile'
import LearningPath from './pages/LearningPath'
import Practice from './pages/Practice'
import Exchange from './pages/Exchange'
import Progress from './pages/Progress'
import Proof from './pages/Proof'
import Community from './pages/Community'
import Impact from './pages/Impact'
import Pricing from './pages/Pricing'
import Market from './pages/Market'
import UnitEconomics from './pages/UnitEconomics'
import GoToMarket from './pages/GoToMarket'
import Financials from './pages/Financials'
import Funding from './pages/Funding'
import About from './pages/About'
import NotFound from './pages/NotFound'

function Toasts() {
  const { toasts, dismissToast } = useApp()
  return <ToastStack toasts={toasts} onDismiss={dismissToast} />
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <Routes>
        {/* Public site — top navigation + footer */}
          <Route element={<SiteLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/about" element={<About />} />
          </Route>

        {/* Product surface — sidebar dashboard shell */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<SkillProfile />} />
            <Route path="/gap-analysis" element={<GapAnalysis />} />
            <Route path="/matching" element={<Matching />} />
            <Route path="/peer/:id" element={<PeerProfile />} />
            <Route path="/learning-path" element={<LearningPath />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/exchange" element={<Exchange />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/proof" element={<Proof />} />
            <Route path="/community" element={<Community />} />
            <Route path="/impact" element={<Impact />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/market" element={<Market />} />
            <Route path="/unit-economics" element={<UnitEconomics />} />
            <Route path="/go-to-market" element={<GoToMarket />} />
            <Route path="/financials" element={<Financials />} />
            <Route path="/funding" element={<Funding />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
        <Toasts />
      </AppProvider>
    </ErrorBoundary>
  )
}
