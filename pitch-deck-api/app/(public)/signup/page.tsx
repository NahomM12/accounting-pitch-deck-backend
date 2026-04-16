"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { TrendingUp, Eye, EyeOff, AlertCircle, ArrowLeft, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { LoginResponse } from "@/lib/types"
import { API_BASE_URL } from "@/lib/api"
import { toast } from "sonner"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { getOAuthRedirectUrl } from "@/lib/api"

import Image from "next/image"

// Define the error response type
interface ValidationErrorResponse {
  message?: string
  error?: string
  errors?: Record<string, string[]>
}

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  // State for field-specific errors
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  // State for general form error
  const [formError, setFormError] = useState<string | null>(null)
  
  const router = useRouter()

  useEffect(() => setMounted(true), [])

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
          const errors: Record<string, string> = {}
          
          Object.entries(data.errors).forEach(([field, messages]) => {
            if (Array.isArray(messages) && messages.length > 0) {
              errors[field] = messages[0]
            }
          })
          
          setFieldErrors(errors)
          
          const firstErrorField = Object.keys(errors)[0]
          if (firstErrorField) {
            toast.error(errors[firstErrorField])
          } else {
            toast.error("Please check the form for errors")
          }
        } else {
          const errorMessage = data.message || data.error || "Sign up failed"
          setFormError(errorMessage)
          toast.error(errorMessage)
        }
        
        setIsLoading(false)
        return
      }

      // Success - Send OTP and redirect to verification page
      toast.success("OTP sent to your email. Please verify to complete registration.")
      
      // Get redirect parameter from URL if it exists
      const params = new URLSearchParams(window.location.search)
      const redirect = params.get('redirect')
      
      // Navigate to OTP page with email, purpose, and optional redirect
      let otpUrl = `/otp?email=${encodeURIComponent(email)}&purpose=register`
      if (redirect) {
        otpUrl += `&redirect=${encodeURIComponent(redirect)}`
      }
      
      router.push(otpUrl)
      
    } catch (err) {
      const error = err as Error
      setFormError(error.message || "Failed to sign up")
      toast.error(error.message || "Failed to sign up")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-background relative">
      {/* Back to Home Button */}
      <Link href="/" className="absolute top-6 left-6 lg:left-8 z-50 flex items-center gap-2 text-foreground/80 hover:text-foreground lg:text-white/80 lg:hover:text-white transition-colors duration-200 bg-background/50 lg:bg-black/20 hover:bg-background/80 lg:hover:bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-border lg:border-white/10">
        <ArrowLeft className="w-4 h-4" />
        <span className="font-medium text-sm">Back to Home</span>
      </Link>

      {/* Theme Toggle Button */}
      <button
        aria-label="Toggle theme"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        className="absolute top-6 right-6 lg:right-8 z-50 p-2 rounded-full bg-background/50 lg:bg-black/20 hover:bg-background/80 lg:hover:bg-black/40 backdrop-blur-md border border-border lg:border-white/10 text-foreground/80 hover:text-foreground lg:text-white/80 lg:hover:text-white transition-colors"
      >
        {mounted && (resolvedTheme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />)}
      </button>

      {/* Left side: Hero Element */}
      <div className="hidden lg:flex relative w-1/2 bg-[#0a0a0a] flex-col items-start justify-center overflow-hidden">
        {/* Background Image Layer */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/addis2.webp"
            alt="Addis Ababa Cityscape"
            fill
            className="object-cover object-right opacity-80"
            priority
          />
          {/* Gradients for Blending Image into Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0a0a]/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/40 via-transparent to-[#0a0a0a]/40" />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        {/* Central Glow/Halo Layer */}
        <div className="absolute inset-0 z-10 flex items-center justify-center pointer-events-none">
          <div
            className="w-[600px] h-[600px] rounded-full blur-[120px] bg-[radial-gradient(circle,_rgba(233,180,73,0.3)_0%,_rgba(74,123,167,0.2)_40%,_transparent_70%)] opacity-80"
          />
        </div>

        {/* Content */}
        <div className="relative z-20 flex flex-col items-start justify-center px-12 xl:px-20 w-full overflow-visible -mt-20">
          <div className="flex flex-col items-start leading-[1.1] tracking-tight font-extrabold w-full">
            <span className="text-5xl lg:text-6xl xl:text-7xl text-white mt-0 transition-all duration-500 hover:text-white/80">
              Where
            </span>
            <span className="text-5xl lg:text-6xl xl:text-7xl text-white mt-2 transition-all duration-500 hover:text-white/80">
              Vision Meets
            </span>
            <div className="flex items-center mt-2 ml-0 w-full">
              <span className="text-5xl lg:text-6xl xl:text-7xl text-transparent bg-clip-text bg-gradient-to-r from-[#7abce8] to-[#e9b449]">
                Capital
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side: Form */}
      <div className="flex flex-1 flex-col justify-center px-4 pt-20 pb-8 sm:px-6 lg:pt-8 lg:pb-8 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-[400px]">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity flex-shrink-0">
              <Image src="/logo.webp" alt="Ascend Finance & Advisory" width={64} height={64} />
              <div className="text-left">
                <p className="font-serif font-bold text-foreground text-2xl">Ascend</p>
                <p className="text-sm font-medium text-[#e9b449]">Finance & Advisory</p>
              </div>
            </Link>
          </div>

          <div className="mb-6 text-center">
            <h1 className="font-serif text-4xl font-extrabold text-foreground tracking-tight">Sign Up</h1>
            <p className="mt-2 text-sm text-muted-foreground">Create an account to explore pitch decks.</p>
          </div>

          {/* Display general form error if any */}
          {formError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Name Field */}
            <div className="flex flex-col gap-1.5">
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
                className={`h-11 ${fieldErrors.name ? "border-destructive focus-visible:ring-destructive" : ""}`}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
              />
              {fieldErrors.name && (
                <p id="name-error" className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="flex flex-col gap-1.5">
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
                className={`h-11 ${fieldErrors.email ? "border-destructive focus-visible:ring-destructive" : ""}`}
                aria-invalid={!!fieldErrors.email}
                aria-describedby={fieldErrors.email ? "email-error" : undefined}
              />
              {fieldErrors.email && (
                <p id="email-error" className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.email}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div className="flex flex-col gap-1.5">
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
                  className={`pr-10 h-11 ${fieldErrors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? "password-error" : undefined}
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
              {fieldErrors.password && (
                <p id="password-error" className="text-xs text-destructive flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {fieldErrors.password}
                </p>
              )}
              {!fieldErrors.password && password.length > 0 && password.length < 8 && (
                <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="font-serif font-semibold h-11 mt-1 bg-gradient-to-r from-[#5b8ab5] to-[#e9b449] text-white rounded-full hover:shadow-lg hover:shadow-[#e9b449]/50 transition-all duration-300 transform hover:scale-[1.03] border-0 hover:text-white"
            >
              {isLoading ? "Creating account..." : "Sign Up with Email"}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-background px-2 text-muted-foreground">Or sign up with</span>
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3">
              <Button
                variant="outline"
                type="button"
                onClick={() => handleOAuthSignup('google')}
                className="font-serif h-11 hover:bg-transparent hover:text-foreground"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
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
                className="font-serif h-11 hover:bg-transparent hover:text-foreground"
              >
                <svg className="mr-3 h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#f25022" d="M11.4 11.4H2.6V2.6h8.8v8.8z"/>
                  <path fill="#7fba00" d="M21.4 11.4h-8.8V2.6h8.8v8.8z"/>
                  <path fill="#00a4ef" d="M11.4 21.4H2.6v-8.8h8.8v8.8z"/>
                  <path fill="#ffb900" d="M21.4 21.4h-8.8v-8.8h8.8v8.8z"/>
                </svg>
                Sign up with Microsoft
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center flex flex-col gap-2">
            <p className="text-sm text-muted-foreground">
              Already have an account? <a href="#" onClick={(e) => {
                e.preventDefault();
                const params = new URLSearchParams(window.location.search);
                const redirect = params.get('redirect');
                window.location.href = redirect ? `/login?redirect=${redirect}` : "/login";
              }} className="text-primary font-medium hover:underline">Sign in</a>
            </p>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            By continuing, you agree to Ascend Accounting and Advisory's{" "}
            <Link href="https://www.ascendadvisoryet.com/legal#terms-of-use" className="font-semibold hover:text-primary hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
              Terms of use
            </Link>
            ,{" "}
            <Link href="/terms" className="font-semibold hover:text-primary hover:underline transition-colors">
              Conditions
            </Link>{" "}
            and{" "}
            <Link href="https://www.ascendadvisoryet.com/legal#privacy-policy" className="font-semibold hover:text-primary hover:underline transition-colors" target="_blank" rel="noopener noreferrer">
              Privacy policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  )
}