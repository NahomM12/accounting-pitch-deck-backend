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
import { getOAuthRedirectUrl } from "@/lib/api"

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

  const handleOAuthSignup = (provider: string) => {
    window.location.href = getOAuthRedirectUrl(provider)
  }

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
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthSignup('google')}
                className="font-serif"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Sign up with Google
              </Button>
              
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthSignup('microsoft')}
                className="font-serif"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M11.4 11.4H2.6V2.6h8.8v8.8z"/>
                  <path fill="#7fba00" d="M21.4 11.4h-8.8V2.6h8.8v8.8z"/>
                  <path fill="#00a4ef" d="M11.4 21.4H2.6v-8.8h8.8v8.8z"/>
                  <path fill="#ffb900" d="M21.4 21.4h-8.8v-8.8h8.8v8.8z"/>
                </svg>
                Sign up with Microsoft
              </Button>
            </div>
          </div>
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