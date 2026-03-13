"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

export default function OAuthCallbackPage() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login } = useAuth()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const accessToken = searchParams.get("access_token")
        const userStr = searchParams.get("user")
        const provider = searchParams.get("provider")
        const error = searchParams.get("error")

        if (error) {
          toast.error(`OAuth failed: ${error}`)
          router.push("/login")
          return
        }

        if (!accessToken || !userStr) {
          toast.error("Missing authentication data")
          router.push("/login")
          return
        }

        // Parse user data
        const user = JSON.parse(decodeURIComponent(userStr))

        // Store token and user data in cookies (same as regular login)
        const maxAge = 60 * 60 * 24 * 7
        document.cookie = `auth_token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
        document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(user))}; path=/; max-age=${maxAge}; SameSite=Lax`

        // Update auth context
        await login(user.email, "oauth-placeholder") // This won't actually login but will update the context
        
        toast.success("Login successful!")
        
        if (user.role === "investors") {
          router.push("/")
        } else {
          router.push("/dashboard/admin")
        }
      } catch (error) {
        console.error("OAuth callback error:", error)
        toast.error("Authentication failed")
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    handleOAuthCallback()
  }, [searchParams, router, login])

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-8">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary mx-auto">
            <TrendingUp className="size-6 text-primary-foreground" />
          </div>
          <h1 className="mt-6 font-serif text-2xl font-extrabold text-foreground">
            Completing Sign In
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {isLoading ? "Please wait while we complete your authentication..." : "Redirecting..."}
          </p>
        </div>

        {isLoading && (
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}
      </div>
    </div>
  )
}
