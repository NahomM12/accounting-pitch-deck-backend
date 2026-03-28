"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { adminRegister } from "@/lib/api"

export default function AdminRegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (password.length < 8) {
      toast.error("Password must be at least 8 characters")
      return
    }

    setIsSubmitting(true)

    try {
      await adminRegister({
        name,
        email,
        password,
        role: "admin",
      })
      toast.success("Admin user created successfully")
      router.push("/dashboard/admin/users")
    } catch (err) {
      const error = err as Error & {
        data?: { errors?: Record<string, string[]>; message?: string; error?: string }
      }

      if (error.data?.errors) {
        const messages = Object.values(error.data.errors).flat()
        toast.error(messages[0] || "Validation failed")
      } else {
        toast.error(error.data?.message || error.data?.error || error.message || "Failed to create admin user")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div>
      <Button asChild variant="ghost" size="sm" className="mb-4">
        <Link href="/dashboard/admin/users">
          <ArrowLeft className="mr-1 size-4" />
          Back to Users
        </Link>
      </Button>

      <h1 className="font-serif text-2xl font-extrabold text-foreground">
        Create Admin User
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Add a new admin account. Only superadmins can perform this action.
      </p>

      <form
        onSubmit={handleSubmit}
        className="mt-8 max-w-md rounded-xl border bg-card p-6"
      >
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Admin"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            size="lg"
            className="font-serif font-semibold"
          >
            {isSubmitting ? "Creating..." : "Create Admin"}
          </Button>
        </div>
      </form>
    </div>
  )
}

