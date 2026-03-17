"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin, Briefcase } from "lucide-react"
import { motion } from "framer-motion"

export function Footer() {
  return (
    <footer className="relative mt-20">
      {/* 1px gradient top accent line */}
      <div className="h-px w-full bg-gradient-to-r from-primary via-secondary to-primary opacity-60" />

      {/* Main footer body - Solid */}
      <div className="relative">
        {/* Light mode background - Using a cleaner slate-50 or background variable */}
        <div className="dark:hidden absolute inset-0 bg-slate-50 border-t border-slate-200" />
        {/* Dark mode background */}
        <div className="hidden dark:block absolute inset-0" style={{ backgroundColor: "#1A1A1A" }} />

        <div
          className="relative max-w-7xl mx-auto px-6 lg:px-8"
          style={{ paddingTop: "80px", paddingBottom: "80px" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* ── Column 1: Brand Identity ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="flex flex-col gap-4"
            >
              <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity w-fit">
                <Image src="/logo.webp" alt="Ascend Accounting & Advisory" width={60} height={60} />
                <div>
                  <p className="font-bold text-xl" style={{ color: "inherit" }}>
                    <span className="text-foreground dark:hidden">Ascend</span>
                    <span className="text-white hidden dark:inline">Ascend</span>
                  </p>
                  <p className="text-sm text-primary font-medium">Finance &amp; Advisory</p>
                </div>
              </Link>
              <p
                className="text-sm leading-relaxed"
              >
                <span className="text-muted-foreground dark:hidden">
                  Guiding businesses with expertise,<br />your trusted partner for financial success.
                </span>
                <span className="hidden dark:inline" style={{ color: "#CCCCCC" }}>
                  Guiding businesses with expertise,<br />your trusted partner for financial success.
                </span>
              </p>
            </motion.div>

            {/* ── Column 2: Quick Links ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-lg mb-5 text-foreground">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {[
                  { label: "Services", href: "/#services" },
                  { label: "About Us", href: "/#about" },
                  { label: "Team", href: "/#team" },
                  { label: "Contact", href: "/#contact" },
                  { label: "Privacy Policy", href: "/legal#privacy-policy" },
                  { label: "Terms of Use", href: "/legal#terms-of-use" },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-2 text-sm font-medium transition-colors duration-300 group"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0 transition-colors duration-300"
                        style={{ backgroundColor: "#FFD700" }}
                      />
                      <span
                        className="dark:hidden group-hover:text-primary transition-colors duration-300 text-muted-foreground"
                      >{item.label}</span>
                      <span
                        className="hidden dark:inline group-hover:text-[#FFD700] transition-colors duration-300"
                        style={{ color: "#CCCCCC" }}
                      >{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Column 3:Services ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-lg mb-5 text-foreground">
                Services
              </h3>
              <ul className="space-y-3">
                {[
                  "Transaction Advisory",
                  "Business Development Support",
                  "Finance Department Enhancement",
                  "Outsourced Finance Services",
                ].map((service) => (
                  <li key={service}>
                    <Link
                      href="/#services"
                      className="flex items-start gap-2 text-sm font-medium transition-colors duration-300 group"
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                        style={{ backgroundColor: "#FFD700" }}
                      />
                      <span
                        className="dark:hidden group-hover:text-primary transition-colors duration-300 text-muted-foreground"
                      >{service}</span>
                      <span
                        className="hidden dark:inline group-hover:text-[#FFD700] transition-colors duration-300"
                        style={{ color: "#CCCCCC" }}
                      >{service}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* ── Column 4: Contact Us ── */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <h3 className="font-bold text-lg mb-5 text-foreground">
                Contact Us
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#FFD700" }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5 text-foreground">
                      Email
                    </p>
                    <a
                      href="mailto:info@ascendadvisoryet.com"
                      className="text-sm transition-colors duration-300 hover:text-[#FFD700]"
                    >
                      <span className="text-muted-foreground dark:hidden">info@ascendadvisoryet.com</span>
                      <span className="hidden dark:inline" style={{ color: "#CCCCCC" }}>info@ascendadvisoryet.com</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#FFD700" }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5 text-foreground">
                      Phone
                    </p>
                    <a
                      href="tel:+251943071109"
                      className="text-sm transition-colors duration-300 hover:text-[#FFD700]"
                    >
                      <span className="text-muted-foreground dark:hidden">+251 943 071109</span>
                      <span className="hidden dark:inline" style={{ color: "#CCCCCC" }}>+251 943 071109</span>
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#FFD700" }} />
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide mb-0.5 text-foreground">
                      Location
                    </p>
                    <a
                      href="https://maps.app.goo.gl/u4buGmK4U5zVn6hf9"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm leading-relaxed transition-colors duration-300 hover:text-[#FFD700]"
                    >
                      <span className="text-muted-foreground dark:hidden">
                        Addis Ababa, Ethiopia<br />
                        Bole Medhanealem<br />
                        Beza Bldg, 4th Flr - No. 403
                      </span>
                      <span className="hidden dark:inline" style={{ color: "#CCCCCC" }}>
                        Addis Ababa, Ethiopia<br />
                        Bole Medhanealem<br />
                        Beza Bldg, 4th Flr - No. 403
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ── Bottom Bar ── */}
          {/* Mirror: 4-col grid so legal links sit exactly under Contact Us (col 4) */}
          <div
            className="mt-16 pt-6 grid grid-cols-1 lg:grid-cols-4 gap-4 items-center text-sm"
            style={{ borderTop: "1px solid rgba(128,128,128,0.2)" }}
          >
            {/* Copyright spans first 3 cols */}
            <div className="lg:col-span-3">
              <span className="text-muted-foreground dark:hidden">
                &copy; 2026 Ascend Accounting &amp; Advisory. All rights reserved.
              </span>
              <span className="hidden dark:inline" style={{ color: "#CCCCCC" }}>
                &copy; 2026 Ascend Accounting &amp; Advisory. All rights reserved.
              </span>
            </div>
            {/* Legal links in col 4 – side by side, aligned under Contact Us */}
            <div className="flex flex-row gap-5">
              <Link
                href="/legal#privacy-policy"
                className="transition-colors duration-300 hover:text-[#FFD700]"
              >
                <span className="text-muted-foreground dark:hidden hover:text-primary transition-colors">Privacy Policy</span>
                <span className="hidden dark:inline" style={{ color: "#CCCCCC" }}>Privacy Policy</span>
              </Link>
              <Link
                href="/legal#terms-of-use"
                className="transition-colors duration-300 hover:text-[#FFD700]"
              >
                <span className="text-muted-foreground dark:hidden hover:text-primary transition-colors">Terms of Use</span>
                <span className="hidden dark:inline" style={{ color: "#CCCCCC" }}>Terms of Use</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
