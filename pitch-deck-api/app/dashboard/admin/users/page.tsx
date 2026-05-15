"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Loader2, Trash2, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import type { User } from "@/lib/types"
import { getUsers, deleteUser, updateUserStatus } from "@/lib/api"
import { toast } from "sonner"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth-context"

export default function UsersManagePage() {
  const { isSuperAdmin } = useAuth()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [statusConfirmId, setStatusConfirmId] = useState<number | null>(null)
  const [pendingStatus, setPendingStatus] = useState<boolean | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const data = await getUsers()
        setUsers(data)
      } catch {
        setUsers([])
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  async function handleDelete(id: number) {
    try {
      await deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
      toast.success("User deleted successfully")
    } catch {
      toast.error("Failed to delete user")
    }
  }

  async function handleStatusToggle(id: number, currentStatus: boolean) {
    const newStatus = !currentStatus
    if (currentStatus) {
      // Deactivating: show confirmation
      setStatusConfirmId(id)
      setPendingStatus(newStatus)
    } else {
      // Activating: do immediately
      await performStatusUpdate(id, newStatus)
    }
  }

  async function performStatusUpdate(id: number, isActive: boolean) {
    try {
      await updateUserStatus(id, isActive)
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, is_active: isActive } : u))
      )
      toast.success(`User ${isActive ? "activated" : "deactivated"} successfully`)
    } catch {
      toast.error("Failed to update user status")
    } finally {
      setStatusConfirmId(null)
      setPendingStatus(null)
    }
  }

  const admins = users.filter((u) => u.role === "admin" || u.role === "superadmin")
  const investors = users.filter((u) => u.role === "investors")

  const UserTable = ({ data, isAdminsTable }: { data: User[]; isAdminsTable: boolean }) => (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            {isAdminsTable && <TableHead>Status</TableHead>}
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.id}>
              <TableCell className="max-w-48">
                <p className="truncate font-medium">{user.name}</p>
              </TableCell>
              <TableCell>
                <p className="truncate text-sm text-muted-foreground">
                  {user.email}
                </p>
              </TableCell>
              <TableCell className="capitalize text-xs font-medium">
                {user.role}
              </TableCell>
              {isAdminsTable && (
                 <TableCell>
                   <div className="flex items-center gap-2">
                     <Switch
                       checked={user.is_active}
                       onCheckedChange={() => handleStatusToggle(user.id, user.is_active)}
                       disabled={!isSuperAdmin || user.role === 'superadmin'}
                     />
                     <span className={`text-[10px] font-semibold uppercase ${user.is_active ? "text-green-600" : "text-destructive"}`}>
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>
                </TableCell>
              )}
              <TableCell className="text-xs text-muted-foreground">
                {new Date(user.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center justify-end gap-1">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this user?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <p className="text-sm text-muted-foreground">
                        This action cannot be undone.
                      </p>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(user.id)}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div>
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-serif text-2xl font-extrabold text-foreground">
            Users
          </h1>
          <p className="text-sm text-muted-foreground">
            View and manage platform users.
          </p>
        </div>
        <div>
          <Button asChild size="sm" className="font-serif font-semibold">
            <Link href="/dashboard/admin/users/new">
              <Plus className="mr-1 size-4" />
              Add user
            </Link>
          </Button>
        </div>
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-20 rounded-xl border bg-card">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center rounded-xl border bg-card">
            <h3 className="font-serif font-bold text-foreground">
              No users found
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Users will appear here once they register or are added.
            </p>
          </div>
        ) : (
          <Tabs defaultValue="admins" className="w-full">
            <TabsList className="mb-4">
              <TabsTrigger value="admins">Admins & Super Admins</TabsTrigger>
              <TabsTrigger value="investors">Investors</TabsTrigger>
            </TabsList>
            
            <TabsContent value="admins" className="rounded-xl border bg-card">
              {admins.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">No admins found.</div>
              ) : (
                <UserTable data={admins} isAdminsTable={true} />
              )}
            </TabsContent>
            
            <TabsContent value="investors" className="rounded-xl border bg-card">
              {investors.length === 0 ? (
                <div className="py-10 text-center text-muted-foreground">No investors found.</div>
              ) : (
                <UserTable data={investors} isAdminsTable={false} />
              )}
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Status Confirmation Dialog */}
      <AlertDialog open={!!statusConfirmId} onOpenChange={(open) => !open && setStatusConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deactivate Admin Account?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to deactivate this admin? They will no longer be able to log in or access the dashboard.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => statusConfirmId && performStatusUpdate(statusConfirmId, false)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Deactivate
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
