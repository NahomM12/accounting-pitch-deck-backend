"use client"

import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import Link from "next/link"
import Image from "next/image"

export function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <Image
          src="/addis.webp"
          alt="Addis Ababa Cityscape"
          fill
          className="object-cover object-right opacity-100"
          priority
        />
        
        {/* Gradients for Blending Image into Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0a0a]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]/30" />
        
        {/* Additional Dark Overlay for text contrast */}
        <div className="absolute inset-0 bg-black/20" />
      </div>

      {/* Central Glow/Halo Layer */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div
          className="w-[800px] h-[800px] rounded-full blur-[140px] bg-[radial-gradient(circle,_rgba(233,180,73,0.4)_0%,_rgba(74,123,167,0.2)_40%,_transparent_70%)] opacity-80"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 relative z-20 w-full">
        <div className="flex flex-col lg:flex-row items-center justify-center lg:justify-between gap-8 w-full">
          <div className="lg:w-[55%] text-center lg:text-left z-20 xl:pl-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="mb-6"
            >
              <h1 
                className="text-5xl lg:text-7xl xl:text-[5.5rem] font-bold leading-[1.1] text-white tracking-tight"
              >
                Where Vision Meets{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#7abce8] to-[#e9b449]">
                  Capital
                </span>
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg lg:text-xl mb-8 max-w-2xl mx-auto lg:mx-0 text-gray-300"
            >
              Connect with strategic investors through compelling pitch decks. Ascend Finance & Advisory bridges the gap between innovative founders and forward-thinking investors.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start items-center"
            >
              <Link
                href="/pitch-decks"
                className="px-8 py-4 bg-gradient-to-r from-[#5b8ab5] to-[#e9b449] text-white rounded-full font-semibold hover:shadow-[0_0_20px_rgba(233,180,73,0.4)] transition-all duration-300 transform hover:scale-105 flex items-center gap-2 group text-center"
              >
                Browse Pitch Decks
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/signup"
                className="px-8 py-4 border rounded-full font-semibold transition-all duration-300 text-center flex items-center justify-center border-white/20 bg-white/5 hover:bg-white/10"
              >
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#5b8ab5] to-[#e9b449]">
                  Start as Investor
                </span>
              </Link>
            </motion.div>
          </div>

          <div className="hidden lg:flex lg:w-[45%] justify-center items-center z-10 relative">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="w-full max-w-[600px] h-auto flex items-center justify-center relative translate-x-8"
            >
              <Image src="/arrow.webp" alt="arrow" width={760} height={480} className="w-full h-auto drop-shadow-2xl object-contain" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
