import { AuthGuard } from "@/components/auth-guard"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <div className="flex min-h-screen">
        <AdminSidebar />
        <main className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </AuthGuard>
  )
}
