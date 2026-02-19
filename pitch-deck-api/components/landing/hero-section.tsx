import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/hero-bg.jpg')" }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/60" />
      <div className="container relative z-10 flex min-h-[600px] flex-col items-start justify-center py-20">
        <div className="max-w-2xl animate-fade-in">
          <span className="mb-4 inline-block rounded-full bg-secondary/20 px-4 py-1.5 text-sm font-semibold text-secondary">
            Ethiopia&apos;s Premier Pitch Deck Platform
          </span>
          <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-background sm:text-5xl lg:text-6xl">
            Where Vision Meets{" "}
            <span className="text-gradient-gold">Capital</span>
          </h1>
          <p className="mb-8 max-w-xl text-lg text-background/80">
            Connect with strategic investors through compelling pitch decks. Ascend Finance & Advisory bridges the gap between innovative founders and forward-thinking investors.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button
              asChild
              size="lg"
              className="gradient-gold text-gold-foreground font-semibold text-base px-8 hover:opacity-90 transition-opacity"
            >
              <Link href="/pitch-decks">
                Browse Pitch Decks
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-background/30 text-background font-semibold text-base px-8 hover:bg-background/10"
            >
              <Link href="/register">Start as Founder</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
