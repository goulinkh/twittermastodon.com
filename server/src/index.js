const { parseUsername, generateUsername } = require("./mastodon/username")
const {
  getOrCreateApp,
  loginURL: mastodonLoginURL,
  accessToken: mastodonAccessToken,
  myAccount: myMastodonAccount,
} = require("./mastodon/oauth")
const { twitterLoginUrl, twitterAuth } = require("./twitter/oauth")

const {
  mastodonUsernameForTwitterAccount,
  followings,
  myAccount: myTwitterAccount,
} = require("./twitter/account")

const { followAccount } = require("./mastodon/account")
const crypto = require("crypto")
require("./cronjobs")

const secretKey = process.env.SECRET_KEY
const dashboard = process.env.DASHBOARD_URL
const publicServerUrl = process.env.PUBLIC_URL

const fastify = require("fastify")({ logger: { level: "error" } })
fastify.register(require("@fastify/secure-session"), {
  key: Buffer.from(crypto.createHash("md5").update(secretKey).digest("hex")),
  cookie: {
    path: "/",
    httpOnly: true,
  },
})
fastify.register(require("@fastify/cors"), {
  origin: dashboard,
  credentials: true,
})

async function userState(request) {
  let { twitter, mastodon } = request.session.data()
  try {
    twitter = twitter?.accessToken
      ? {
          ...(await myTwitterAccount(twitter.accessToken)).data,
          accessToken: twitter.accessToken,
        }
      : null
  } catch {
    twitter = null
  }
  try {
    mastodon = mastodon?.accessToken
      ? {
          ...(await myMastodonAccount(mastodon.server, mastodon.accessToken)),
          accessToken: mastodon.accessToken,
        }
      : null
  } catch {
    mastodon = null
  }
  request.session.set("twitter", twitter)
  request.session.set("mastodon", mastodon)
  return { twitter, mastodon }
}

// Declare a route
fastify.get("/ping", async (_request, _reply) => {
  return { message: "pong", date: new Date() }
})

fastify.get("/status", async (request, reply) => {
  return userState(request)
})
fastify.get("/logout", async (request, reply) => {
  request.session.delete()
  reply.redirect(dashboard)
})

fastify.get("/twitter/login", async (_request, reply) => {
  reply.redirect(await twitterLoginUrl(publicServerUrl))
})

fastify.get("/twitter/callback", async (request, reply) => {
  try {
    const accessToken = await twitterAuth(
      publicServerUrl,
      request.query.code,
      request.query.state
    )
    request.session.set("twitter", {
      ...(await myTwitterAccount(accessToken)).data,
      accessToken,
    })
    reply.redirect(dashboard)
  } catch (error) {
    request.log.error(error)
    reply.redirect(new URL(`/?message=${error.message}`, dashboard).href)
  }
})

fastify.get("/mastodon/login", async (request, reply) => {
  const { server, username: _ } = parseUsername(request.query.username)
  if (!server) {
    reply.redirect(new URL(`/?message=Undefined server URL`, dashboard).href)
  }
  try {
    const client = await getOrCreateApp(publicServerUrl, server)
    reply.redirect(mastodonLoginURL(server, client))
  } catch (error) {
    request.log.error(error)
    reply.redirect(new URL(`/?message=${error.message}`, dashboard).href)
  }
})

fastify.get("/mastodon/callback", async (request, reply) => {
  const { code, server } = request.query
  try {
    const mastodonSession = await mastodonAccessToken(server, code)

    request.session.set("mastodon", mastodonSession)
    reply.redirect(dashboard)
  } catch (error) {
    request.log.error(error)
    reply.redirect(new URL(`/?message=${error.message}`, dashboard).href)
  }
})

fastify.post("/follow/all", async (request, _reply) => {
  let { twitter, mastodon } = request.session
  if (!(twitter && mastodon)) throw new Error("Not authenticated")
  const twitterFollowings = await followings(twitter.accessToken)
  const mastodonUsernames = []
  for (const twitterAccount of twitterFollowings) {
    let mastodonUsername = await mastodonUsernameForTwitterAccount(
      twitterAccount
    )
    if (!mastodonUsername) {
      continue
    }
    mastodonUsername = generateUsername(
      mastodonUsername.username,
      mastodonUsername.server
    )
    try {
      await followAccount(
        mastodon.server,
        mastodon.accessToken,
        mastodonUsername
      )
      mastodonUsernames.push({ mastodonUsername, status: "success" })
    } catch (e) {
      mastodonUsernames.push({
        mastodonUsername,
        status: e.message,
      })
    }
  }
  return { self: mastodon, list: mastodonUsernames }
})

fastify.post("/update/twitter", async (request, reply) => {
  let { twitter } = request.session
  if (!twitter) throw new Error("Not authenticated")
})
const start = async () => {
  const res = await fastify.listen({ port: 8080, host: "::" })
  console.log("Listening on:", res)
}
start()
