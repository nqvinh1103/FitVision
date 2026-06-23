import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const easing = [0.83, 0, 0.17, 1] as const

type TrackingPhase = "skeleton" | "analysis" | "metrics"

const bodyPoints = [
  "nose",
  "left_eye",
  "right_eye",
  "left_ear",
  "right_ear",
  "left_shoulder",
  "right_shoulder",
  "left_elbow",
  "right_elbow",
  "left_wrist",
  "right_wrist",
  "left_hip",
  "right_hip",
  "left_knee",
  "right_knee",
  "left_ankle",
  "right_ankle",
]

export function TrackingAnimation() {
  const [phase, setPhase] = useState<TrackingPhase>("skeleton")
  const [detectedPoints, setDetectedPoints] = useState<string[]>([])
  const [confidenceScores, setConfidenceScores] = useState<Record<string, number>>({})

  useEffect(() => {
    const timeline = [
      { duration: 2000, nextPhase: "analysis" as TrackingPhase },
      { duration: 1800, nextPhase: "metrics" as TrackingPhase },
      { duration: 2200, nextPhase: "skeleton" as TrackingPhase },
    ]

    const phaseIndex = phase === "skeleton" ? 0 : phase === "analysis" ? 1 : 2
    const timer = setTimeout(() => {
      setPhase(timeline[phaseIndex].nextPhase)
      if (phase === "skeleton") setDetectedPoints([])
      if (phase === "analysis") setConfidenceScores({})
    }, timeline[phaseIndex].duration)

    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== "skeleton") return

    let index = 0
    const interval = setInterval(() => {
      if (index <= bodyPoints.length) {
        setDetectedPoints(bodyPoints.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== "analysis") return

    const scores: Record<string, number> = {}
    bodyPoints.forEach((point, i) => {
      setTimeout(() => {
        scores[point] = Math.floor(85 + Math.random() * 15)
        setConfidenceScores({ ...scores })
      }, i * 80)
    })
  }, [phase])

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <AnimatePresence mode="wait">
        {phase === "skeleton" && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 font-mono text-xs md:text-sm"
          >
            <motion.div
              animate={{ opacity: [0.6, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="tracking-widest text-accent"
            >
              DETECTING SKELETON...
            </motion.div>
            <div className="grid grid-cols-2 gap-2 text-white/70">
              {bodyPoints.map((point) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -10 }}
                  animate={
                    detectedPoints.includes(point)
                      ? { opacity: 1, x: 0 }
                      : { opacity: 0.2, x: -10 }
                  }
                  transition={{ duration: 0.2, ease: easing }}
                  className={`text-xs ${detectedPoints.includes(point) ? "text-accent" : "text-white/40"}`}
                >
                  • {point}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "analysis" && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 font-mono text-xs md:text-sm"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="font-bold tracking-widest text-accent"
            >
              FORM ANALYSIS
            </motion.div>
            <div className="max-h-60 space-y-2 overflow-hidden">
              {bodyPoints.slice(0, 10).map((point) => (
                <motion.div
                  key={point}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: easing }}
                  className="flex items-center justify-between text-white/80"
                >
                  <span>{point}</span>
                  <motion.div
                    className="h-1 w-20 overflow-hidden bg-white/20"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <motion.div
                      className="h-full bg-accent"
                      initial={{ width: 0 }}
                      animate={{ width: `${confidenceScores[point] || 0}%` }}
                      transition={{ duration: 0.5, ease: easing }}
                    />
                  </motion.div>
                  <span className="w-10 text-right font-bold text-accent">
                    {confidenceScores[point] || 0}%
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "metrics" && (
          <motion.div
            key="metrics"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 font-mono"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-bold tracking-widest text-accent md:text-base"
            >
              PERFORMANCE METRICS
            </motion.div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "FPS", value: "60", unit: "" },
                { label: "Latency", value: "<50", unit: "ms" },
                { label: "Accuracy", value: "99.2", unit: "%" },
                { label: "Points", value: "33", unit: "" },
              ].map((metric, i) => (
                <motion.div
                  key={metric.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: i * 0.1, ease: easing }}
                  className="border border-accent p-3 text-center"
                >
                  <div className="mb-1 text-xs text-white/60">{metric.label}</div>
                  <motion.div
                    className="text-lg font-bold text-accent md:text-2xl"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                  >
                    {metric.value}
                    {metric.unit}
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
