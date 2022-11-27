import { Spinner } from "./icons"
import Loading from "./Loading"
import { parseUsername } from "../utils/mastodon"
import clsx from "clsx"
import { ChangeEvent, useEffect, useState } from "react"

export function MastodonLogin({ loading }: { loading: boolean }) {
  const [username, setUsername] = useState("")
  const [usernameIsValid, setUsernameIsValid] = useState(false)
  const [redirecting, setRedirecting] = useState(false)
  useEffect(() => {
    setUsernameIsValid(Boolean(parseUsername(username)))
  }, [username])
  const mastodonLoginLink = new URL(
    `/mastodon/login?username=${username}`,
    process.env.NEXT_PUBLIC_BACKEND_URL
  ).href
  const handleSubmit = () => {
    setRedirecting(true)
    window.location.href = mastodonLoginLink
  }
  return (
    <>
      <input
        id="mastodon-username"
        className="flex w-full items-center gap-2 rounded-lg border border-black/5 bg-black/5 py-2 px-4 font-semibold text-black transition-[background] placeholder:font-normal placeholder:text-black/50 hover:bg-black/[6%] dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 dark:hover:bg-white/[6%] md:w-64"
        placeholder="john@mastodon.social"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
      />
      <button
        className={clsx(
          "flex w-full items-center justify-center gap-2 rounded-lg py-2 px-4 text-center font-semibold text-black transition-[background] dark:text-white md:w-64",
          {
            "bg-sky-400/70 hover:bg-sky-400/90 dark:bg-sky-600/90 dark:hover:bg-sky-600":
              usernameIsValid,
            "pointer-events-none cursor-default border border-black/5 bg-black/5 transition-[background] placeholder:text-black/50 hover:bg-black/[6%] dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/[6%]":
              !usernameIsValid || redirecting,
            "pointer-events-none": loading,
          }
        )}
        onClick={handleSubmit}
      >
        {loading ? (
          <>
            <Spinner className="h-5 w-auto" />{" "}
            <span className="opacity-70">Connecting ...</span>
          </>
        ) : redirecting ? (
          <Loading />
        ) : (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-auto"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M16 17.24c2.5-.3 4.69-1.84 5-3.25a33.59 33.59 0 0 0 .4-5.42C21.33 4.23 18.48 3 18.48 3A17.64 17.64 0 0 0 12 2a17.64 17.64 0 0 0-6.48 1S2.68 4.23 2.68 8.57v3.44c.1 4.24.78 8.42 4.7 9.46A14.73 14.73 0 0 0 12 22a9.21 9.21 0 0 0 3.54-.81l-.07-1.64A11.41 11.41 0 0 1 12 20c-1.8-.06-3.71-.19-4-2.4a4.26 4.26 0 0 1 0-.63a22.68 22.68 0 0 0 4 .54a23.6 23.6 0 0 0 4-.27zm-6.54-9.8q-1.35 0-1.35 1.62v5.1H6V8.9a3.78 3.78 0 0 1 .82-2.56a2.85 2.85 0 0 1 2.23-1a2.68 2.68 0 0 1 2.4 1.23l.52.87l.52-.87a2.68 2.68 0 0 1 2.4-1.23a2.85 2.85 0 0 1 2.23 1A3.78 3.78 0 0 1 18 8.9v5.26h-2.11v-5.1q0-1.62-1.35-1.62c-1 0-1.51.64-1.51 1.92v2.79H11V9.36c0-1.28-.54-1.92-1.54-1.92z"
              ></path>
            </svg>
            <span>Login to Mastodon</span>
          </>
        )}
      </button>
    </>
  )
}
