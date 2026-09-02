import { useRef, useState } from 'react'
import { useStore, replaceAll, resetAll, setSettings } from '../storage.js'

export default function Data() {
  const store = useStore()
  const fileRef = useRef(null)
  const [msg, setMsg] = useState(null)
  const [confirmReset, setConfirmReset] = useState(false)
  const [wanderer, setWanderer] = useState(store.settings.wanderer || '')

  function exportAll() {
    const blob = new Blob([JSON.stringify(store, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    const stamp = new Date().toISOString().slice(0, 10)
    a.href = url
    a.download = `compass-${stamp}.json`
    a.click()
    URL.revokeObjectURL(url)
    setMsg({ kind: 'good', text: 'a copy of everything is on its way down.' })
  }

  function importAll(file) {
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result)
        if (!Array.isArray(data.journal) && !Array.isArray(data.sessions)) {
          throw new Error('not a compass backup file')
        }
        replaceAll(data)
        setMsg({ kind: 'good', text: 'your words are home again. this replaces what was here.' })
      } catch (e) {
        setMsg({ kind: 'error', text: `could not read that file: ${e.message}` })
      }
    }
    reader.readAsText(file)
  }

  function saveName() {
    setSettings({ wanderer: wanderer.trim() })
    setMsg({ kind: 'good', text: 'kept. the name is only for you.' })
  }

  return (
    <>
      <section className="panel raised">
        <h2 className="section-title">data</h2>
        <p className="section-blurb">
          everything lives in this browser, on this device, and nowhere else. the sea keeps no
          records — so keep your own.
        </p>

        {msg && (
          <div className={`notice ${msg.kind}`}>
            {msg.text}
          </div>
        )}

        <div className="field">
          <label>what the water calls you</label>
          <input
            className="input"
            value={wanderer}
            onChange={(e) => setWanderer(e.target.value)}
            placeholder="a name for the one who journals"
          />
        </div>
        <button className="btn ghost" onClick={saveName}>
          keep the name
        </button>

        <hr className="divider" />

        <h3 className="section-title" style={{ fontSize: 16 }}>
          back up
        </h3>
        <div className="file-row" style={{ marginTop: 10 }}>
          <button className="btn" onClick={exportAll}>
            download everything
          </button>
          <span style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
            one file, all entries, all sessions, all notes
          </span>
        </div>

        <h3 className="section-title" style={{ fontSize: 16, marginTop: 22 }}>
          restore
        </h3>
        <div className="file-row" style={{ marginTop: 10 }}>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            onChange={(e) => {
              if (e.target.files[0]) importAll(e.target.files[0])
              e.target.value = ''
            }}
          />
        </div>
        <p style={{ color: 'var(--ink-faint)', fontSize: 13 }}>
          restoring replaces what is currently here. export first, always.
        </p>

        <hr className="divider" />

        <h3 className="section-title" style={{ fontSize: 16 }}>
          the deep
        </h3>
        {!confirmReset ? (
          <button className="btn danger" onClick={() => setConfirmReset(true)}>
            erase everything
          </button>
        ) : (
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
            <span style={{ color: 'var(--bad)', fontSize: 14 }}>
              are you certain? there is no getting it back.
            </span>
            <button
              className="btn danger"
              onClick={() => {
                resetAll()
                setConfirmReset(false)
                setMsg({ kind: 'good', text: 'gone. the water is clean again.' })
              }}
            >
              yes, erase it all
            </button>
            <button className="btn ghost" onClick={() => setConfirmReset(false)}>
              no, keep everything
            </button>
          </div>
        )}
      </section>
    </>
  )
}