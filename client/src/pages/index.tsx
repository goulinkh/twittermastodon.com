import Footer from "../components/Footer"
import Header from "../components/Header"
import { Bookmark, BrokenChain, Chain, Follow } from "../components/icons"
import { MastodonLogin } from "../components/MastodonLogin"
import MastodonUserCard from "../components/MastodonUserCard"
import MigrateToMastodon from "../components/MigrateToMastodon"
import PublishToTwitter from "../components/PublishToTwitter"
import ServerError from "../components/ServerError"
import TwitterLogin from "../components/TwitterLogin"
import TwitterUserCard from "../components/TwitterUserCard"
import { UserStatus } from "../types"
import { generateUsername } from "../utils/mastodon"
import { useEffect, useState } from "react"

export default function Home() {
  const [status, setStatus] = useState<UserStatus | null>(null)
  const [requestState, setRequestState] = useState<
    "loading" | "error" | "done"
  >("loading")
  const loggedToTwitter = Boolean(status?.twitter?.id)
  const loggedToMastodon = Boolean(status?.mastodon?.id)

  const Todo = () => (
    <div className="after:bg-gradient-radial relative after:absolute after:-top-5 after:-left-5 after:-z-10 after:h-full after:w-full after:rounded-full after:from-orange-400/30 after:via-orange-200/0 after:to-orange-200/0 after:p-10">
      <BrokenChain className="h-10 w-auto p-2 opacity-60" />
    </div>
  )
  const Done = () => (
    <div className="after:bg-gradient-radial relative after:absolute after:-top-5 after:-left-5 after:-z-10 after:h-full after:w-full after:rounded-full after:from-green-400/30 after:via-green-200/0 after:to-green-200/0 after:p-10">
      <Chain className="h-10 w-auto p-2 opacity-60" />
    </div>
  )
  useEffect(() => {
    fetch(new URL("/status", process.env.NEXT_PUBLIC_BACKEND_URL).href, {
      credentials: "include",
    })
      .then((r) => r.json())
      .then((payload) => {
        if (payload.error) {
          setRequestState("error")
        } else {
          setStatus(payload)
          setRequestState("done")
        }
      })
      .catch((e) => {
        // server inaccessible
        setRequestState("error")
      })
  }, [])
  return (
    <div className="space-y-16">
      <Header loggedIn={loggedToTwitter || loggedToMastodon} />
      {requestState === "error" ? (
        <ServerError message="Failed to connect to the server" />
      ) : null}

      <section className="container space-y-6">
        <h2 className="font-fancy flex items-center gap-3 text-3xl font-semibold">
          {loggedToTwitter ? <Done /> : <Todo />}
          <span>Your Twitter account</span>
        </h2>
        {loggedToTwitter ? (
          <TwitterUserCard {...status!.twitter!} self />
        ) : (
          <TwitterLogin loading={requestState === "loading"} />
        )}
      </section>
      <section className="container space-y-6">
        <h2 className="font-fancy flex items-center gap-3 text-3xl font-semibold">
          {loggedToMastodon ? <Done /> : <Todo />}
          <span>Your Mastodon account</span>
        </h2>
        {loggedToMastodon ? (
          <MastodonUserCard {...status!.mastodon!} />
        ) : (
          <MastodonLogin loading={requestState === "loading"} />
        )}
      </section>
      <section className="container space-y-6">
        <h2 className="font-fancy flex items-center gap-3 text-3xl font-semibold">
          <Follow className="m-2 h-6 w-auto" />
          <span>Follow on Mastodon from Twitter!</span>
        </h2>
        <p className="!mt-1.5 text-black/50 dark:text-white/50">
          Scan your twitter network and automatically follow your friends from
          Twitter.
        </p>
        <MigrateToMastodon ready={loggedToTwitter && loggedToMastodon} />
      </section>
      <section className="container space-y-6">
        <h2 className="font-fancy flex items-center gap-3 text-3xl font-semibold">
          <Bookmark className="m-2 h-6 w-auto" />
          <span>Publish your handle Twitter!</span>
        </h2>
        <p className="!mt-1.5 text-black/50 dark:text-white/50">
          Add your Mastodon username to your Twitter profile.
        </p>
        <PublishToTwitter
          ready={loggedToTwitter && loggedToMastodon}
          mastodonHandle={
            status?.mastodon
              ? generateUsername(
                  status?.mastodon?.username,
                  status?.mastodon?.server
                )
              : ""
          }
          twitterDescription={status?.twitter?.description || ""}
        />
      </section>
      <Footer />
    </div>
  )
}
