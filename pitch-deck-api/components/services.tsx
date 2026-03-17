"use client"

import { motion } from "framer-motion"
import { Briefcase, TrendingUp, Settings2, Users } from "lucide-react"

const services = [
  {
    icon: Briefcase,
    title: "Transaction Advisory",
    description: "We support investors and businesses throughout the transaction lifecycle.",
    features: [
      "Financial Due Diligence",
      "Business Valuation",
      "Financial Modeling",
      "Financial Forecasting",
      "Deal Sourcing & Transaction Support",
    ],
  },
  {
    icon: TrendingUp,
    title: "Business Development Support",
    description: "We help businesses structure, grow, and prepare for investment.",
    features: [
      "Feasibility Studies",
      "Business Plan Development",
      "Investment Readiness Support",
      "Strategic & Growth Planning",
    ],
  },
  {
    icon: Settings2,
    title: "Finance Department Enhancement",
    description: "We strengthen finance functions to improve control, efficiency, and decision-making.",
    features: [
      "Finance Capacity Assessment",
      "Systems & Process Design",
      "Finance Team Recruitment Support",
      "Training & Capacity Building",
    ],
  },
  {
    icon: Users,
    title: "Outsourced Finance Services",
    description: "End-to-end finance support tailored to growing organizations.",
    features: ["Outsourced CFO Services", "Payroll Management", "Tax Compliance & Advisory", "Accounting & Financial Reporting"],
  },
]

export function Services() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  }

  return (
    <section id="services" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Our Services</h2>
          <p className="text-lg text-muted-foreground">Comprehensive financial solutions for your business</p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((service, i) => (
            <motion.div key={i} variants={itemVariants} whileHover={{ y: -8 }} className="group relative h-full">
              <div className="bento-card h-full flex flex-col">
                <div className="mb-6 pt-2 pr-16 border-b border-transparent">
                  <h3 className="text-2xl bento-title">{service.title}</h3>
                  <p className="bento-text">{service.description}</p>
                </div>
                
                <div className="mt-auto">
                  <ul className="space-y-3">
                    {service.features.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-3 text-sm bento-text opacity-90">
                        <span className="w-1.5 h-1.5 rounded-full bento-bullet mt-2 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="bento-notch">
                <service.icon className="w-8 h-8 bento-notch-icon" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
