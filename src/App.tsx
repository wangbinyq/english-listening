import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import { DictationPage } from './pages/DictationPage'
import { HistoryPage } from './pages/HistoryPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navigation">
          <ul>
            <li>
              <Link to="/">Dictation</Link>
            </li>
            <li>
              <Link to="/history">History</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<DictationPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
