import { useEffect, useRef } from "react"
import { MotionConfig, motion } from "framer-motion"
import { Link } from "react-router-dom"

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.1 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

export function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !video.src) {
          video.src = "/hero.mp4"
          video.load()
          video.play().catch(() => {})
        }
      },
      { threshold: 0 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <MotionConfig reducedMotion="never">
      <section className="relative min-h-screen w-full overflow-hidden pt-16 md:pt-20">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          preload="none"
        />
        <div className="absolute inset-0" />

        <div className="relative z-10 mx-auto flex h-full min-h-screen max-w-7xl items-center px-4 py-24 md:px-8 md:py-0">
          <motion.div
            className="text-center md:text-left"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="mb-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
              variants={itemVariants}
            >
              <span className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              Real-time Pose AI
            </motion.div>

            <motion.h1
              className="mb-8 text-6xl font-bold uppercase tracking-tight text-foreground md:text-7xl lg:text-8xl"
              style={{ fontFamily: "var(--font-bebas)", lineHeight: 0.9 }}
              variants={itemVariants}
            >
              Train with
              <br />
              <span style={{ color: "#d30005" }}>Precision</span>
              <br />
              Powered by
              <br />
              <span style={{ color: "#d30005" }}>FitVision AI</span>
            </motion.h1>

            <motion.p
              className="mx-auto mb-10 max-w-md text-sm text-muted-foreground md:mx-0 md:text-base"
              variants={itemVariants}
            >
              Real-time body joint tracking. Zero-latency edge computing. No videos uploaded. Just
              pure performance.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  to="/register"
                  className="inline-block rounded-full bg-foreground px-8 py-4 text-sm font-semibold text-white transition-all duration-300"
                >
                  Start Free Trial
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <svg
            className="h-6 w-6 text-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </motion.div>
      </section>
    </MotionConfig>
  )
}
