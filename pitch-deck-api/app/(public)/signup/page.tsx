"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TrendingUp, Eye, EyeOff, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LoginResponse } from "@/lib/types"
import { API_BASE_URL } from "@/lib/api"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Define the error response type
interface ValidationErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]> // This matches Laravel's format: { "field": ["error message"] }
}

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // State for field-specific errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  // State for general form error
  const [formError, setFormError] = useState<string | null>(null)
  
  const router = useRouter()

  // Clear field error when user starts typing
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value)
    if (fieldErrors.name) {
      setFieldErrors(prev => ({ ...prev, name: "" }))
    }
  }

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: "" }))
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
    if (fieldErrors.password) {
      setFieldErrors(prev => ({ ...prev, password: "" }))
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setFieldErrors({})
    setFormError(null)

    try {
      const res = await fetch(`${API_BASE_URL}/investors/register`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      const data = await res.json().catch(() => ({})) as ValidationErrorResponse

      if (!res.ok) {
        // Handle Laravel-style validation errors
        if (data.errors) {
          // Convert Laravel errors to field-specific error messages
          const errors: Record<string, string> = {}
          
          // Loop through each field and its array of errors
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              errors[field] = messages[0] // Take the first error message
            }
          })
          
          setFieldErrors(errors)
          
          // Show first error in toast as well
          const firstErrorField = Object.keys(errors)[0]
          if (firstErrorField) {
            toast.error(errors[firstErrorField])
          } else {
            toast.error("Please check the form for errors")
          }
        } else {
          // Handle other types of errors
          const errorMessage = data.message || data.error || "Sign up failed"
          setFormError(errorMessage)
          toast.error(errorMessage)
        }
        
        setIsLoading(false)
        return
      }

      // Success - store token and redirect
      const loginData = data as LoginResponse
      const maxAge = 60 * 60 * 24 * 7
      document.cookie = `auth_token=${loginData.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`
      document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(loginData.user))}; path=/; max-age=${maxAge}; SameSite=Lax`

      toast.success("Account created successfully!")
      window.location.href = "/"
    } catch (err) {
      const error = err as Error
      setFormError(error.message || "Failed to sign up")
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
          {/* Display general form error if any */}
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            {/* Name Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="name" className={fieldErrors.name ? "text-destructive" : ""}>
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                required
                value={name}
                onChange={handleNameChange}
                placeholder="Jane Doe"
                className={fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              {fieldErrors.name && (
                <p id="name-error" className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email" className={fieldErrors.email ? "text-destructive" : ""}>
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={handleEmailChange}
                placeholder="investor@example.com"
                className={fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field - FIXED with proper error handling */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="password" className={fieldErrors.password ? "text-destructive" : ""}>
                Password
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  placeholder="At least 8 characters"
                  className={`pr-10 ${fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
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
              {/* Password error message - this will now show properly */}
              {fieldErrors.password && (
                <p id="password-error" className="text-xs text-destructive mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.password}
                </p>
              )}
              {/* Password hint */}
              {!fieldErrors.password && password.length > 0 && password.length < 8 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Password must be at least 8 characters
                </p>
              )}
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

        <div className="mt-6 space-y-2 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
          <p className="text-xs">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-primary hover:underline">
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}