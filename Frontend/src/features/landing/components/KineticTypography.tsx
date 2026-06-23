import { useEffect, useRef, useState, type RefObject } from "react"
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from "framer-motion"

interface KineticTypographyProps {
  containerRef: RefObject<HTMLDivElement | null>
}

export function KineticTypography({ containerRef }: KineticTypographyProps) {
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  })

  const progress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  })

  const opacity1 = useTransform(progress, [0, 0.18], [0, 1])
  const y1 = useTransform(progress, [0, 0.18], [40, 0])
  const opacity2 = useTransform(progress, [0.12, 0.32], [0, 1])
  const y2 = useTransform(progress, [0.12, 0.32], [40, 0])
  const opacity3 = useTransform(progress, [0.26, 0.46], [0, 1])
  const y3 = useTransform(progress, [0.26, 0.46], [40, 0])
  const buttonOpacity = useTransform(progress, [0.46, 0.62], [0, 1])
  const buttonY = useTransform(progress, [0.46, 0.62], [20, 0])

  const words = [
    { text: "ZERO-LATENCY.", opacity: opacity1, y: y1 },
    { text: "EDGE COMPUTING.", opacity: opacity2, y: y2 },
    { text: "NO VIDEOS UPLOADED.", opacity: opacity3, y: y3 },
  ]

  return (
    <div className="relative flex h-full w-full flex-col items-start justify-start">
      <div className="mb-8 space-y-2">
        {words.map((word, index) => (
          <motion.div
            key={index}
            className="overflow-hidden"
            style={{ opacity: word.opacity, y: word.y }}
          >
            <h2
              className="text-6xl font-black uppercase text-foreground md:text-7xl lg:text-8xl"
              style={{
                fontFamily: "var(--font-bebas)",
                lineHeight: 0.85,
                letterSpacing: "-0.02em",
              }}
            >
              {word.text}
            </h2>
          </motion.div>
        ))}
      </div>

      <motion.div className="mb-6 h-px w-24 bg-foreground" style={{ opacity: opacity3 }} />

      <motion.p
        className="mb-8 max-w-xs text-xs leading-relaxed text-foreground md:text-sm"
        style={{ opacity: opacity3 }}
      >
        Real-time body tracking powered by edge computing. Your form stays on-device. Train with
        confidence, zero lag, maximum precision.
      </motion.p>

      <MagneticButton buttonOpacity={buttonOpacity} buttonY={buttonY} />
    </div>
  )
}

interface MagneticButtonProps {
  buttonOpacity: MotionValue<number>
  buttonY: MotionValue<number>
}

function MagneticButton({ buttonOpacity, buttonY }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return

      const rect = buttonRef.current.getBoundingClientRect()
      const buttonCenterX = rect.left + rect.width / 2
      const buttonCenterY = rect.top + rect.height / 2
      const distance = Math.hypot(e.clientX - buttonCenterX, e.clientY - buttonCenterY)

      if (distance < 150) {
        const angle = Math.atan2(e.clientY - buttonCenterY, e.clientX - buttonCenterX)
        setMousePosition({
          x: Math.cos(angle) * (150 - distance) * 0.2,
          y: Math.sin(angle) * (150 - distance) * 0.2,
        })
      } else {
        setMousePosition({ x: 0, y: 0 })
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  return (
    <motion.button
      ref={buttonRef}
      type="button"
      className="rounded-full bg-foreground px-8 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all hover:bg-black md:text-sm"
      style={{
        x: mousePosition.x,
        y: mousePosition.y,
        opacity: buttonOpacity,
        translateY: buttonY,
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      Discover The Tech
    </motion.button>
  )
}
