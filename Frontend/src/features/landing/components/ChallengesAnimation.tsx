import { useEffect, useState } from "react"
import { AnimatePresence, motion } from "framer-motion"

const easing = [0.83, 0, 0.17, 1] as const

type ChallengePhase = "leaderboard" | "streak" | "achievements"

const leaderboardData = [
  { rank: 1, name: "Alex Chen", points: 2847 },
  { rank: 2, name: "Jordan Smith", points: 2654 },
  { rank: 3, name: "Casey Lee", points: 2491 },
  { rank: 4, name: "Morgan Ross", points: 2238 },
]

export function ChallengesAnimation() {
  const [phase, setPhase] = useState<ChallengePhase>("leaderboard")
  const [displayedLeaderboard, setDisplayedLeaderboard] = useState<typeof leaderboardData>([])
  const [streakDays, setStreakDays] = useState(0)

  useEffect(() => {
    const timeline = [
      { duration: 2200, nextPhase: "streak" as ChallengePhase },
      { duration: 1900, nextPhase: "achievements" as ChallengePhase },
      { duration: 2400, nextPhase: "leaderboard" as ChallengePhase },
    ]

    const phaseIndex = phase === "leaderboard" ? 0 : phase === "streak" ? 1 : 2
    const timer = setTimeout(() => {
      setPhase(timeline[phaseIndex].nextPhase)
      if (phase === "leaderboard") setDisplayedLeaderboard([])
      if (phase === "streak") setStreakDays(0)
    }, timeline[phaseIndex].duration)

    return () => clearTimeout(timer)
  }, [phase])

  useEffect(() => {
    if (phase !== "leaderboard") return

    let index = 0
    const interval = setInterval(() => {
      if (index <= leaderboardData.length) {
        setDisplayedLeaderboard(leaderboardData.slice(0, index))
        index++
      } else {
        clearInterval(interval)
      }
    }, 350)

    return () => clearInterval(interval)
  }, [phase])

  useEffect(() => {
    if (phase !== "streak") return

    let count = 0
    const interval = setInterval(() => {
      if (count <= 42) {
        setStreakDays(count)
        count += 2
      } else {
        clearInterval(interval)
      }
    }, 30)

    return () => clearInterval(interval)
  }, [phase])

  return (
    <div className="flex h-full w-full flex-col justify-center">
      <AnimatePresence mode="wait">
        {phase === "leaderboard" && (
          <motion.div
            key="leaderboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4 font-mono text-xs md:text-sm"
          >
            <motion.div
              animate={{ opacity: [0.6, 1] }}
              transition={{ duration: 0.6, repeat: Infinity }}
              className="font-bold tracking-widest text-accent"
            >
              GLOBAL LEADERBOARD
            </motion.div>
            <div className="space-y-2">
              {displayedLeaderboard.map((entry, i) => (
                <motion.div
                  key={entry.rank}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, ease: easing }}
                  className={`flex items-center justify-between border-l-2 p-2 pl-3 ${
                    i === 0 ? "border-accent bg-accent/10" : "border-white/20"
                  }`}
                >
                  <div className="flex flex-1 items-center gap-4">
                    <motion.span
                      className={`w-6 text-right font-bold ${i === 0 ? "text-accent" : "text-white/60"}`}
                      animate={i === 0 ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    >
                      #{entry.rank}
                    </motion.span>
                    <span className={i === 0 ? "text-accent" : "text-white/80"}>
                      {entry.name}
                    </span>
                  </div>
                  <motion.span
                    className={`font-bold ${i === 0 ? "text-accent" : "text-white/60"}`}
                    animate={i === 0 ? { opacity: [0.8, 1] } : {}}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    {entry.points}pts
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "streak" && (
          <motion.div
            key="streak"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-6 text-center font-mono"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-sm font-bold tracking-widest text-accent md:text-base"
            >
              WORKOUT STREAK
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: easing }}
            >
              <motion.div
                className="text-6xl md:text-7xl"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
              >
                🔥
              </motion.div>
              <div className="text-white/80">
                <motion.div className="text-3xl font-black text-accent md:text-5xl">
                  {streakDays}
                </motion.div>
                <div className="mt-1 text-xs text-white/60 md:text-sm">Days in a row</div>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="text-xs italic text-white/70 md:text-sm"
              >
                Keep it up! You&apos;re on fire! 🚀
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {phase === "achievements" && (
          <motion.div
            key="achievements"
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
              RECENT ACHIEVEMENTS
            </motion.div>
            <div className="space-y-3">
              {[
                { icon: "⭐", label: "Form Master", desc: "Perfect form x 10" },
                { icon: "💪", label: "Beast Mode", desc: "Completed 5 workouts" },
                { icon: "🏆", label: "Top 5 Rank", desc: "Global leaderboard" },
              ].map((achievement, i) => (
                <motion.div
                  key={achievement.label}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1, ease: easing }}
                  className="flex items-center gap-3 border border-white/20 p-3"
                >
                  <motion.span
                    className="text-xl md:text-2xl"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 0.6, delay: i * 0.1, repeat: Infinity }}
                  >
                    {achievement.icon}
                  </motion.span>
                  <div>
                    <div className="text-xs font-bold text-accent md:text-sm">
                      {achievement.label}
                    </div>
                    <div className="text-xs text-white/60">{achievement.desc}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
