"use client"

import { useRef, useState } from "react"
import { motion, useScroll, useTransform, useAnimate } from "framer-motion"
import { Target, Lightbulb, Award, Briefcase, Settings2, BarChart, ChevronRight, ArrowRight } from "lucide-react"
import Link from "next/link"

const cards = [
  {
    title: "Who We Are",
    icon: BarChart,
    color: "bg-blue-50 dark:bg-amber-950/5",
    content: (
      <div className="space-y-4">
        <p>
          We are a professional advisory firm providing financial, transaction, and business advisory services to companies seeking to improve financial performance, execute strategic transactions, and achieve sustainable growth.
        </p>
        <p>
          We work with entrepreneurs, investors, and organizations to strengthen financial management, unlock capital opportunities, and support informed strategic decision-making.
        </p>
      </div>
    ),
  },
  {
    title: "What We Do",
    icon: Briefcase,
    color: "bg-slate-50 dark:bg-slate-900/40",
    content: (
      <div className="space-y-6">
        <p>Our services include:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
          {[
            "Financial Advisory",
            "Transaction Advisory",
            "Corporate Finance",
            "Accounting & Outsourced Finance",
            "Fundraising Support",
            "Business Development",
            "Financial Systems Design"
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 group/item">
              <div className="w-2 h-2 rounded-full bg-primary dark:bg-secondary shrink-0 transition-transform group-hover/item:scale-150" />
              <span className="font-medium">{item}</span>
            </div>
          ))}
        </div>
        <p className="pt-6 border-t border-border mt-8">
          By combining financial expertise with practical business insight, we help organizations improve operational efficiency and strengthen financial governance.
        </p>
      </div>
    ),
  },
  {
    title: "Our Approach",
    icon: Settings2,
    color: "bg-indigo-50 dark:bg-amber-950/5",
    content: (
      <div className="space-y-6">
        <p>
          We work closely with management teams to design tailored financial solutions that address each client's specific challenges and growth ambitions.
        </p>
        <div className="space-y-6 mt-8">
          {[
            { label: "Clear financial insights", desc: "Transparent and actionable data." },
            { label: "Strong analytical support", desc: "Rigorous evaluation and stress-testing." },
            { label: "Practical implementation", desc: "Hands-on execution beyond just strategy." }
          ].map((item) => (
            <div key={item.label} className="flex gap-6 p-4 rounded-2xl hover:bg-white dark:hover:bg-slate-800 transition-colors shadow-sm border border-transparent hover:border-border">
              <div className="w-12 h-12 rounded-full bg-primary/10 dark:bg-secondary/10 flex items-center justify-center shrink-0">
                <ChevronRight className="w-6 h-6 text-primary dark:text-secondary" />
              </div>
              <div>
                <p className="font-bold text-foreground mb-1">{item.label}</p>
                <p className="opacity-80 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Our Mission",
    icon: Target,
    color: "bg-sky-50 dark:bg-amber-950/5",
    content: (
      <div className="flex flex-col h-full justify-center">
        <p className="text-xl md:text-3xl font-light leading-relaxed italic text-primary/80 dark:text-secondary/80">
          "Our mission is to empower businesses with the financial insight, strategic guidance, and practical solutions they need to improve performance, unlock growth opportunities, and make confident financial decisions."
        </p>
      </div>
    ),
  },
  {
    title: "Our Vision",
    icon: Lightbulb,
    color: "bg-slate-50 dark:bg-slate-900/40",
    content: (
      <div className="flex flex-col h-full justify-center space-y-12">
        <p className="text-xl md:text-5xl leading-tight text-foreground/90 font-light max-w-5xl">
          To become a <span className="font-bold text-primary dark:text-secondary underline decoration-secondary decoration-4 underline-offset-8">trusted advisory partner</span> for businesses and investors.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "High-Quality Expertise", desc: "Top-tier financial insights." },
            { label: "Analytical Capability", desc: "Rigorous data-driven approach." },
            { label: "Strategic Value", desc: "Long-term growth focus." }
          ].map((item) => (
            <div key={item.label} className="space-y-2 border-l-2 border-primary/20 dark:border-secondary/20 pl-6">
              <p className="font-bold text-foreground">{item.label}</p>
              <p className="text-lg opacity-70">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    ),
  },
  {
    title: "Our Values",
    icon: Award,
    color: "bg-slate-50 dark:bg-slate-900/40",
    content: (
      <div className="space-y-12 flex flex-col h-full items-center justify-center text-center w-full">
        <div className="space-y-10 w-full flex flex-col items-center">
          <p className="text-2xl md:text-4xl font-light">We are guided by a strong commitment to:</p>
          <div className="flex flex-wrap gap-8 justify-center">
            {["Professionalism", "Integrity", "Excellence"].map((val) => (
              <div key={val} className="group relative">
                <div className="absolute inset-0 bg-secondary blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                <div className="relative px-10 py-5 rounded-2xl bg-secondary text-black font-black text-xl md:text-2xl shadow-2xl transition-transform hover:scale-110 active:scale-95">
                  {val}
                </div>
              </div>
            ))}
          </div>
          <p className="max-w-4xl text-xl md:text-2xl leading-relaxed opacity-80 mt-4">
            Through these principles, we build lasting partnerships and support businesses in establishing strong financial foundations for long-term success.
          </p>
        </div>
        
        <div className="pt-10">
          <Link 
            href="/#contact" 
            className="group relative inline-flex items-center justify-center px-12 py-6 bg-gradient-to-r from-primary to-secondary text-white rounded-2xl font-black text-xl overflow-hidden transition-all hover:shadow-[0_0_50px_-10px_rgba(233,180,73,0.4)] hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-4">
              Get in Touch
              <ArrowRight className="w-8 h-8 group-hover:translate-x-2 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    ),
  },
]

export function About() {
  const container = useRef(null)
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end']
  })
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <section id="about" className="relative" ref={container}>
      <div className="max-w-full mx-auto px-0 py-24">
        <div className="text-center mb-12 md:mb-24 px-4 sm:px-6 lg:px-8">
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black mb-6"
          >
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">About Us</span>
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto font-light"
          >
            Building strong financial foundations for sustainable business growth.
          </motion.p>
        </div>

        <div className="space-y-0 relative">
          {cards.map((card, i) => {
            const range = [i * 0.1, 1];
            const targetScale = 1 - ( (cards.length - i) * 0.03);
            return (
              <Card 
                key={i} 
                i={i} 
                {...card} 
                progress={scrollYProgress} 
                range={range} 
                targetScale={targetScale}
                isHovered={hoveredIndex === i}
                onHover={() => setHoveredIndex(i)}
                onLeave={() => setHoveredIndex(null)}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Card({ i, title, content, icon: Icon, color, progress, range, targetScale }) {
  const scale = useTransform(progress, range, [1, targetScale]);
  
  return (
    <div className="h-screen flex items-center justify-center sticky top-0 w-full mb-0">
      <motion.div 
        style={{ 
          scale: typeof window !== 'undefined' && window.innerWidth > 768 ? scale : 1,
          top: typeof window !== 'undefined' && window.innerWidth > 768 ? `calc(5% + ${i * 20}px)` : '0px'
        }}
        className={`relative h-auto min-h-[550px] md:min-h-[700px] w-full max-w-none rounded-4xl md:rounded-[3rem] p-8 md:p-20 border border-border flex flex-col items-start overflow-hidden shadow-2xl md:shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.15)] dark:md:shadow-[0_-30px_60px_-15px_rgba(0,0,0,0.6)] ${color} dark:bg-[#1a1a1a] dark:border-[#333333] backdrop-blur-3xl`}
      >
        <div className="w-full flex items-center justify-between mb-8 md:mb-12">
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-800 shadow-lg flex items-center justify-center">
              <Icon className="w-6 h-6 md:w-10 md:h-10 text-primary dark:text-secondary" />
            </div>
            <div>
              <h3 className="text-3xl md:text-6xl font-black text-foreground tracking-tight">{title}</h3>
            </div>
          </div>
        </div>
        
        <div className="flex-1 w-full text-muted-foreground text-xl md:text-3xl font-light leading-relaxed pr-2">
          {content}
        </div>
        
        {/* Background Decorative Element */}
        <div className="absolute bottom-4 right-4 opacity-[0.03] select-none pointer-events-none overflow-hidden">
           <Icon className="w-64 h-64 md:w-96 md:h-96 text-primary dark:text-secondary translate-x-1/4 translate-y-1/4" />
        </div>

        {/* Glossy Overlay */}
        <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent pointer-events-none rounded-[inherit]" />
      </motion.div>
    </div>
  )
}
