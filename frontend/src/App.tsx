import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { Dashboard } from '@/pages/Dashboard'
import { CountryExplorerPage } from '@/pages/CountryExplorerPage'
import { PredictionPage } from '@/pages/PredictionPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/country" element={<CountryExplorerPage />} />
          <Route path="/prediction" element={<PredictionPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
