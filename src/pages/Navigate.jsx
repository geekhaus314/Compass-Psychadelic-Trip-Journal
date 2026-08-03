import { useState } from 'react'
import { useStore, addEntry, deleteEntry } from '../storage.js'
import { PHASES, randomDeck } from '../prompts.js'

function fmtDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const emptyNotes = { prep: '', during: '', shore: '' }

export default function Navigate() {
  const store = useStore()
  const [notes, setNotes] = useState(emptyNotes)
  const [deck, setDeck] = useState([])
  const [openId, setOpenId] = useState(null)
  const [answer, setAnswer] = useState('')

  const reflections = [...store.nav].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  function draw() {
    const cards = randomDeck(3)
    setDeck(cards)
    setOpenId(null)
    setAnswer('')
  }

  function savePhase(key) {
    const phase = PHASES.find((p) => p.key === key)
    const text = notes[key]
    if (!text.trim()) return
    addEntry('nav', {
      kind: 'phase',
      phaseKey: key,
      phaseName: phase.name,
      body: text.trim(),
    })
    setNotes({ ...notes, [key]: '' })
  }

  function saveDeck(card) {
    if (!answer.trim()) return
    addEntry('nav', {
      kind: 'deck',
      phaseKey: 'deck',
      phaseName: 'the drawn card',
      prompt: card.prompt,
      body: answer.trim(),
    })
    setAnswer('')
    setOpenId(null)
  }

  function toJournal(r) {
    addEntry('journal', {
      title: r.kind === 'deck' ? 'from a drawn card' : r.phaseName,
      date: new Date().toISOString().slice(0, 10),
      mood: 3,
      tags: ['navigation'],
      body: (r.kind === 'deck' ? r.prompt + '\n\n' : '') + r.body,
    })
    deleteEntry('nav', r.id)
  }

  return (
    <>
      <section className="panel raised">
        <h2 className="section-title">navigating</h2>
        <p className="section-blurb">
          you are not lost, you are between maps. these are not answers — they are a hand on
          your shoulder while you find your own way.
        </p>

        <h3 className="section-title" style={{ fontSize: 16, marginTop: 4 }}>
          the three waters
        </h3>
        {PHASES.map((phase) => (
          <details key={phase.key} className="phase">
            <summary>
              {phase.name}
              <span className="phase-blurb">{phase.blurb}</span>
            </summary>
            <div className="phase-content">
              {phase.questions.map((q, i) => (
                <p key={i} className="prompt-q">
                  {q}
                </p>
              ))}
              <div className="field" style={{ marginTop: 10 }}>
                <label>your notes for this water</label>
                <textarea
                  className="input"
                  value={notes[phase.key]}
                  onChange={(e) => setNotes({ ...notes, [phase.key]: e.target.value })}
                />
              </div>
              <button
                className="btn small"
                onClick={() => savePhase(phase.key)}
                disabled={!notes[phase.key].trim()}
              >
                keep these notes
              </button>
            </div>
          </details>
        ))}

        <hr className="divider" />

        <h3 className="section-title" style={{ fontSize: 16 }}>
          the deck
        </h3>
        <p className="section-blurb" style={{ marginBottom: 10 }}>
          draw three cards when you do not know what to ask. take one; let the others go.
        </p>
        <button className="btn ghost" onClick={draw}>
          draw cards
        </button>

        {deck.length > 0 && (
          <div style={{ marginTop: 14 }}>
            {deck.map((c) => (
              <div key={c.id} className="card" onClick={() => setOpenId(openId === c.id ? null : c.id)}>
                <p className="quote-text" style={{ margin: 0, fontStyle: 'italic' }}>
                  {c.prompt}
                </p>
                {openId === c.id && (
                  <div style={{ marginTop: 10 }} onClick={(e) => e.stopPropagation()}>
                    <textarea
                      className="input"
                      value={answer}
                      onChange={(e) => setAnswer(e.target.value)}
                      placeholder="what comes up, unedited…"
                    />
                    <button
                      className="btn small"
                      style={{ marginTop: 8 }}
                      onClick={() => saveDeck(c)}
                      disabled={!answer.trim()}
                    >
                      keep this reflection
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h2 className="section-title" style={{ fontSize: 18 }}>
          reflections kept
        </h2>
        {reflections.length === 0 && (
          <div className="empty">nothing kept here yet. the water keeps everything.</div>
        )}
        {reflections.map((r) => (
          <article key={r.id} className="card">
            <header className="card-header">
              <h3 className="card-title">{r.phaseName}</h3>
              <span className="card-date">{fmtDate(r.createdAt)}</span>
            </header>
            {r.kind === 'deck' && (
              <div className="quote-card" style={{ marginTop: 8 }}>
                <p className="quote-text" style={{ fontSize: 14.5 }}>
                  {r.prompt}
                </p>
              </div>
            )}
            <div className="card-body">{r.body}</div>
            <div className="card-actions">
              <button className="btn small" onClick={() => toJournal(r)}>
                fold into journal
              </button>
              <button className="btn small danger" onClick={() => deleteEntry('nav', r.id)}>
                release
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}