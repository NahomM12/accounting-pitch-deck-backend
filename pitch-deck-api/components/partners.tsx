"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const partners = [
  { src: "/EIH.webp", alt: "EIH", width: 160 },
  { src: "/UNDP.webp", alt: "UNDP", width: 180 },
  { src: "/lebawi.webp", alt: "Lebawi", width: 240 },
  { src: "/maleda.webp", alt: "Maleda", width: 240 },
  { src: "/MDF.webp", alt: "MDF", width: 240 },
  { src: "/kacha.webp", alt: "Kacha", width: 240 },
  { src: "/komari.webp", alt: "Komari", width: 240 },
  { src: "/lucy.webp", alt: "Lucy", width: 240 },
  { src: "/nordic.webp", alt: "Nordic", width: 240 },
  { src: "/zuri.webp", alt: "Zuri", width: 240 },
]

export function Partners() {
  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Selected Clients</h2>
          <p className="text-lg text-muted-foreground">At Ascend Accounting & Advisory, we take pride in serving a diverse range of clients across multiple industries, including education, healthcare, manufacturing, construction, and technology. Our engagements span both early-stage ventures and established enterprises, reflecting our ability to adapt and deliver value across business lifecycles.</p>
        </motion.div>

        <div className="relative overflow-hidden marquee-mask py-10">
          <div className="animate-marquee flex gap-12 items-center">
            {/* Double the partners array for seamless looping */}
            {[...partners, ...partners].map((partner, i) => (
              <div
                key={i}
                className="flex-shrink-0 w-48 h-32 flex items-center justify-center p-4 transition-transform duration-300 hover:scale-110 cursor-pointer dark:bg-white/90 dark:rounded-lg dark:overflow-hidden"
              >
                <Image
                  src={partner.src}
                  alt={partner.alt}
                  width={partner.width}
                  height={partner.width}
                  className="object-contain max-h-full"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
