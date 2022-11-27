import { Love } from "./icons"

export default function Footer() {
  return (
    <footer className="container !mt-20 !mb-10 text-black text-opacity-50 dark:text-white">
      <p>
        Made with <Love className="inline h-5 w-auto text-red-600" /> by{" "}
        <a className="text-sky-600 hover:underline" href="https://goulin.fr">
          Goulin Khoge
        </a>
        , source code on{" "}
        <a
          className="text-sky-600 hover:underline"
          href="https://github.com/goulinkh/twittermastodon.com"
        >
          Github
        </a>
        .
      </p>

      <p>
        Having issues? file a{" "}
        <a
          className="text-sky-600 hover:underline"
          href="https://github.com/goulinkh/twittermastodon.com/issues"
        >
          Github issue
        </a>
        .
      </p>
    </footer>
  )
}
