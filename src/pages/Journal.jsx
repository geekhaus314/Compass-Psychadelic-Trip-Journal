import { useState } from 'react'
import { useStore, addEntry, updateEntry, deleteEntry } from '../storage.js'
import { randomDeck } from '../prompts.js'

const MOODS = [
  { v: 1, label: 'shade' },
  { v: 2, label: 'grief' },
  { v: 3, label: 'steady' },
  { v: 4, label: 'open' },
  { v: 5, label: 'alive' },
]

function fmtDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Journal() {
  const store = useStore()
  const [draft, setDraft] = useState({ title: '', date: '', mood: 3, tags: '', body: '' })
  const [editingId, setEditingId] = useState(null)
  const [rolled, setRolled] = useState(null)

  const entries = [...store.journal].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  function roll() {
    const [c] = randomDeck(1)
    setRolled(c)
  }

  function save() {
    if (!draft.body.trim()) return
    const tags = draft.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean)
    const patch = {
      title: draft.title.trim() || 'untitled',
      date: draft.date || new Date().toISOString().slice(0, 10),
      mood: Number(draft.mood),
      tags,
      body: draft.body.trim(),
    }
    if (editingId) {
      updateEntry('journal', editingId, patch)
      setEditingId(null)
    } else {
      addEntry('journal', patch)
    }
    setDraft({ title: '', date: '', mood: 3, tags: '', body: '' })
    setRolled(null)
  }

  function edit(e) {
    setEditingId(e.id)
    setDraft({
      title: e.title,
      date: e.date,
      mood: e.mood,
      tags: e.tags.join(', '),
      body: e.body,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section className="panel raised">
        <h2 className="section-title">{editingId ? 'turn the page' : 'write'}</h2>
        <p className="section-blurb">
          no one is reading. say it the way it actually happened, not the way it should sound.
        </p>

        {rolled && (
          <div className="notice">
            <em>{rolled.prompt}</em>
          </div>
        )}

        <div className="row">
          <div className="field">
            <label>title</label>
            <input
              className="input"
              value={draft.title}
              onChange={(e) => setDraft({ ...draft, title: e.target.value })}
              placeholder="a name for the thought"
            />
          </div>
          <div className="field" style={{ minWidth: 150 }}>
            <label>date</label>
            <input
              className="input"
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </div>
          <div className="field" style={{ minWidth: 150 }}>
            <label>weather of the self</label>
            <select
              className="input"
              value={draft.mood}
              onChange={(e) => setDraft({ ...draft, mood: e.target.value })}
            >
              {MOODS.map((m) => (
                <option key={m.v} value={m.v}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="field">
          <label>threads (comma separated)</label>
          <input
            className="input"
            value={draft.tags}
            onChange={(e) => setDraft({ ...draft, tags: e.target.value })}
            placeholder="death, parents, the sea, the void…"
          />
        </div>

        <div className="field">
          <label>the words themselves</label>
          <textarea
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="begin anywhere. mid-sentence is fine."
          />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn" onClick={save} disabled={!draft.body.trim()}>
            {editingId ? 'save changes' : 'set down'}
          </button>
          <button className="btn ghost" onClick={roll}>
            roll a thought
          </button>
          {editingId && (
            <button
              className="btn ghost"
              onClick={() => {
                setEditingId(null)
                setDraft({ title: '', date: '', mood: 3, tags: '', body: '' })
                setRolled(null)
              }}
            >
              abandon edit
            </button>
          )}
        </div>
      </section>

      <section>
        {entries.length === 0 && (
          <div className="empty">the page is still blank. that is not a failure.</div>
        )}

        {entries.map((e) => (
          <article key={e.id} className="card">
            <header className="card-header">
              <h3 className="card-title">{e.title}</h3>
              <span className="mood" title={MOODS.find((m) => m.v === e.mood)?.label}>
                {MOODS.map((m) => (
                  <span key={m.v} className={`mood-dot ${e.mood >= m.v ? 'lit' : ''}`} />
                ))}
              </span>
              <span className="card-date">{fmtDate(e.createdAt)}</span>
            </header>
            <div className="card-body">{e.body}</div>
            {e.tags.length > 0 && (
              <div className="tags">
                {e.tags.map((t) => (
                  <span key={t} className="tag">
                    {t}
                  </span>
                ))}
              </div>
            )}
            <div className="card-actions">
              <button className="btn small ghost" onClick={() => edit(e)}>
                edit
              </button>
              <button className="btn small danger" onClick={() => deleteEntry('journal', e.id)}>
                release
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}