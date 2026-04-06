"use client"

import { Suspense, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { toast } from "sonner"
import { TrendingUp } from "lucide-react"

export const dynamic = 'force-dynamic'

function OAuthCallbackContent() {
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { completeOAuthLogin } = useAuth()

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        const accessToken = searchParams.get("access_token")
        const userStr = searchParams.get("user")
        const provider = searchParams.get("provider")
        const error = searchParams.get("error")

        console.log("🔵 OAuth Callback - Raw params:", { accessToken: !!accessToken, userStr: !!userStr, provider, error })

        if (error) {
          toast.error(`OAuth failed: ${error}`)
          router.push("/login")
          return
        }

        if (!accessToken || !userStr) {
          console.error("Missing token or user")
          toast.error("Missing authentication data")
          router.push("/login")
          return
        }

        const user = JSON.parse(decodeURIComponent(userStr))
        console.log("🟢 User parsed:", { id: user.id, email: user.email, role: user.role })

        await completeOAuthLogin(user, accessToken)

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
  }, [searchParams, router, completeOAuthLogin])

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

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
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
                Please wait while we complete your authentication...
              </p>
            </div>
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  )
}
