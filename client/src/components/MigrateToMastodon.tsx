import { RobotDead, TwitterBirdFlying } from "./icons"
import Loading from "./Loading"
import ServerError from "./ServerError"
import { Follows } from "../types"
import clsx from "clsx"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export default function MigrateToMastodon({ ready }: { ready: boolean }) {
  const [status, setStatus] = useState<Follows | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [requestState, setRequestState] = useState<
    "loading" | "error" | "done" | null
  >(null)

  const router = useRouter()

  useEffect(() => {
    if (Array.isArray(status?.list)) {
      localStorage.setItem("followResult", JSON.stringify(status))
      router.push("/report")
    }
  }, [status, router])
  const Animation = () => (
    <div className="bird-animation h-5">
      <TwitterBirdFlying className="animate-bounce" />
    </div>
  )
  const handleSubmit = async () => {
    if (!ready) return
    setRequestState("loading")
    try {
      const response = await fetch(
        new URL("/follow/all", process.env.NEXT_PUBLIC_BACKEND_URL).href,
        {
          method: "POST",
          credentials: "include",
        }
      )
      const payload = await response.json()
      if (!response.ok || payload.error) {
        setError(payload?.message)
        setRequestState("error")
        return
      }
      setRequestState("done")
      setStatus(payload)
    } catch (e) {
      // @ts-ignore
      setError(e.message)
      setRequestState("error")
    }
  }
  return (
    <>
      {/* TODO: global state */}
      {requestState === "error" && error ? (
        <>
          <ServerError message={error} />
        </>
      ) : null}
      {requestState === "loading" ? <Loading /> : null}
      <button
        className={clsx(
          "flex w-64 items-center justify-center gap-2 rounded-lg py-2 px-4 text-center font-semibold text-black transition-[background]  dark:text-white",
          {
            "bg-sky-400/70 hover:bg-sky-400/90 dark:bg-sky-600/90 dark:hover:bg-sky-600":
              !requestState && ready,
            "pointer-events-none cursor-default border border-black/5 bg-black/5 transition-[background] placeholder:text-black/50 hover:bg-black/[6%] dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/[6%]":
              requestState === "loading" ||
              requestState === "error" ||
              requestState === "done" ||
              !ready,
          }
        )}
        onClick={handleSubmit}
      >
        {requestState === "loading" || requestState === "done" ? (
          <Animation />
        ) : requestState === "error" ? (
          <RobotDead className="h-5 w-auto" />
        ) : requestState === null ? (
          <>
            <span>Follow on Mastodon</span>
          </>
        ) : null}
      </button>
    </>
  )
}
