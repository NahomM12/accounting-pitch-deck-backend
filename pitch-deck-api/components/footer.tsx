import Link from "next/link"
import { TrendingUp } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t bg-card text-card-foreground">
      <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex size-9 items-center justify-center rounded-lg bg-primary">
                <TrendingUp className="size-5 text-primary-foreground" />
              </div>
              <span className="font-serif text-lg font-bold">Ascend</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Connecting investors with innovative founders across Ethiopia and beyond.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider">
              Platform
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <Link href="/pitch-decks" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Browse Pitch Decks
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider">
              Resources
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li>
                <span className="text-sm text-muted-foreground">
                  Investor Guide
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Startup Resources
                </span>
              </li>
              <li>
                <span className="text-sm text-muted-foreground">
                  Market Reports
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-sm font-semibold uppercase tracking-wider">
              Contact
            </h3>
            <ul className="mt-3 flex flex-col gap-2">
              <li className="text-sm text-muted-foreground">
                Addis Ababa, Ethiopia
              </li>
              <li className="text-sm text-muted-foreground">
                info@ascendfinance.com
              </li>
              <li className="text-sm text-muted-foreground">
                +251 911 000 000
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <p className="text-center text-xs text-muted-foreground">
            {`\u00A9 ${new Date().getFullYear()} Ascend Finance & Advisory. All rights reserved.`}
          </p>
        </div>
      </div>
    </footer>
  )
}
