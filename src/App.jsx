import { useState } from 'react'
import Journal from './pages/Journal.jsx'
import Sessions from './pages/Sessions.jsx'
import Navigate from './pages/Navigate.jsx'
import Shelf from './pages/Shelf.jsx'
import Data from './pages/Data.jsx'

const TABS = [
  { key: 'journal', label: 'Journal' },
  { key: 'sessions', label: 'Sessions' },
  { key: 'navigate', label: 'Navigate' },
  { key: 'shelf', label: 'Shelf' },
  { key: 'data', label: 'Data' },
]

export default function App() {
  const [tab, setTab] = useState('journal')

  return (
    <div className="shell">
      <header className="masthead">
        <div className="glyph">◐</div>
        <h1>compass</h1>
        <p className="tagline">a quiet instrument for the human psyche</p>
        <p className="privacy">everything you write stays in this browser — back it up from the Data tab</p>
      </header>

      <nav className="tabs">
        {TABS.map((t) => (
          <button
            key={t.key}
            className={tab === t.key ? 'active' : ''}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      {tab === 'journal' && <Journal />}
      {tab === 'sessions' && <Sessions />}
      {tab === 'navigate' && <Navigate />}
      {tab === 'shelf' && <Shelf />}
      {tab === 'data' && <Data />}
    </div>
  )
}