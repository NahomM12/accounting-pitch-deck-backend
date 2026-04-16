"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { API_BASE_URL, verifyRegistrationOtp, verifyForgotPasswordOtp } from "@/lib/api"

export default function OtpPage() {
  const [code, setCode] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  const email = searchParams.get("email") || ""
  const purpose = searchParams.get("purpose") || "register"

  async function handleResend() {
    if (!email) {
      toast.error("Missing email address")
      return
    }

    try {
      setIsLoading(true)
      const res = await fetch(`${API_BASE_URL}/otp/send`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        const message = data.message || data.error || "Failed to resend code"
        toast.error(message)
        return
      }

      toast.success("Verification code sent")
    } catch (error) {
      toast.error("Failed to resend code")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email) {
      toast.error("Missing email address")
      return
    }

    try {
      setIsLoading(true)

      if (purpose === "register") {
        const res = await verifyRegistrationOtp({ email, otp: code })
        const maxAge = 60 * 60 * 24 * 7
        document.cookie = `auth_token=${res.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`
        document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(res.user))}; path=/; max-age=${maxAge}; SameSite=Lax`

        toast.success("Account created successfully!")
        if (res.user.role === "investors") {
          router.push("/")
        } else {
          router.push("/dashboard/admin")
        }
      } else if (purpose === "reset") {
        router.push(`/forgot-password?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(code)}`)
      } else {
        toast.error("Unknown verification purpose")
      }
    } catch (err) {
      const error = err as Error & { data?: { error?: string; message?: string } }
      toast.error(error.data?.error || error.data?.message || error.message || "Verification failed")
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
            Enter verification code
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            We&apos;ve sent a 6-digit code to {email || "your email address"}.
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="code">Verification code</Label>
              <Input
                id="code"
                type="text"
                required
                inputMode="numeric"
                maxLength={6}
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/[^0-9]/g, ""))}
                placeholder="123456"
              />
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={code.length !== 6 || isLoading}
              className="font-serif font-semibold"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </Button>
          </form>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground">
            <button
              type="button"
              onClick={handleResend}
              className="text-primary hover:underline disabled:opacity-50"
              disabled={isLoading || !email}
            >
              Resend code
            </button>
            <Link href="/login" className="hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
