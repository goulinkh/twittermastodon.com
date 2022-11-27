import Logo from "./Logo"
import ServerError from "./ServerError"
import Head from "next/head"
import Script from "next/script"

export default function Header({ loggedIn }: { loggedIn: boolean }) {
  return (
    <>
      <Head>
        <title>Twitter to Mastodon</title>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="preload"
          href="/fonts/Mona-Sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
        <link
          rel="preload"
          href="/fonts/Hubot-Sans.woff2"
          as="font"
          type="font/woff2"
          crossOrigin=""
        />
      </Head>
      <Script
        defer
        data-domain="twittermastodon.com"
        src="https://insights.goulin.fr/js/insights.js"
      />
      <header className="container flex items-center justify-between py-3">
        <Logo className="h-20 w-auto" />
        <nav className="mr-2 space-x-4 dark:text-white/80">
          {loggedIn ? (
            <a
              className="font-bold text-sky-600 hover:underline"
              href={
                new URL("/logout", process.env.NEXT_PUBLIC_BACKEND_URL).href
              }
            >
              Logout
            </a>
          ) : null}
          <a className="hover:underline" href="https://goulin.fr/about">
            About
          </a>
        </nav>
      </header>
      <ServerError />
    </>
  )
}
