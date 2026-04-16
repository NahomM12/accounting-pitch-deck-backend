"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { TrendingUp, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { sendForgotPasswordOtp, verifyForgotPasswordOtp } from "@/lib/api"

export default function ForgotPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [step, setStep] = useState<"request" | "reset">("request")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const prefillEmail = searchParams.get("email")
    const prefillOtp = searchParams.get("otp")
    if (prefillEmail) setEmail(prefillEmail)
    if (prefillOtp) {
      setOtp(prefillOtp)
      setStep("reset")
    }
  }, [searchParams])

  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!email) {
      toast.error("Please enter your email")
      return
    }
    try {
      setIsLoading(true)
      await sendForgotPasswordOtp(email)
      toast.success("Verification code sent to your email")
      setStep("reset")
    } catch (err) {
      const error = err as Error & { data?: { error?: string; message?: string } }
      toast.error(error.data?.error || error.data?.message || error.message || "Failed to send code")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()

    if (!email) {
      toast.error("Missing email")
      return
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match")
      return
    }

    try {
      setIsLoading(true)
      await verifyForgotPasswordOtp({
        email,
        otp,
        password,
        password_confirmation: confirmPassword,
      })
      toast.success("Password reset successfully. You can now sign in.")
      router.push("/login")
    } catch (err) {
      const error = err as Error & { data?: { error?: string; message?: string } }
      toast.error(error.data?.error || error.data?.message || error.message || "Failed to reset password")
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
            Reset your password
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "request"
              ? "Enter your email to receive a verification code."
              : "Enter the verification code and choose a new password."}
          </p>
        </div>

        <div className="rounded-xl border bg-card p-8 shadow-sm">
          {step === "request" ? (
            <form onSubmit={handleSendOtp} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                disabled={isLoading}
                className="font-serif font-semibold"
              >
                {isLoading ? "Sending..." : "Send verification code"}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleResetPassword} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="otp">Verification code</Label>
                <Input
                  id="otp"
                  type="text"
                  required
                  inputMode="numeric"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ""))}
                  placeholder="123456"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="password">New password</Label>
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
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your new password"
                />
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={isLoading || password.length < 8}
                className="font-serif font-semibold"
              >
                {isLoading ? "Resetting..." : "Reset password"}
              </Button>
            </form>
          )}

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Remembered your password?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

