import { useEffect, useState } from "react"

const DEFAULT_COOLDOWN_SECONDS = 60

export function useOtpCooldown(initialSeconds = DEFAULT_COOLDOWN_SECONDS) {
  const [secondsLeft, setSecondsLeft] = useState(initialSeconds)

  useEffect(() => {
    if (secondsLeft <= 0) {
      return
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((current) => Math.max(0, current - 1))
    }, 1000)

    return () => window.clearInterval(timer)
  }, [secondsLeft])

  return {
    secondsLeft,
    canResend: secondsLeft <= 0,
    resetCooldown: (seconds = DEFAULT_COOLDOWN_SECONDS) => setSecondsLeft(seconds),
  }
}
