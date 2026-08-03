import { useEffect, useReducer } from 'react'

const KEY = 'compass.state.v1'

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function emptyState() {
  return {
    journal: [],
    sessions: [],
    nav: [],
    notes: [],
    settings: { wanderer: '', bskyHandle: '', bskyPassword: '' },
  }
}

function load() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyState()
    const parsed = JSON.parse(raw)
    return {
      journal: Array.isArray(parsed.journal) ? parsed.journal : [],
      sessions: Array.isArray(parsed.sessions) ? parsed.sessions : [],
      nav: Array.isArray(parsed.nav) ? parsed.nav : [],
      notes: Array.isArray(parsed.notes) ? parsed.notes : [],
      settings: Object.assign(
        { wanderer: '', bskyHandle: '', bskyPassword: '' },
        parsed.settings || {}
      ),
    }
  } catch (e) {
    return emptyState()
  }
}

let store = load()
const subs = new Set()

function commit(next) {
  store = next
  try {
    localStorage.setItem(KEY, JSON.stringify(store))
  } catch (e) {
    console.error('storage failed', e)
  }
  subs.forEach((fn) => fn())
}

export function getStore() {
  return store
}

export function useStore() {
  const [, tick] = useReducer((x) => x + 1, 0)
  useEffect(() => {
    subs.add(tick)
    return () => subs.delete(tick)
  }, [])
  return store
}

export function addEntry(collection, patch) {
  const entry = { id: uid(), createdAt: new Date().toISOString(), ...patch }
  commit({ ...store, [collection]: [...store[collection], entry] })
  return entry
}

export function updateEntry(collection, id, patch) {
  commit({
    ...store,
    [collection]: store[collection].map((e) => (e.id === id ? { ...e, ...patch } : e)),
  })
}

export function deleteEntry(collection, id) {
  commit({ ...store, [collection]: store[collection].filter((e) => e.id !== id) })
}

export function setSettings(patch) {
  commit({ ...store, settings: { ...store.settings, ...patch } })
}

export function replaceAll(data) {
  const next = {
    journal: Array.isArray(data.journal) ? data.journal : [],
    sessions: Array.isArray(data.sessions) ? data.sessions : [],
    nav: Array.isArray(data.nav) ? data.nav : [],
    notes: Array.isArray(data.notes) ? data.notes : [],
    settings: Object.assign(
      { wanderer: '', bskyHandle: '', bskyPassword: '' },
      data.settings || {}
    ),
  }
  commit(next)
}

export function resetAll() {
  commit(emptyState())
}

export { uid }