import { FileText, Shield, TrendingUp, Zap } from "lucide-react"

const features = [
  {
    icon: FileText,
    title: "Curated Pitch Decks",
    description:
      "Access vetted and professionally reviewed pitch decks from top founders across Ethiopia.",
  },
  {
    icon: Shield,
    title: "Secure & Trusted",
    description:
      "Enterprise-grade security ensures your sensitive financial documents are always protected.",
  },
  {
    icon: TrendingUp,
    title: "Data-Driven Insights",
    description:
      "Get analytics on pitch deck performance, investor engagement, and market trends.",
  },
  {
    icon: Zap,
    title: "Fast & Seamless",
    description:
      "Upload, manage, and share your pitch decks in minutes with our intuitive platform.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mb-12 text-center">
          <h2 className="mb-3 text-3xl font-extrabold">
            Why Choose <span className="text-primary">Ascend</span>
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We provide the tools and network founders need to secure funding and investors need to
            discover opportunities.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group rounded-xl border border-border bg-background p-6 transition-all hover:border-secondary hover:shadow-lg hover:shadow-secondary/10"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
