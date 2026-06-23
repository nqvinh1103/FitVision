import { PageHeader } from "@/components/common/PageHeader"
import { LoadingSpinner } from "@/components/common/LoadingSpinner"
import { EmptyState } from "@/components/common/EmptyState"
import { Badge } from "@/components/ui/badge"
import { useAdminUsers } from "@/features/admin/hooks/useAdmin"

export default function AdminUsersPage() {
  const { data: users, isLoading } = useAdminUsers()

  return (
    <div className="space-y-6">
      <PageHeader title="User Management" description="View and manage platform users" />
      {isLoading ? <LoadingSpinner /> : null}
      {users && users.length > 0 ? (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Role</th>
                <th className="px-4 py-3 text-left font-medium">Credits</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3 text-muted-foreground">{user.email}</td>
                  <td className="px-4 py-3">
                    <Badge variant="secondary" className="capitalize">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">{user.aiCredits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : !isLoading ? (
        <EmptyState title="No users" description="User data will appear here." />
      ) : null}
    </div>
  )
}
