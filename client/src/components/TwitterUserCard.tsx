export default function TwitterUserCard({
  username,
  name,
  self = false,
}: {
  username: string
  name: string
  self?: boolean
}) {
  return (
    <article className="flex w-full items-center justify-between rounded-lg border border-black/5 bg-black/5 py-1 pl-4 pr-1 font-semibold text-black transition-[background] placeholder:font-normal placeholder:text-black/50 hover:bg-black/[6%] dark:border-white/5 dark:bg-white/5 dark:text-white dark:placeholder:text-white/50 dark:hover:bg-white/[6%] md:w-96">
      <div className="max-w-full space-x-2 truncate">
        <span className="font-bold">{name}</span>
        <span className="text-sm font-normal text-opacity-50">@{username}</span>
      </div>
      {self ? (
        <span className="rounded bg-green-400/30 px-2 py-1 text-sm font-normal dark:bg-green-600/30">
          connected
        </span>
      ) : null}
    </article>
  )
}
