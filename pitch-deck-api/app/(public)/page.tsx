import { HeroSection } from "@/components/landing/hero-section"
import { About } from "@/components/about"
import { Services } from "@/components/services"
import { Partners } from "@/components/partners"
import { Team } from "@/components/team"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"
import { CursorGlow } from "@/components/cursor-glow"

export default function HomePage() {
  return (
    <>
      <CursorGlow />
      <HeroSection />
      <About />
      <Services />
      <Partners />
      <Team />
      <Contact />
    </>
  )
}
