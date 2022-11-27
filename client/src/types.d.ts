type Twitter = {
  accessToken: string
  id: string
  username: string
  name: string
  description: string
}
type Mastodon = {
  username: string
  server: string
  accessToken: string
  id: string
  name: string
}
export type UserStatus = {
  twitter?: Twitter
  mastodon?: Mastodon
}

export type Follows = {
  self: Mastodon
  list: {
    mastodonUsername: string
    status: "success" | string
  }[]
}
