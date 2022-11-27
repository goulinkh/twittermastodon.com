const fetch = require("node-fetch")
const { prefixServerWithHttps } = require("./oauth")

async function followAccount(server, accessToken, username) {
  server = prefixServerWithHttps(server)
  const id = await accountId(server, accessToken, username)
  const followEndpoint = new URL(`/api/v1/accounts/${id}/follow`, server).href
  const response = await fetch(followEndpoint, {
    method: "POST",
    headers: { Authorization: `bearer ${accessToken}` },
  })
  const payload = await response.json()
  if (!response.ok || payload.error) {
    throw new Error("Failed to follow an account")
  }
}

/**
 * accepted formats:
 * - `username`
 * - `@username@server`
 * @param {string} username
 */
async function accountId(server, accessToken, username) {
  server = prefixServerWithHttps(server)

  const searchEndpoint = new URL(
    `/api/v1/accounts/search?q=${username}`,
    server
  ).href
  const response = await fetch(searchEndpoint, {
    headers: { Authorization: `bearer ${accessToken}` },
  })
  const payload = await response.json()
  if (!response.ok || payload.error) {
    throw new Error("Failed to search for a username")
  }
  const firstAccountMatch = payload[0]
  if (!firstAccountMatch) {
    throw new Error("Failed to find a username")
  }
  return firstAccountMatch.id
}

module.exports = { followAccount }
