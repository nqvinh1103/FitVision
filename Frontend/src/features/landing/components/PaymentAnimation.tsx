import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const easing = [0.83, 0, 0.17, 1] as const

type PaymentPhase = "processing" | "success" | "details"

export function PaymentAnimation() {
  const [phase, setPhase] = useState<PaymentPhase>("processing")
  const [processStep, setProcessStep] = useState(0)

  useEffect(() => {
    const timeline = [
      { duration: 2500, nextPhase: "success" as PaymentPhase },
      { duration: 1800, nextPhase: "details" as PaymentPhase },
      { duration: 2200, nextPhase: "processing" as PaymentPhase },
    ]

    const phaseIndex = phase === "processing" ? 0 : phase === "success" ? 1 : 2
    const timer = setTimeout(() => {
      setPhase(timeline[phaseIndex].nextPhase)
      if (phase === "processing") setProcessStep(0)
    }, timeline[phaseIndex].duration)

    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== "processing") return

    let step = 0
    const interval = setInterval(() => {
      if (step <= 4) {
        setProcessStep(step)
        step++
      } else {
        clearInterval(interval)
      }
    }, 400)

    return () => clearInterval(interval)
  }, [phase])

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <AnimatePresence mode="wait">
        {phase === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-8 font-mono"
          >
            <motion.div
              animate={{ opacity: [0.6, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="text-sm font-bold tracking-widest text-accent md:text-base"
            >
              PROCESSING PAYMENT...
            </motion.div>
            <div className="space-y-3">
              {[
                "Validating Card",
                "Authorizing with PayOS",
                "Processing Transaction",
                "Verifying",
                "Finalizing",
              ].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0.3, x: -20 }}
                  animate={
                    processStep >= i ? { opacity: 1, x: 0 } : { opacity: 0.2, x: -20 }
                  }
                  transition={{ duration: 0.3, ease: easing }}
                  className="flex items-center gap-3 text-xs text-white/80 md:text-sm"
                >
                  <motion.div
                    animate={processStep === i ? { scale: [1, 1.3, 1] } : { scale: 1 }}
                    transition={{ duration: 0.6, repeat: Infinity }}
                    className={`h-2 w-2 rounded-full ${processStep >= i ? "bg-accent" : "bg-white/40"}`}
                  />
                  <span>{step}</span>
                  {processStep > i ? <span className="ml-auto text-accent">✓</span> : null}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center font-mono"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4, ease: easing }}
              className="relative mx-auto h-16 w-16"
            >
              <motion.svg
                className="h-full w-full text-accent"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <motion.path
                  d="M9 12l2 2 4-4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: easing }}
                />
                <motion.circle
                  cx="12"
                  cy="12"
                  r="11"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.6, ease: easing, delay: 0.3 }}
                />
              </motion.svg>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="space-y-2"
            >
              <div className="text-sm font-bold tracking-widest text-accent md:text-base">
                PAYMENT SUCCESSFUL
              </div>
              <div className="text-xs text-white/70 md:text-sm">
                Transaction ID: TXN-2024-001847
              </div>
            </motion.div>
          </motion.div>
        )}

        {phase === "details" && (
          <motion.div
            key="details"
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
              TRANSACTION DETAILS
            </motion.div>
            <div className="space-y-3 text-white/80">
              {[
                { label: "Plan", value: "Pro Coaching" },
                { label: "Amount", value: "$29.99" },
                { label: "Status", value: "Confirmed", highlight: true },
                { label: "Timestamp", value: "2024-01-15 14:32:18" },
              ].map((detail, i) => (
                <motion.div
                  key={detail.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08, ease: easing }}
                  className={`flex items-center justify-between border-b border-white/10 pb-2 ${
                    detail.highlight ? "text-accent" : ""
                  }`}
                >
                  <span>{detail.label}</span>
                  <motion.span
                    className="font-bold"
                    animate={detail.highlight ? { opacity: [0.8, 1, 0.8] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    {detail.value}
                  </motion.span>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="mt-4 border border-accent p-3 text-center text-xs text-accent"
            >
              Secure transaction via PayOS
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
