const crypto = require("crypto")
const fetch = require("node-fetch")
const Database = require("better-sqlite3")

const twitterOAuthDB = new Database("twitter.oauth.db")

twitterOAuthDB.exec(
  /* SQL */
  `CREATE TABLE IF NOT EXISTS twitter_oauth (
      'id' TEXT PRIMARY KEY,
      'challenge' TEXT,
      'createdAt' TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );`
)

const getOAuthChallenge = twitterOAuthDB.prepare(
  /* SQL */
  `SELECT * FROM twitter_oauth 
  WHERE ( id = @id );`
)

const createOAuthChallenge = twitterOAuthDB.prepare(
  /* SQL */
  `INSERT INTO twitter_oauth (id, challenge)
  VALUES (@id, @challenge);`
)

async function saveCodeChallenge(id, challenge) {
  createOAuthChallenge.run({ id, challenge })
  return getCodeChallenge(id)
}
async function getCodeChallenge(id) {
  return getOAuthChallenge.get({ id })
}

const client_id = process.env.TWITTER_CLIENT_ID

async function twitterLoginUrl(server) {
  const id = crypto.randomUUID()
  const challenge = crypto.randomUUID()
  const redirectUri = new URL("/twitter/callback", server)
  await saveCodeChallenge(id, challenge)
  const twitterLoginUrl = new URL("/i/oauth2/authorize", "https://twitter.com/")
  twitterLoginUrl.searchParams.set("response_type", "code")
  twitterLoginUrl.searchParams.set("client_id", client_id)
  twitterLoginUrl.searchParams.set("redirect_uri", redirectUri.href)
  twitterLoginUrl.searchParams.set("state", id)
  twitterLoginUrl.searchParams.set(
    "scope",
    "tweet.read users.read follows.read"
  )
  twitterLoginUrl.searchParams.set("code_challenge", challenge)
  twitterLoginUrl.searchParams.set("code_challenge_method", "plain")
  return twitterLoginUrl.href
}

async function twitterAuth(server, code, id) {
  if (!(id || code)) {
    throw new Error("failed to authenticate to Twitter")
  }
  const { challenge } = await getCodeChallenge(id)
  const redirectUri = new URL("/twitter/callback", server)
  const options = {
    code,
    grant_type: "authorization_code",
    client_id,
    redirect_uri: redirectUri.href,
    code_verifier: challenge,
  }
  const queryString = Object.keys(options)
    .map((key) => `${key}=${encodeURIComponent(options[key])}`)
    .join("&")
  const response = await fetch("https://api.twitter.com/2/oauth2/token", {
    method: "POST",
    body: queryString,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  })
  const payload = await response.json()
  const accessToken = payload.access_token
  if (!(response.ok && accessToken)) {
    throw new Error("Failed to authenticate to Twitter")
  }
  return accessToken
}

async function meHandler(token) {
  const data = await fetch("https://api.twitter.com/2/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  if (data.status !== 200) {
    throw new Error("Twitter API Error")
  }
  return await data.json()
}

async function followingOnTwitter(accessToken) {
  const {
    data: { id: userId },
  } = await meHandler(accessToken)
  let nextToken = ""
  const users = []
  while (true) {
    const url = new URL(
      `/2/users/${userId}/following`,
      "https://api.twitter.com/"
    )
    url.searchParams.set("max_results", 1000)
    if (nextToken) {
      url.searchParams.set("pagination_token", nextToken)
    }
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    if (!response.ok) {
      break
    }
    const json = await response.json()
    if (!(json?.meta?.result_count && json.meta.result_count > 0)) {
      break
    }
    if (json.data) {
      users.push(json.data)
    }
    if (!json.meta.next_token) {
      break
    }
    nextToken = json.meta.next_token
  }
  return users.flat(1)
}

module.exports = {
  twitterOAuthDB,
  twitterLoginUrl,
  twitterAuth,
  followingOnTwitter,
  meHandler,
}
