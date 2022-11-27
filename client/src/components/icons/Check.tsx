import { SVGProps } from "react"

export default function Check(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" {...props}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        stroke="currentColor"
        fill="none"
        d="M4.5 12.75l6 6 9-13.5"
      />
    </svg>
  )
}
