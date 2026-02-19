import Link from "next/link"
import { Button } from "@/components/ui/button"

export function CTASection() {
  return (
    <section className="gradient-blue py-20">
      <div className="container text-center">
        <h2 className="mb-4 text-3xl font-extrabold text-deep-blue-foreground">
          Ready to Ascend?
        </h2>
        <p className="mx-auto mb-8 max-w-xl text-deep-blue-foreground/80">
          Join hundreds of founders and investors already using our platform.
        </p>
        <div className="flex justify-center gap-4">
          <Button
            asChild
            size="lg"
            className="gradient-gold text-gold-foreground font-semibold px-8 hover:opacity-90 transition-opacity"
          >
            <Link href="/register">Get Started Free</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
