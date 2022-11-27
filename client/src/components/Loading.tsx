import { Spinner } from "./icons"

export default function Loading() {
  return (
    <div className="flex items-center gap-2">
      <Spinner className="h-5 w-auto" /> <span>Processing...</span>
    </div>
  )
}
