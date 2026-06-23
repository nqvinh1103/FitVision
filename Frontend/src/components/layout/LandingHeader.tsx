import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { AnimatePresence, motion } from "framer-motion"

const NAV_ITEMS = [
  { label: "Features", href: "#features" },
  { label: "Technology", href: "#technology" },
  { label: "Privacy", href: "#privacy" },
]

export function LandingHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [menuOpen])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || menuOpen
          ? "border-border bg-white/85 backdrop-blur-md"
          : "border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-8">
        <a
          href="#top"
          className="text-2xl font-bold uppercase leading-none tracking-tight text-foreground md:text-3xl"
          style={{ fontFamily: "var(--font-bebas)" }}
        >
          <span style={{ color: "#d30005" }}>FitVision AI</span>
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-xs font-semibold uppercase tracking-widest text-foreground/70 transition-colors hover:text-accent"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <motion.div className="hidden md:inline-flex" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            to="/register"
            className="inline-flex rounded-full bg-foreground px-6 py-2.5 text-sm font-semibold text-white"
          >
            Start Free Trial
          </Link>
        </motion.div>

        <button
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="relative z-50 flex h-8 w-8 flex-col justify-center gap-1.5 md:hidden"
        >
          <motion.span
            className="block h-0.5 w-6 bg-foreground"
            animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
          <motion.span
            className="block h-0.5 w-6 bg-foreground"
            animate={menuOpen ? { opacity: 0 } : { opacity: 1 }}
            transition={{ duration: 0.2 }}
          />
          <motion.span
            className="block h-0.5 w-6 bg-foreground"
            animate={menuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
            transition={{ duration: 0.25 }}
          />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            className="fixed inset-0 top-16 z-40 flex flex-col bg-white px-6 py-10 md:hidden"
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <nav className="flex flex-col gap-2">
              {NAV_ITEMS.map((item, i) => (
                <motion.a
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="py-2 text-5xl font-bold uppercase tracking-tight text-foreground transition-colors hover:text-accent"
                  style={{ fontFamily: "var(--font-bebas)", lineHeight: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.08 + i * 0.06 }}
                >
                  {item.label}
                </motion.a>
              ))}
            </nav>

            <Link
              to="/register"
              onClick={() => setMenuOpen(false)}
              className="mt-auto inline-flex items-center justify-center rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-white"
            >
              Start Free Trial
            </Link>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  )
}
