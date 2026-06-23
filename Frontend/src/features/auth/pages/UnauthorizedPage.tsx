import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ErrorFallback } from "@/components/common/ErrorFallback"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <div className="space-y-4 text-center">
        <ErrorFallback
          title="Access denied"
          message="You don't have permission to view this page."
        />
        <Button asChild>
          <Link to="/dashboard">Go to dashboard</Link>
        </Button>
      </div>
    </div>
  )
}
