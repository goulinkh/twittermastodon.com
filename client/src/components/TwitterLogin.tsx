import { Spinner } from "./icons"
import clsx from "clsx"

export default function TwitterLogin({ loading }: { loading: boolean }) {
  return (
    <a
      className={clsx(
        "flex w-64 items-center justify-center gap-2 rounded-lg bg-sky-400/70 py-2 px-4 text-center font-semibold text-black transition-[background] hover:bg-sky-400/90 dark:bg-sky-600/90 dark:text-white dark:hover:bg-sky-600",
        {
          "pointer-events-none": loading,
        }
      )}
      href={new URL("/twitter/login", process.env.NEXT_PUBLIC_BACKEND_URL).href}
    >
      {loading ? (
        <>
          <Spinner className="h-5 w-auto" />{" "}
          <span className="opacity-70">Connecting ...</span>
        </>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-auto"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
            />
          </svg>
          <span>Login to twitter</span>
        </>
      )}
    </a>
  )
}
