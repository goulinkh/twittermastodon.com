import Footer from "../components/Footer"
import Header from "../components/Header"
import { External } from "../components/icons"
import Logo from "../components/Logo"
import ServerError from "../components/ServerError"
import { Follows } from "../types"
import { parseUsername } from "../utils/mastodon"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import Head from "next/head"

export default function Result() {
  const [status, setStatus] = useState<Follows | null>(null)
  const router = useRouter()

  useEffect(() => {
    const payload = localStorage.getItem("followResult")
    if (!payload) router.push("/")
    setStatus(JSON.parse(payload as string) as Follows)
  }, [router])
  if (!status) {
    return (
      <>
        <Header loggedIn={true} />
        <h2 className="font-fancy text-3xl font-semibold">
          Nothing to show yet
        </h2>
      </>
    )
  }
  return (
    <div className="space-y-16">
      <Header loggedIn={true} />

      <section className="container space-y-6">
        <h2 className="font-fancy text-3xl font-semibold">Your report</h2>
        <p>
          followed <span className="text-sky-600">{status.list.length}</span>{" "}
          people on Mastodon:
        </p>
        <ul className="flex w-full flex-col gap-2">
          {status.list.map(({ mastodonUsername, status }, i) => {
            const { username, server } = parseUsername(mastodonUsername) || {}

            return (
              <li key={i} className="flex items-center gap-2">
                {status === "success" ? (
                  <span className="rounded bg-green-400/30 px-2 py-1 text-sm font-normal opacity-50 dark:bg-green-600/30">
                    done
                  </span>
                ) : (
                  <span className="rounded bg-red-400/30 px-2 py-1 text-sm font-normal dark:bg-red-600/30">
                    {status}
                  </span>
                )}
                <span>
                  {username && server ? (
                    <>
                      <span className="font-bold">{username}</span>
                      <span className="font-normal">@{server}</span>
                    </>
                  ) : (
                    <span>{mastodonUsername}</span>
                  )}
                </span>
              </li>
            )
          })}
        </ul>
      </section>
      <section className="container">
        <a
          className="flex w-fit items-center justify-center gap-1 rounded-lg bg-sky-400/90 py-2 px-4 text-center font-semibold text-black transition-[background] hover:bg-sky-400 dark:bg-sky-600/90 dark:text-white dark:hover:bg-sky-600"
          href={`https://${status.self.server}/@${status.self.username}/following`}
        >
          <span>Go to my Mastodon account</span>
          <External className="h-auto w-4" />
        </a>
      </section>
      <Footer />
    </div>
  )
}
