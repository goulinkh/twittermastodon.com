import { useRouter } from "next/router"
import { useState } from "react"

export default function ServerError({ message }: { message?: string }) {
  const [errorAck, setErrorAck] = useState(false)
  const router = useRouter()
  if (!message) {
    message = router.query.message as string | undefined
  }
  if (!message || errorAck) return null
  const handleNotificationClose = () => {
    setErrorAck(true)
    router.query.message = undefined
    router.push(router)
  }
  return (
    <div
      className="container relative !my-1 rounded-lg bg-red-200/30 py-3 pl-4 pr-10 leading-normal dark:bg-red-200/10"
      role="alert"
    >
      <p className="text-red-700 dark:text-red-400">
        <span className="font-semibold">Server error: </span>
        {message}
      </p>
      <button
        className="hover:bg-gradient-radial absolute inset-y-0 right-0 flex items-center rounded-full p-4 hover:from-black/10 hover:via-black/[2%] hover:to-black/0 dark:hover:from-white/10 dark:hover:via-white/[2%] dark:hover:to-white/0"
        onClick={handleNotificationClose}
        title="close notification"
      >
        <svg className="h-4 w-4 fill-current" role="button" viewBox="0 0 20 20">
          <path
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
            fillRule="evenodd"
          ></path>
        </svg>
      </button>
    </div>
  )
}
