import { useCallback, useEffect, useRef, useState } from "react"
import type { PoseLandmark } from "@/features/workout/types"

interface UseMediaPipeOptions {
  enabled?: boolean
}

interface MediaPipeState {
  isActive: boolean
  isLoading: boolean
  error: string | null
  landmarks: PoseLandmark[] | null
  frameCount: number
}

/**
 * MediaPipe Pose integration hook.
 * Placeholder for @mediapipe/tasks-vision — wire when dependency is added.
 */
export function useMediaPipe({ enabled = false }: UseMediaPipeOptions = {}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [state, setState] = useState<MediaPipeState>({
    isActive: false,
    isLoading: false,
    error: null,
    landmarks: null,
    frameCount: 0,
  })

  const startCamera = useCallback(async () => {
    setState((s) => ({ ...s, isLoading: true, error: null }))

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 640, height: 480 },
        audio: false,
      })

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      setState((s) => ({ ...s, isActive: true, isLoading: false }))
    } catch {
      setState((s) => ({
        ...s,
        isLoading: false,
        error: "Camera access denied or unavailable",
      }))
    }
  }, [])

  const stopCamera = useCallback(() => {
    const stream = videoRef.current?.srcObject as MediaStream | null
    stream?.getTracks().forEach((track) => track.stop())
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    setState({
      isActive: false,
      isLoading: false,
      error: null,
      landmarks: null,
      frameCount: 0,
    })
  }, [])

  useEffect(() => {
    if (!enabled) return

    return () => {
      stopCamera()
    }
  }, [enabled, stopCamera])

  return {
    videoRef,
    ...state,
    startCamera,
    stopCamera,
  }
}
