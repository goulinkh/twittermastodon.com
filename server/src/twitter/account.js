const fetch = require("node-fetch")
const { parseUsername } = require("../mastodon/username")
const { findOneMatch } = require("../utils")

function mastodonUsernameForTwitterAccount(account) {
  const name = account?.name?.split(/\s/).map((e) => e.trim()) || []
  let username = findOneMatch(name, parseUsername)
  if (username) {
    return username
  }

  const location = account?.location?.split(/\s/).map((e) => e.trim()) || []
  username = findOneMatch(location, parseUsername)
  if (username) {
    return username
  }

  const description =
    account?.description?.split(/\s/).map((e) => e.trim()) || []
  username = findOneMatch(description, parseUsername)
  if (username) {
    return username
  }

  // links from the fields: name, description
  const nameLinks =
    account?.entities?.url?.urls
      ?.map(
        (entity) => entity.display_url || entity.expanded_url || entity.title
      )
      .filter(Boolean) || []
  username = findOneMatch(nameLinks, parseUsername)
  if (username) {
    return username
  }

  const descriptionLinks =
    account?.entities?.description?.urls
      ?.map(
        (entity) => entity.display_url || entity.expanded_url || entity.title
      )
      .filter(Boolean) || []
  username = findOneMatch(descriptionLinks, parseUsername)
  if (username) {
    return username
  }

  if (!account.pinned_tweet_id) {
    return
  }
  const pinnedTweet = account?.includes?.tweets?.find(
    (tweet) => tweet.id === account.pinned_tweet_id
  )

  const tweetText = pinnedTweet?.text?.split(/\s/).map((e) => e.trim()) || []
  username = findOneMatch(tweetText, parseUsername)
  if (username) {
    return username
  }

  const tweetDescription =
    pinnedTweet?.description?.split(/\s/).map((e) => e.trim()) || []
  username = findOneMatch(tweetDescription, parseUsername)
  if (username) {
    return username
  }

  const tweetLinks =
    pinnedTweet?.entities?.url?.urls
      ?.map(
        (entity) => entity.display_url || entity.expanded_url || entity.title
      )
      .filter(Boolean) || []
  username = findOneMatch(tweetLinks, parseUsername)
  if (username) {
    return username
  }
}

async function myAccount(accessToken) {
  const response = await fetch(
    "https://api.twitter.com/2/users/me?user.fields=description",
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  )
  if (!response.ok) {
    throw new Error("Twitter API Error")
  }
  return await response.json()
}

async function followings(accessToken) {
  const {
    data: { id: userId },
  } = await myAccount(accessToken)

  let nextToken = ""
  const users = []
  while (true) {
    const url = new URL(
      `/2/users/${userId}/following?=&=&=`,
      "https://api.twitter.com/"
    )
    url.searchParams.set(
      "user.fields",
      "name,description,url,location,entities"
    )
    url.searchParams.set("expansions", "pinned_tweet_id")
    url.searchParams.set("tweet.fields", "text,entities")
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

module.exports = { myAccount, followings, mastodonUsernameForTwitterAccount }
