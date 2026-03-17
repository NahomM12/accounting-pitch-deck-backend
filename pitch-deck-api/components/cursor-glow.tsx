"use client"

import { useEffect, useRef, useCallback } from "react"

export function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    // 1. Move the global ambient glow
    if (glowRef.current) {
      glowRef.current.style.left = `${e.clientX - 160}px`
      glowRef.current.style.top = `${e.clientY - 160}px`
    }

    // 2. Cards & interactive elements: set CSS custom properties for local glow
    const elements = document.querySelectorAll<HTMLElement>(
      ".bento-card, .bento-notch, .cursor-glow-target"
    )
    elements.forEach((el) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.setProperty("--glow-x", `${x}px`)
      el.style.setProperty("--glow-y", `${y}px`)

      // Check proximity — only glow when cursor is within 200px of the element
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dist = Math.sqrt(
        (e.clientX - centerX) ** 2 + (e.clientY - centerY) ** 2
      )
      const maxDist = Math.max(rect.width, rect.height) + 200
      const opacity = Math.max(0, 1 - dist / maxDist)
      el.style.setProperty("--glow-opacity", `${opacity}`)
    })
  }, [])

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove, { passive: true })
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [handleMouseMove])

  return (
    <div
      ref={glowRef}
      className="pointer-events-none fixed w-80 h-80 rounded-full blur-3xl opacity-40 transition-[left,top] duration-75 z-50"
      style={{
        background:
          "radial-gradient(circle, #e9b449 0%, #d4a844 40%, #21445d 100%)",
        left: "-320px",
        top: "-320px",
      }}
    />
  )
}
