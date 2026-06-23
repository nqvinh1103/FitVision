import { PageHeader } from "@/components/common/PageHeader"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAdminStats } from "@/features/admin/hooks/useAdmin"

export default function AdminDashboardPage() {
  const { data: stats, isLoading } = useAdminStats()

  if (isLoading) return <LoadingSpinner />

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Dashboard" description="Platform overview and management" />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Total users</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats?.totalUsers ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Trainers</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats?.totalTrainers ?? 0}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {(stats?.totalRevenue ?? 0).toLocaleString()}đ
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active challenges</CardTitle>
          </CardHeader>
          <CardContent className="text-3xl font-semibold">
            {stats?.activeChallenges ?? 0}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
