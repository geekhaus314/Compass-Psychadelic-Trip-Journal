import { useState } from 'react'
import { useStore, addEntry, updateEntry, deleteEntry } from '../storage.js'

function fmtDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

const empty = {
  label: '',
  substance: '',
  dose: '',
  route: '',
  date: '',
  setting: '',
  intention: '',
  body: '',
  peak: '',
  integration: '',
}

export default function Sessions() {
  const store = useStore()
  const [draft, setDraft] = useState(empty)
  const [editingId, setEditingId] = useState(null)

  const sessions = [...store.sessions].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))

  function save() {
    if (!draft.label.trim() && !draft.body.trim()) return
    const patch = {
      ...draft,
      label: draft.label.trim() || 'untitled session',
      date: draft.date || new Date().toISOString().slice(0, 10),
    }
    if (editingId) {
      updateEntry('sessions', editingId, patch)
      setEditingId(null)
    } else {
      addEntry('sessions', patch)
    }
    setDraft(empty)
  }

  function edit(s) {
    setEditingId(s.id)
    setDraft({
      label: s.label,
      substance: s.substance || '',
      dose: s.dose || '',
      route: s.route || '',
      date: s.date || '',
      setting: s.setting || '',
      intention: s.intention || '',
      body: s.body || '',
      peak: s.peak || '',
      integration: s.integration || '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      <section className="panel raised">
        <h2 className="section-title">a session log</h2>
        <p className="section-blurb">
          the records keep you honest with yourself — what was set, what was felt, what came
          back with you. write it near the water, not weeks later.
        </p>

        <div className="row">
          <div className="field">
            <label>what we call it</label>
            <input
              className="input"
              value={draft.label}
              onChange={(e) => setDraft({ ...draft, label: e.target.value })}
              placeholder="the names we give things are half the story"
            />
          </div>
          <div className="field">
            <label>date</label>
            <input
              className="input"
              type="date"
              value={draft.date}
              onChange={(e) => setDraft({ ...draft, date: e.target.value })}
            />
          </div>
        </div>

        <div className="row">
          <div className="field">
            <label>substance</label>
            <input
              className="input"
              value={draft.substance}
              onChange={(e) => setDraft({ ...draft, substance: e.target.value })}
              placeholder="the molecule"
            />
          </div>
          <div className="field">
            <label>dose</label>
            <input
              className="input"
              value={draft.dose}
              onChange={(e) => setDraft({ ...draft, dose: e.target.value })}
              placeholder="be exact if you can"
            />
          </div>
          <div className="field">
            <label>route</label>
            <input
              className="input"
              value={draft.route}
              onChange={(e) => setDraft({ ...draft, route: e.target.value })}
              placeholder="oral, vapor, skin…"
            />
          </div>
        </div>

        <div className="field">
          <label>the set — what you walked in carrying</label>
          <textarea
            className="input"
            value={draft.intention}
            onChange={(e) => setDraft({ ...draft, intention: e.target.value })}
            placeholder="the mood before, the hopes, the fears, the day you had"
          />
        </div>

        <div className="field">
          <label>the setting — where you were</label>
          <textarea
            className="input"
            value={draft.setting}
            onChange={(e) => setDraft({ ...draft, setting: e.target.value })}
            placeholder="room, forest, people, light, sound, safety"
          />
        </div>

        <div className="field">
          <label>what happened</label>
          <textarea
            className="input"
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="the arc of it, the images, the heaviness, the laughter"
          />
        </div>

        <div className="field">
          <label>the turn — where it bent</label>
          <textarea
            className="input"
            value={draft.peak}
            onChange={(e) => setDraft({ ...draft, peak: e.target.value })}
            placeholder="the moment the current took hold, for better or worse"
          />
        </div>

        <div className="field">
          <label>what came back with you</label>
          <textarea
            className="input"
            value={draft.integration}
            onChange={(e) => setDraft({ ...draft, integration: e.target.value })}
            placeholder="written after — what your ordinary days should know"
          />
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            className="btn"
            onClick={save}
            disabled={!draft.label.trim() && !draft.body.trim()}
          >
            {editingId ? 'save changes' : 'keep the record'}
          </button>
          {editingId && (
            <button
              className="btn ghost"
              onClick={() => {
                setEditingId(null)
                setDraft(empty)
              }}
            >
              abandon edit
            </button>
          )}
        </div>
      </section>

      <section>
        {sessions.length === 0 && (
          <div className="empty">no sessions recorded yet. the water remembers anyway.</div>
        )}

        {sessions.map((s) => (
          <article key={s.id} className="card">
            <header className="card-header">
              <h3 className="card-title">{s.label}</h3>
              <span className="card-date">{fmtDate(s.createdAt)}</span>
            </header>
            <div className="tags" style={{ marginTop: 0 }}>
              {s.date && <span className="tag shelf-tag">{s.date}</span>}
              {s.substance && <span className="tag shelf-tag">{s.substance}</span>}
              {s.dose && <span className="tag shelf-tag">{s.dose}</span>}
            </div>
            {s.intention && (
              <div className="card-body">
                <strong style={{ color: 'var(--ink)' }}>set · </strong>
                {s.intention}
              </div>
            )}
            {s.setting && (
              <div className="card-body">
                <strong style={{ color: 'var(--ink)' }}>setting · </strong>
                {s.setting}
              </div>
            )}
            {s.body && (
              <div className="card-body">
                <strong style={{ color: 'var(--ink)' }}>the water · </strong>
                {s.body}
              </div>
            )}
            {s.peak && (
              <div className="card-body">
                <strong style={{ color: 'var(--ink)' }}>the turn · </strong>
                {s.peak}
              </div>
            )}
            {s.integration && (
              <div className="card-body">
                <strong style={{ color: 'var(--ink)' }}>ashore · </strong>
                {s.integration}
              </div>
            )}
            <div className="card-actions">
              <button className="btn small ghost" onClick={() => edit(s)}>
                edit
              </button>
              <button className="btn small danger" onClick={() => deleteEntry('sessions', s.id)}>
                release
              </button>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}