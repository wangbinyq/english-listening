import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { DictationPage } from './pages/DictationPage'
import { HistoryPage } from './pages/HistoryPage'
import { DictationProvider } from './contexts/DictationProvider'
import { Navigation } from './components/Navigation'
import './App.css'

function App() {
  return (
    <Router>
      <DictationProvider>
        <div className="App">
          <Navigation />

          <Routes>
            <Route path="/" element={<DictationPage />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </div>
      </DictationProvider>
    </Router>
  )
}

export default App
