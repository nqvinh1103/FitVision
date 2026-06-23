import { useEffect, useRef } from "react"
import { KineticTypography } from "@/features/landing/components/KineticTypography"

export function EdgeComputingSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !video.src) {
          video.src = "/front.mp4"
          video.load()
          video.play().catch(() => {})
        }
      },
      { threshold: 0.1 },
    )

    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <section id="technology" ref={containerRef} className="w-full bg-white">
      <div className="relative h-[200vh] w-full">
        <div className="sticky top-0 grid h-screen w-full grid-cols-1 md:grid-cols-2">
          <div className="flex flex-col items-start justify-center bg-white px-8 py-20 md:px-12 lg:px-16">
            <KineticTypography containerRef={containerRef} />
          </div>
          <div className="hidden h-full w-full flex-col items-center justify-center overflow-hidden bg-black md:flex">
            <video
              ref={videoRef}
              autoPlay
              loop
              muted
              playsInline
              className="h-full w-full object-cover contrast-125 grayscale"
              preload="none"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
