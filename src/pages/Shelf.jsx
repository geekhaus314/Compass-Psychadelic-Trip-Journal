import { useState } from 'react'
import { useStore, addEntry, deleteEntry, setSettings } from '../storage.js'
import { QUOTES } from '../quotes.js'
import { postToBluesky, testBluesky } from '../lib/bsky.js'

function fmtDate(iso) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

export default function Shelf() {
  const store = useStore()
  const [draft, setDraft] = useState({ title: '', body: '' })
  const [quote, setQuote] = useState(null)
  const [filter, setFilter] = useState('')
  const [handle, setHandle] = useState(store.settings.bskyHandle || '')
  const [pass, setPass] = useState(store.settings.bskyPassword || '')
  const [msg, setMsg] = useState(null)
  const [busy, setBusy] = useState(false)

  const notes = [...store.notes].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
  const authors = [...new Set(QUOTES.map((q) => q.author))].sort()

  function rollQuote() {
    setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)])
  }

  function saveNote() {
    if (!draft.body.trim()) return
    addEntry('notes', {
      title: draft.title.trim() || 'a thought',
      body: draft.body.trim(),
    })
    setDraft({ title: '', body: '' })
  }

  async function publish(text) {
    setMsg(null)
    setBusy(true)
    try {
      const url = await postToBluesky(handle, pass, text)
      setMsg({ kind: 'good', text: `posted — ${url}` })
    } catch (e) {
      setMsg({ kind: 'error', text: `could not post: ${e.message}` })
    } finally {
      setBusy(false)
    }
  }

  async function connect() {
    setMsg(null)
    setBusy(true)
    try {
      const session = await testBluesky(handle, pass)
      setSettings({ bskyHandle: handle, bskyPassword: pass })
      setMsg({ kind: 'good', text: `connected as @${session.handle}` })
    } catch (e) {
      setMsg({ kind: 'error', text: `not connected: ${e.message}` })
    } finally {
      setBusy(false)
    }
  }

  const quoteText = quote ? `${quote.text} — ${quote.author}` : ''

  return (
    <>
      <section className="panel raised">
        <h2 className="section-title">the shelf</h2>
        <p className="section-blurb">
          words worth keeping in reach — and your own small broadcasts. one voice is enough;
          many voices are a choir.
        </p>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn ghost" onClick={rollQuote}>
            give me a thought
          </button>
          {quote && (
            <>
              <button
                className="btn small ghost"
                onClick={() =>
                  addEntry('journal', {
                    title: `from the shelf — ${quote.author}`,
                    date: new Date().toISOString().slice(0, 10),
                    mood: 3,
                    tags: ['from the shelf'],
                    body: quote.text,
                  })
                }
              >
                keep in journal
              </button>
              <button
                className="btn small"
                disabled={!handle || !pass || busy}
                onClick={() => publish(quoteText)}
              >
                post to bluesky
              </button>
            </>
          )}
        </div>

        {quote && (
          <div className="quote-card" style={{ marginTop: 16 }}>
            <p className="quote-text">{quote.text}</p>
            <p className="quote-author">{quote.author}</p>
          </div>
        )}
        {msg && (
          <div className={`notice ${msg.kind}`} style={{ marginTop: 12 }}>
            {msg.text}
          </div>
        )}
      </section>

      <section className="panel">
        <h2 className="section-title" style={{ fontSize: 18 }}>
          a note of your own
        </h2>
        <div className="field">
          <label>title</label>
          <input
            className="input"
            value={draft.title}
            onChange={(e) => setDraft({ ...draft, title: e.target.value })}
            placeholder="a few words to hang the thought on"
          />
        </div>
        <div className="field">
          <label>body</label>
          <textarea
            className="input"
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
            placeholder="what you would put on a wall where everyone walks by"
          />
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button className="btn" onClick={saveNote} disabled={!draft.body.trim()}>
            put it on the shelf
          </button>
          <button
            className="btn"
            disabled={!draft.body.trim() || !handle || !pass || busy}
            onClick={() => publish(draft.body.trim())}
          >
            put it on the shelf &amp; post it
          </button>
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title" style={{ fontSize: 18 }}>
          your notes
        </h2>
        {notes.length === 0 && (
          <div className="empty">the shelf is bare. the wall is listening.</div>
        )}
        {notes.map((n) => (
          <article key={n.id} className="card">
            <header className="card-header">
              <h3 className="card-title">{n.title}</h3>
              <span className="card-date">{fmtDate(n.createdAt)}</span>
            </header>
            <div className="card-body">{n.body}</div>
            <div className="card-actions">
              <button
                className="btn small"
                disabled={!handle || !pass || busy}
                onClick={() => publish(n.body)}
              >
                post to bluesky
              </button>
              <button className="btn small danger" onClick={() => deleteEntry('notes', n.id)}>
                take down
              </button>
            </div>
          </article>
        ))}
      </section>

      <section className="panel">
        <h2 className="section-title" style={{ fontSize: 18 }}>
          the library
        </h2>
        <div className="row">
          <div className="field">
            <label>read by</label>
            <select className="input" value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="">everyone</option>
              {authors.map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div style={{ marginTop: 4 }}>
          {QUOTES.filter((q) => !filter || q.author === filter).map((q, i) => (
            <div key={i} className="quote-card" style={{ marginBottom: 14 }}>
              <p className="quote-text" style={{ fontSize: 14.5 }}>
                {q.text}
              </p>
              <p className="quote-author">{q.author}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel">
        <h2 className="section-title" style={{ fontSize: 18 }}>
          the wire (bluesky)
        </h2>
        <p className="section-blurb">
          nothing here leaves your browser except the single note you choose to post. use an app
          password, never your real one — make it at{' '}
          <a href="https://bsky.app/settings/app-passwords" target="_blank" rel="noreferrer">
            bsky.app/settings/app-passwords
          </a>
          . it is stored only on this device.
        </p>
        <div className="row">
          <div className="field">
            <label>handle</label>
            <input
              className="input"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="you.bsky.social"
            />
          </div>
          <div className="field">
            <label>app password</label>
            <input
              className="input"
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="xxxx-xxxx-xxxx-xxxx"
            />
          </div>
        </div>
        <button className="btn ghost" onClick={connect} disabled={busy}>
          test the connection
        </button>
      </section>
    </>
  )
}