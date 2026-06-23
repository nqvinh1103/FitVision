import { PageHeader } from "@/components/common/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDashboardData } from "@/lib/api/mock-data"

export default function DashboardPage() {
  const { aiCredits, role } = mockDashboardData

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Track your workouts, credits, and progress"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>AI Credits</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold">{aiCredits}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Role</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="capitalize">{role}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Quick start</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Start an AI form check session from the Workout page.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
