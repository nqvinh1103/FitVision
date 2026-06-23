import { CameraIcon, CameraOffIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useMediaPipe } from "@/features/workout/hooks/useMediaPipe"

export function WorkoutCamera() {
  const { videoRef, isActive, isLoading, error, frameCount, startCamera, stopCamera } =
    useMediaPipe()

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>AI Form Check</CardTitle>
        <Badge variant={isActive ? "default" : "secondary"}>
          {isActive ? "Camera active" : "Camera off"}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative aspect-video overflow-hidden rounded-lg bg-muted">
          <video
            ref={videoRef}
            className="size-full object-cover"
            playsInline
            muted
          />
          {!isActive ? (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              <CameraOffIcon className="size-12 opacity-50" />
            </div>
          ) : null}
        </div>

        {error ? <p className="text-sm text-destructive">{error}</p> : null}

        {isActive ? (
          <p className="text-xs text-muted-foreground">
            Frames captured: {frameCount} · MediaPipe pose detection ready to integrate
          </p>
        ) : null}

        <div className="flex gap-2">
          {!isActive ? (
            <Button onClick={startCamera} disabled={isLoading}>
              <CameraIcon className="size-4" />
              {isLoading ? "Starting..." : "Start camera"}
            </Button>
          ) : (
            <Button variant="outline" onClick={stopCamera}>
              Stop camera
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
