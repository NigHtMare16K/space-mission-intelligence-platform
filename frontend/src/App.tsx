import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { CountryExplorerPage } from '@/pages/CountryExplorerPage'
import { PredictionPage } from '@/pages/PredictionPage'
import { MissionSearchPage } from '@/pages/MissionSearchPage'
import { MissionRecommendationPage } from '@/pages/MissionRecommendationPage'
import { MissionComparisonPage } from '@/pages/MissionComparisonPage'
import { ChatbotPage } from '@/pages/ChatbotPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/country" element={<CountryExplorerPage />} />
          <Route path="/search" element={<MissionSearchPage />} />
          <Route path="/recommend" element={<MissionRecommendationPage />} />
          <Route path="/compare" element={<MissionComparisonPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
          <Route path="/chat" element={<ChatbotPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
