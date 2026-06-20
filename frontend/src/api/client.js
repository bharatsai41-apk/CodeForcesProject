const API_BASE = import.meta.env.VITE_API_URL ?? ''

export async function fetchUserProfile(userName) {
  const response = await fetch(`${API_BASE}/user-profile`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: userName.trim() }),
  })

  if (response.status === 429) {
    throw new Error('Rate limit reached. The API allows 3 requests per minute — please wait and try again.')
  }

  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Request failed (${response.status})`)
  }

  return response.json()
}
