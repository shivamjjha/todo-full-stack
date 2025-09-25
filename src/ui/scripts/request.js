// wrapper to send authenticated requests to server
export async function sendRequest(url, method = "GET", body = null) {
  const user = localStorage.getItem("user")
  const headers = {
    "Content-Type": "application/json",
  }
  if (user) {
    const parsed = JSON.parse(user)
    headers["Authorization"] = `Bearer ${parsed.token}`
  }
  const response = await fetch(url, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  })
  if (!response.ok) {
    const error = await response.json()
    throw error
  }
  return response.json()
}
