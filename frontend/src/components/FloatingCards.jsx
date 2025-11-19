import React, { useRef, useEffect } from "react"

export default function FloatingCards() {
  const wrapRef = useRef(null)

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) / rect.width
      const dy = (e.clientY - cy) / rect.height

      // apply transforms to each card
      el.querySelectorAll(".fc-card").forEach((card, idx) => {
        const depth = (idx + 1) * 6
        const tx = dx * depth
        const ty = dy * depth
        card.style.transform = `translate3d(${tx}px, ${ty}px, 0)`
      })
    }

    const onLeave = () => {
      el.querySelectorAll(".fc-card").forEach((card) => {
        card.style.transform = `translate3d(0,0,0)`
      })
    }

    window.addEventListener("pointermove", onMove)
    el.addEventListener("pointerleave", onLeave)

    return () => {
      window.removeEventListener("pointermove", onMove)
      el.removeEventListener("pointerleave", onLeave)
    }
  }, [])

  const cards = [
    { title: "React Basics", instructor: "A. Smith", rating: "4.8", price: "$19" },
    { title: "Design Systems", instructor: "L. Kim", rating: "4.7", price: "$29" },
    { title: "AI for Devs", instructor: "R. Patel", rating: "4.9", price: "$39" },
  ]

  return (
    <div ref={wrapRef} className="relative w-full h-96 md:h-80 lg:h-96">
      {cards.map((c, i) => (
        <div
          key={i}
          className={`fc-card card-bounce float-slow absolute bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 w-48 md:w-56 text-white shadow-lg transition-transform duration-300`} 
          style={{
            top: `${10 + i * 14}%`,
            right: `${-6 + i * 10}%`,
            animationDelay: `${i * 120}ms`,
          }}
        >
          <div className="h-28 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg mb-3 flex items-center justify-center text-2xl font-bold">
            📚
          </div>
          <h3 className="font-semibold">{c.title}</h3>
          <div className="text-sm text-white/80">{c.instructor} • {c.rating}★</div>
          <div className="mt-3 flex items-center justify-between">
            <span className="font-bold">{c.price}</span>
            <button className="px-3 py-1 bg-white text-purple-600 rounded-md font-semibold">Enroll</button>
          </div>
        </div>
      ))}
    </div>
  )
}
