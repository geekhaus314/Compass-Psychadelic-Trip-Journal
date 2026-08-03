const PDS = 'https://bsky.social'

export async function testBluesky(handle, appPassword) {
  const res = await fetch(`${PDS}/xrpc/com.atproto.server.createSession`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: handle, password: appPassword }),
  })
  if (!res.ok) {
    throw new Error(await res.text().then((t) => {
      try { return JSON.parse(t).message } catch { return t }
    }))
  }
  return res.json()
}

export async function postToBluesky(handle, appPassword, text) {
  const session = await testBluesky(handle, appPassword)
  const record = {
    $type: 'app.bsky.feed.post',
    text,
    createdAt: new Date().toISOString(),
  }
  const res = await fetch(`${PDS}/xrpc/com.atproto.repo.createRecord`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${session.accessJwt}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      repo: session.did,
      collection: 'app.bsky.feed.post',
      record,
    }),
  })
  if (!res.ok) {
    throw new Error(await res.text().then((t) => {
      try { return JSON.parse(t).message } catch { return t }
    }))
  }
  const created = await res.json()
  return `https://bsky.app/profile/${session.handle}/post/${created.uri.split('/').pop()}`
}