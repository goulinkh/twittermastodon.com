import { Check, Clipboard } from "./icons"
import Loading from "./Loading"
import { copyToClipboard } from "../utils/clipboard"
import clsx from "clsx"
import { useEffect, useState } from "react"
import { usePopperTooltip } from "react-popper-tooltip"

const CodeCopyPastBtn: React.FC<{ content: string }> = ({ content }) => {
  const successShowTime = 2000
  const { getTooltipProps, setTooltipRef, setTriggerRef, visible } =
    usePopperTooltip({ visible: true })
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (copied) setTimeout(() => setCopied(false), successShowTime)
  }, [copied])
  return (
    <div
      className={clsx(
        "absolute top-1 right-2 transition-opacity group-hover:opacity-100",
        { "opacity-0": !copied }
      )}
    >
      <button
        className={clsx(
          "flex rounded border border-black/10 bg-black/10 p-2 backdrop-blur transition-all dark:border-white/10 dark:bg-black/50",
          {
            "!bg-green-600/70 text-white": copied,
          }
        )}
        ref={setTriggerRef}
        onClick={() => {
          copyToClipboard(content)
          setCopied(true)
        }}
      >
        {copied ? <Check className="w-5" /> : <Clipboard className="w-5" />}
      </button>
      {visible && (
        <div
          ref={setTooltipRef}
          {...getTooltipProps({
            className: "tooltip-container text-sm text-center",
          })}
        >
          {copied ? "Copied!" : "Copy to clipboard"}
        </div>
      )}
    </div>
  )
}

export default function PublishToTwitter({
  ready,
  mastodonHandle,
  twitterDescription,
}: {
  ready: boolean
  mastodonHandle: string
  twitterDescription: string
}) {
  const [requestState, setRequestState] = useState<"loading" | "done" | null>(
    null
  )
  const twitterNewDescription = `Find me on Mastodon: ${mastodonHandle}\n${twitterDescription}`

  const wait = (t: number) => new Promise((s) => setTimeout(s, t))
  const handleSubmit = async () => {
    setRequestState("loading")
    await wait(1500)
    setRequestState("done")
  }
  switch (requestState) {
    case "loading":
      return (
        <div className="pointer-events-none flex w-64 cursor-default items-center justify-center gap-2 rounded-lg border border-black/5 bg-black/5 py-2  px-4 text-center font-semibold text-black transition-[background] placeholder:text-black/50  dark:border-white/5 dark:bg-white/5 dark:text-white">
          <Loading />
        </div>
      )
      break
    case "done":
      return (
        <div className="space-y-3 transition-all">
          <p>Copy/past the following description to your Twitter profile:</p>
          <div className="group relative w-fit">
            <CodeCopyPastBtn content={twitterNewDescription} />
            <code
              className="block
            w-96 rounded-lg border border-black/5 bg-black/5 py-4
            pl-4 pr-8 text-xs transition-[background] placeholder:text-black/50 hover:bg-black/[6%] dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/[6%]"
              dangerouslySetInnerHTML={{
                __html: twitterNewDescription.replace("\n", "<br/>"),
              }}
            />
          </div>
        </div>
      )

    default:
      return (
        <button
          className={clsx(
            "flex w-64 items-center justify-center gap-2 rounded-lg py-2 px-4 text-center font-semibold text-black transition-[background]  dark:text-white",
            {
              "bg-sky-400/70 hover:bg-sky-400/90 dark:bg-sky-600/90 dark:hover:bg-sky-600":
                ready,
              "pointer-events-none cursor-default border border-black/5 bg-black/5 transition-[background] placeholder:text-black/50 hover:bg-black/[6%] dark:border-white/5 dark:bg-white/5 dark:hover:bg-white/[6%]":
                !ready,
            }
          )}
          onClick={handleSubmit}
        >
          Update my twitter profile
        </button>
      )
      break
  }
}
