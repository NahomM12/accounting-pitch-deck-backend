import type { Metadata } from "next"
import { Target, Eye, Award, Users } from "lucide-react"

export const metadata: Metadata = {
  title: "About - Ascend Finance & Advisory",
  description:
    "Learn about Ascend Finance & Advisory, our mission to connect investors with innovative founders across Ethiopia.",
}

const values = [
  {
    icon: Target,
    title: "Our Mission",
    description:
      "To bridge the gap between visionary founders and strategic investors, fueling innovation and economic growth across Ethiopia and the Horn of Africa.",
  },
  {
    icon: Eye,
    title: "Our Vision",
    description:
      "To become the leading platform for startup investment in East Africa, creating a thriving ecosystem where great ideas find the capital they need to succeed.",
  },
  {
    icon: Award,
    title: "Quality First",
    description:
      "Every pitch deck on our platform is carefully reviewed and curated by our team of financial advisors to ensure only the best opportunities are presented.",
  },
  {
    icon: Users,
    title: "Community Driven",
    description:
      "We believe in the power of community. Our platform fosters meaningful connections between founders, investors, mentors, and industry experts.",
  },
]

const stats = [
  { value: "250+", label: "Pitch Decks" },
  { value: "120+", label: "Founders" },
  { value: "80+", label: "Investors" },
  { value: "6", label: "Cities Covered" },
]

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-serif text-4xl font-extrabold text-primary-foreground md:text-5xl text-balance">
            About Ascend Finance & Advisory
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-primary-foreground/80">
            We are dedicated to connecting innovative startups with strategic
            investors, driving growth and opportunity across Ethiopia.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b py-12">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 lg:grid-cols-4 lg:px-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-serif text-3xl font-extrabold text-primary md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-center font-serif text-3xl font-extrabold text-foreground md:text-4xl text-balance">
            What Drives Us
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div
                key={value.title}
                className="rounded-xl border bg-card p-8"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10">
                  <value.icon className="size-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-bold text-card-foreground">
                  {value.title}
                </h3>
                <p className="mt-3 leading-relaxed text-muted-foreground">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team / Story */}
      <section className="border-t bg-card py-20 lg:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center lg:px-8">
          <h2 className="font-serif text-3xl font-extrabold text-card-foreground md:text-4xl text-balance">
            Our Story
          </h2>
          <div className="mt-8 text-left leading-relaxed text-muted-foreground">
            <p>
              Founded in Addis Ababa, Ascend Finance & Advisory was born from a
              simple observation: Ethiopia&apos;s startup ecosystem is brimming
              with talent and innovation, but founders often struggle to connect
              with the right investors.
            </p>
            <p className="mt-4">
              Our team of financial advisors and technology experts built this
              platform to create a transparent, efficient marketplace where
              quality pitch decks meet strategic capital. We vet every submission
              to ensure investors see only the most promising opportunities.
            </p>
            <p className="mt-4">
              Today, we serve founders and investors across six major Ethiopian
              cities, and we&apos;re expanding our reach to cover the entire Horn
              of Africa region.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
