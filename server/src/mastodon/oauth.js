const masto = require("masto")
const Database = require("better-sqlite3")
const fetch = require("node-fetch")
const { getFormData } = require("../utils")
const { parseUsername } = require("./username")

const registeredAppDB = new Database("mastodon.apps.db")

registeredAppDB.exec(
  /* SQL */
  `CREATE TABLE IF NOT EXISTS registered_apps (
      'server' TEXT PRIMARY KEY,
      'id' TEXT,
      'name' TEXT,
      'website' TEXT,
      'redirectUri' TEXT,
      'clientId' TEXT,
      'clientSecret' TEXT,
      'vapidKey' TEXT,
      'scopes' TEXT
    );`
)

const getMastodonAppQuery = registeredAppDB.prepare(
  /* SQL */
  `SELECT * FROM registered_apps 
  WHERE ( server = @server );`
)

const createMastodonAppQuery = registeredAppDB.prepare(
  /* SQL */
  `INSERT INTO registered_apps (
      server,
      id,
      name,
      website,
      redirectUri,
      clientId,
      clientSecret,
      vapidKey,
      scopes)
    VALUES (
      @server,
      @id,
      @name,
      @website,
      @redirectUri,
      @clientId,
      @clientSecret,
      @vapidKey,
      @scopes);`
)

function get(server) {
  const result = getMastodonAppQuery.get({ server })
  return result
}
async function set(server, mastodonApp) {
  createMastodonAppQuery.run({ ...mastodonApp, server })
  return get(server)
}

function prefixServerWithHttps(server) {
  if (!server.startsWith("https://")) {
    server = `https://${server}`
  }
  return server
}

/**
 * Get and create if not exist an OAuth app
 * @param {string} server
 * @returns {Promise<masto.Client>}
 */
async function getOrCreateApp(selfUrl, server) {
  server = prefixServerWithHttps(server)
  let registeredApp = get(server)
  let client
  if (!registeredApp) {
    try {
      const instance = await masto.login({ url: server })
      const redirectUri = new URL("/mastodon/callback", selfUrl)
      redirectUri.searchParams.append("server", server)
      client = await instance.apps.create({
        clientName: "Twitter to Mastodon",
        redirectUris: redirectUri.href,
        scopes: "read write follow push",
        website: "https://twittermastodon.com",
      })
    } catch {
      throw new Error("Failed to reach the Mastodon instance")
    }
    await set(server, { ...client, scopes: "read write follow push" })
    registeredApp = get(server)
  }
  return registeredApp
}

async function myAccount(server, accessToken) {
  server = prefixServerWithHttps(server)
  const profileEndpoint = new URL("/api/v1/accounts/verify_credentials", server)
    .href
  const response = await fetch(profileEndpoint, {
    headers: { Authorization: `bearer ${accessToken}` },
  })
  const userProfile = await response.json()
  if (!response.ok || userProfile.error) {
    throw new Error("Failed to authenticate to Mastodon")
  }
  return {
    ...parseUsername(userProfile.url),
    id: userProfile.id,
    name: userProfile.display_name,
  }
}

/**
 *
 * @param {string} server
 * @param {masto.Client} application
 */
function loginURL(server, application) {
  server = prefixServerWithHttps(server)
  const authEndpoint = new URL("/oauth/authorize", server).href
  const options = {
    client_id: application.clientId,
    redirect_uri: application.redirectUri,
    response_type: "code",
    scope: application.scopes,
  }
  const queryString = Object.keys(options)
    .map((key) => `${key}=${encodeURIComponent(options[key])}`)
    .join("&")
  const loginURI = new URL(`?${queryString}`, authEndpoint).href
  return loginURI
}

async function accessToken(server, code) {
  server = prefixServerWithHttps(server)
  const application = get(server)
  if (!application) {
    throw Error("Failed to find the OAuth2 application for the given instance")
  }
  const tokenEndpoint = new URL("/oauth/token", server).href

  const options = {
    client_id: application.clientId,
    client_secret: application.clientSecret,
    redirect_uri: application.redirectUri,
    grant_type: "authorization_code",
    code,
    scopes: application.scopes,
  }

  let response = await fetch(tokenEndpoint, {
    method: "POST",
    body: getFormData(options),
  })
  let accessToken = await response.json()
  if (!response.ok || accessToken.error) {
    throw new Error("Authentication failed")
  }
  accessToken = accessToken.access_token
  const userProfile = await myAccount(server, accessToken)

  return { accessToken, ...userProfile }
}

module.exports = {
  registeredAppDB,
  getOrCreateApp,
  loginURL,
  myAccount,
  accessToken,
  prefixServerWithHttps,
}
