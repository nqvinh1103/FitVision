import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const easing = [0.83, 0, 0.17, 1] as const

type Phase = "prompt" | "retrieval" | "generation"

export function RAGAnimation() {
  const [phase, setPhase] = useState<Phase>("prompt")
  const [promptText, setPromptText] = useState("")
  const [retrievalPhase, setRetrievalPhase] = useState(false)
  const [matchFound, setMatchFound] = useState(false)

  useEffect(() => {
    const timeline = [
      { duration: 1500, nextPhase: "retrieval" as Phase },
      { duration: 1500, nextPhase: "generation" as Phase },
      { duration: 2500, nextPhase: "prompt" as Phase },
    ]

    const phaseIndex = phase === "prompt" ? 0 : phase === "retrieval" ? 1 : 2
    const timer = setTimeout(() => {
      setPhase(timeline[phaseIndex].nextPhase)
      if (phase === "prompt") setPromptText("")
      if (phase === "retrieval") setRetrievalPhase(false)
      if (phase === "generation") setMatchFound(false)
    }, timeline[phaseIndex].duration)

    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== "prompt") return

    const text = '> USER_GOAL: "Fix my squat depth & build leg strength."'
    let index = 0

    const interval = setInterval(() => {
      if (index <= text.length) {
        setPromptText(text.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 40)

    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== "retrieval") return

    const timer = setTimeout(() => setRetrievalPhase(true), 500)
    const matchTimer = setTimeout(() => setMatchFound(true), 1200)
    return () => {
      clearTimeout(timer)
      clearTimeout(matchTimer)
    }
  }, [phase])

  return (
    <div className="flex h-full w-full flex-col justify-center font-mono text-xs md:text-sm">
      <AnimatePresence mode="wait">
        {phase === "prompt" && (
          <motion.div
            key="prompt"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <div className="border border-white/20 bg-black/50 p-4">
              <div className="text-white/80">{promptText}</div>
              {promptText.length < 50 && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="text-accent"
                >
                  █
                </motion.span>
              )}
            </div>
          </motion.div>
        )}

        {phase === "retrieval" && (
          <motion.div
            key="retrieval"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3"
          >
            <div className="text-xs text-white/80">
              <motion.div
                animate={{ opacity: [0.5, 1] }}
                transition={{ duration: 0.6, repeat: Infinity }}
              >
                Scanning Vector DB...
              </motion.div>
            </div>
            {retrievalPhase ? (
              <motion.div
                className="h-24 overflow-hidden border border-white/20 bg-black/50 p-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div
                  animate={{ y: [0, -100] }}
                  transition={{ duration: 1.5, ease: "easeInOut" }}
                  className="space-y-2 text-xs text-white/60"
                >
                  <div>goblet_squat_form.csv (0.89)</div>
                  <div>barbell_squat_guide.pdf (0.87)</div>
                  <div>leg_strength_program.csv (0.91)</div>
                  <div>ankle_mobility_routine.txt (0.84)</div>
                  <div>high_bar_squat.csv (0.95)</div>
                </motion.div>
              </motion.div>
            ) : null}
            {matchFound ? (
              <motion.div
                initial={{ opacity: 0, backgroundColor: "#ffffff", color: "#111111" }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.1 }}
                className="p-3 text-xs font-bold"
              >
                [MATCH FOUND: high_bar_squat.csv]
              </motion.div>
            ) : null}
          </motion.div>
        )}

        {phase === "generation" && (
          <motion.div
            key="generation"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, ease: easing }}
              className="font-bold tracking-widest text-accent"
            >
              AI GENERATED PLAN
            </motion.div>
            <div className="space-y-2">
              {["Ankle Mobility", "Tempo Goblet Squat", "Barbell Squat"].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.15, ease: easing }}
                  className="border-l-2 border-accent py-1 pl-3 text-white/90"
                >
                  {item}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
