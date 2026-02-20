 "use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TrendingUp, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LoginResponse } from "@/lib/types"
import { API_BASE_URL } from "@/lib/api"
import { toast } from "sonner"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/investors/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as {
          message?: string
          error?: string
          errors?: Record<string, string[]>
        }
        const firstError =
          (data.errors && Object.values(data.errors).flat()[0]) ||
          data.message ||
          data.error
        throw new Error(firstError || "Sign up failed")
      }

      const data = (await res.json()) as LoginResponse

      const maxAge = 60 * 60 * 24 * 7
      document.cookie = `auth_token=${data.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(data.user))}; path=/; max-age=${maxAge}; SameSite=Lax`

      toast.success("Account created successfully!")
      window.location.href = "/"
    } catch (err) {
      const error = err as Error
      toast.error(error.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-primary">
              <TrendingUp className="size-6 text-primary-foreground" />
            </div>
            <span className="font-serif text-xl font-bold text-foreground">
              Ascend
            </span>
          </Link>
          <h1 className="mt-6 font-serif text-2xl font-extrabold text-foreground">
            Investor Sign Up
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Create an account to explore and download pitch decks.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
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
                placeholder="investor@example.com"
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
              size="lg"
              disabled={isLoading}
              className="font-serif font-semibold"
            >
              {isLoading ? "Creating account..." : "Sign Up"}
            </Button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}

