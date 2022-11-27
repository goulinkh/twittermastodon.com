// username src: https://github.com/mastodon/mastodon/blob/HEAD/app/models/account.rb#L64
const USERNAME = /^@?(?<username>[A-Z0-9_]+([a-z0-9_\.-]+[a-z0-9_]+)?)$/i

// format @username@instance.url
const USERNAME_SERVER_URL =
  /^@?(?<username>[A-Z0-9_]+([a-z0-9_\.-]+[a-z0-9_]+)?)@(https:\/\/)?(?<server>[A-Z0-9.-]+\.[A-Z]{2,})$/i
// format instance.url/@username
const SERVER_USERNAME_URL =
  /^(https:\/\/)?(?<server>[A-Z0-9.-]+\.[A-Z]{2,})(.*\/)@?(?<username>[A-Z0-9_]+([a-z0-9_\.-]+[a-z0-9_]+)?)$/i
// src:https://github.com/lucahammer/fedifinder/blob/main/public/client.js#L58
let UNWANTED_DOMAINS =
  /gmail\.com(?:$|\/)|mixcloud|linktr\.ee(?:$|\/)|pinboard\.com(?:$|\/)|tutanota\.de(?:$|\/)|xing\.com(?:$|\/)|researchgate|about|bit\.ly(?:$|\/)|imprint|impressum|patreon|donate|facebook|github|instagram|t\.me(?:$|\/)|medium\.com(?:$|\/)|t\.co(?:$|\/)|tiktok\.com(?:$|\/)|youtube\.com(?:$|\/)|pronouns\.page(?:$|\/)|mail@|observablehq|twitter\.com(?:$|\/)|contact@|kontakt@|protonmail|traewelling\.de(?:$|\/)|press@|support@|info@|pobox|hey\.com(?:$|\/)/i

/**
 * Possible formats:
 * - `@username@instance.com`
 * - `username@instance.com`
 * - `@username@https://instance.com`
 * - `https://instance.com/@username`
 * - `https://instance.com/web/@username`
 * - `instance.com/@username`
 * @param {string} term
 */
function parseUsername(term) {
  let { username, server } = term.match(USERNAME_SERVER_URL)?.groups || {}
  if (!username || !server) {
    ;({ username, server } = term.match(SERVER_USERNAME_URL)?.groups || {})
  }
  if (!username || !server || server.match(UNWANTED_DOMAINS)) {
    return null
  }
  return { username, server }
}

function generateUsername(username, server) {
  if (!username.match(USERNAME)) {
    throw new Error("Invalid username format")
  }
  if (server.startsWith("https://")) {
    server = new URL(server).hostname
  }
  return `@${username}@${server}`
}

module.exports = { parseUsername, generateUsername }
