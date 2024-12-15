import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            Built by{" "}
            <a
              href="https://africanccm.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              African Centre for Career Mentorship
            </a>
            . The source code is available on{" "}
            <a
              href="https://github.com/yourusername/pearl-mentor-hub"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              GitHub
            </a>
            .
          </p>
        </div>
        <nav className="flex items-center space-x-4">
          <Link href="/privacy" className="text-sm underline underline-offset-4">Privacy Policy</Link>
          <Link href="/terms" className="text-sm underline underline-offset-4">Terms of Service</Link>
        </nav>
      </div>
    </footer>
  )
}

