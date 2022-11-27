<h1 align="center">
  <a href="https://twittermastodon.com">
    <img alt="logo of the app, twitter's logo with the head replaced with mastodon's logo." src="/client/public/android-chrome-512x512.png" width="128px"/>
  </a>
  <br/>
  <a href="https://twittermastodon.com">
    Twitter To Mastodon
  </a>
</h1>
<p align="center">This website aims to help users to follow their friends from <b>Twitter</b> automatically on <b>Mastodon</b> without the need to search for each person's name manually on Mastodon!</p>

## Screenshot

<picture>
 <source media="(prefers-color-scheme: dark)" srcset="/screenshots/home-page-dark.png">
 <img alt="A screenshot of the homepage of the website twittermastodon.com where there is a twitter and mastodon login buttons and an export button." src="/screenshots/home-page-light.png">
</picture>

## Development

### Credentials

#### Twitter

You will need to setup a Twitter application to be able to login with twitter, you can do so on the [Twitter developer portal](https://developer.twitter.com/en/portal/dashboard).

#### Mastodon

There is no setup needed for Mastodon, as the server will automatically create the necessary credentials.

### Environment variables

Here is the list of the required variables:

```dosini
SECRET_KEY=very-long-and-secure-key
BACKUP_DIR=~/backups/twitter-folowers-to-mastodon
DASHBOARD_URL=http://localhost:3000
PUBLIC_URL=http://localhost:8080
TWITTER_CLIENT_ID=your-client-id-from-developer-portal
```

### Starting the server

You will need to run 2 servers: the backend and the dashboard.

The backend:

```bash
cd server
yarn install && yarn dev
```

The dashboard:

```bash
cd client
yarn install && yarn dev
```

## Issues

In case of issues, feel free to file a [Github Issue](https://github.com/goulinkh/twittermastodon.com/issues).
