"use client"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, MapIcon } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export function Contact() {
  // If you have a short map link (maps.app.goo.gl or a direct maps URL), set it here.
  // The button will open this link if provided; otherwise it will open Google Maps directions to the coordinates.
  const shortMapLink = "https://maps.app.goo.gl/u4buGmK4U5zVn6hf9"

  const handleDirections = () => {
    if (shortMapLink && shortMapLink.trim() !== "") {
      window.open(shortMapLink, "_blank")
      return
    }

    const lat = 8.993819
    const lng = 38.78997
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`
    window.open(url, "_blank")
  }

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance"><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Get In Touch</span></h2>
          <p className="text-lg text-muted-foreground">
            We'd love to hear from you. Let's discuss your financial goals.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-stretch">
          {/* Map Card - Left Side with wider appearance */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative lg:col-span-2"
          >
            <div className="relative h-96 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-3xl overflow-hidden border border-white/20 flex flex-col">
              <iframe
                className="w-full h-full border-0"
                src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d3940.764345189573!2d38.789970000000004!3d8.993819!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zOMKwNTknMzcuOCJOIDM4wrA0NycyMy45IkU!5e0!3m2!1sen!2set!4v1765454200941!5m2!1sen!2set"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ascend Accounting & Advisory location map"
              />
              <button
                onClick={handleDirections}
                aria-label="Get directions to Ascend Accounting & Advisory"
                className="px-4 py-3 bg-gradient-to-r from-secondary to-primary text-white font-semibold hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group w-full"
              >
                <MapIcon className="w-5 h-5" />
                Get Directions
              </button>
            </div>
          </motion.div>

          {/* Contact Info & Appointment Card - Right Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6 flex flex-col justify-center lg:col-span-1 px-4 sm:px-6 lg:px-12 items-center text-center lg:items-start lg:text-left"
          >
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

            <div className="flex gap-4 flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="flex-shrink-0">
                <Mail className="w-6 h-6 text-primary mt-1 dark:text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Email</h3>
                <a
                  href="mailto:info@ascendadvisoryet.com"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  info@ascendadvisoryet.com
                </a>
              </div>
            </div>

            <div className="flex gap-4 flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="flex-shrink-0">
                <Phone className="w-6 h-6 text-primary mt-1 dark:text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Phone</h3>
                <a href="tel:+251943071109" className="text-muted-foreground hover:text-primary transition-colors">
                  +(251) 943 071109
                </a>
              </div>
            </div>

            <div className="flex gap-4 flex-col sm:flex-row items-center sm:items-start text-center sm:text-left">
              <div className="flex-shrink-0">
                <MapPin className="w-6 h-6 text-primary mt-1 dark:text-[#FFD700]" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Location</h3>
                <a
                  href="https://maps.app.goo.gl/u4buGmK4U5zVn6hf9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Addis Ababa, Ethiopia
                  <br />
                  Infront of Bole Medhanealem
                  <br />
                  Beza Building, 4th Floor - No. 403
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
