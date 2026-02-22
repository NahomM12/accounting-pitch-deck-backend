"use client"

import Link from "next/link"
import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))
    toast.success("Message sent successfully! We'll get back to you soon.")
    ;(e.target as HTMLFormElement).reset()
    setIsSubmitting(false)
  }

  return (
    <div>
      {/* Hero */}
      <section className="bg-primary py-16 lg:py-20">
        <div className="mx-auto max-w-7xl px-4 text-center lg:px-8">
          <h1 className="font-serif text-4xl font-extrabold text-primary-foreground md:text-5xl text-balance">
            Get in Touch
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-primary-foreground/80">
            Have questions or want to learn more? We&apos;d love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Contact Info */}
            <div>
              <h2 className="font-serif text-2xl font-bold text-foreground">
                Contact Information
              </h2>
              <p className="mt-3 leading-relaxed text-muted-foreground">
                Reach out to us through any of these channels, or fill out the
                form and we&apos;ll respond within 24 hours.
              </p>

              <div className="mt-8 flex flex-col gap-6">
                <ContactItem
                  icon={Mail}
                  title="Email"
                  content="info@ascendfinance.com"
                />
                <ContactItem
                  icon={Phone}
                  title="Phone"
                  content="+251 911 000 000"
                />
                <ContactItem
                  icon={MapPin}
                  title="Office"
                  content="Bole Sub City, Addis Ababa, Ethiopia"
                />
              </div>

              <div className="mt-10 space-y-4">
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-serif font-bold text-card-foreground">
                    Office Hours
                  </h3>
                  <div className="mt-3 flex flex-col gap-1 text-sm text-muted-foreground">
                    <p>Monday - Friday: 9:00 AM - 6:00 PM</p>
                    <p>Saturday: 10:00 AM - 2:00 PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
                <div className="rounded-xl border bg-card p-6">
                  <h3 className="font-serif font-bold text-card-foreground">
                    Prefer a call?
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Investors can book a dedicated session with our team to
                    discuss opportunities, ask questions, and review pitch
                    decks.
                  </p>
                  <Link href="/appointments">
                    <Button className="mt-4 w-full font-serif font-semibold">
                      Schedule an Appointment
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="rounded-xl border bg-card p-8">
              <h2 className="font-serif text-2xl font-bold text-card-foreground">
                Send Us a Message
              </h2>
              <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" required placeholder="John" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" required placeholder="Doe" />
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    required
                    placeholder="john@example.com"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    required
                    placeholder="Investment inquiry"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    required
                    rows={5}
                    placeholder="Tell us how we can help..."
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  disabled={isSubmitting}
                  className="font-serif font-semibold"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-1 size-4" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

function ContactItem({
  icon: Icon,
  title,
  content,
}: {
  icon: React.ElementType
  title: string
  content: string
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
        <Icon className="size-5 text-primary" />
      </div>
      <div>
        <p className="font-serif font-semibold text-foreground">{title}</p>
        <p className="text-sm text-muted-foreground">{content}</p>
      </div>
    </div>
  )
}
