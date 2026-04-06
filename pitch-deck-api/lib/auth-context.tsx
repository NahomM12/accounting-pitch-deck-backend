"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { User, LoginResponse } from "./types"
import { login as apiLogin, oauthLogin, logout as apiLogout } from "./api"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  login: (email: string, password: string) => Promise<User>
  oauthLogin: (provider: string, accessToken: string) => Promise<User>
  completeOAuthLogin: (user: User, accessToken: string) => Promise<User>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedUser = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_user="))
      ?.split("=")
      .slice(1)
      .join("=")
    const storedToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth_token="))
      ?.split("=")[1]

    if (storedUser && storedToken) {
      try {
        setUser(JSON.parse(decodeURIComponent(storedUser)))
        setToken(storedToken)
      } catch {
        // Invalid cookie data
      }
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email: string, password: string) => {
    const response: LoginResponse = await apiLogin(email, password)
    setUser(response.user)
    setToken(response.access_token)

    const maxAge = 60 * 60 * 24 * 7
    document.cookie = `auth_token=${response.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(response.user))}; path=/; max-age=${maxAge}; SameSite=Lax`

    return response.user
  }, [])

  const handleOAuthLogin = useCallback(async (provider: string, accessToken: string) => {
    const response: LoginResponse = await oauthLogin(provider, accessToken)
    setUser(response.user)
    setToken(response.access_token)

    const maxAge = 60 * 60 * 24 * 7
    document.cookie = `auth_token=${response.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(response.user))}; path=/; max-age=${maxAge}; SameSite=Lax`

    return response.user
  }, [])

  const completeOAuthLogin = useCallback(async (userData: User, accessToken: string) => {
    setUser(userData)
    setToken(accessToken)

    const maxAge = 60 * 60 * 24 * 7
    document.cookie = `auth_token=${accessToken}; path=/; max-age=${maxAge}; SameSite=Lax`
    document.cookie = `auth_user=${encodeURIComponent(JSON.stringify(userData))}; path=/; max-age=${maxAge}; SameSite=Lax`

    return userData
  }, [])

  const logout = useCallback(async () => {
    try {
      // Call backend logout to revoke tokens
      await apiLogout()
    } catch (error) {
      console.error("Backend logout failed:", error)
      // Continue with local cleanup even if backend fails
    }
    
    // Always clear local state and cookies
    setUser(null)
    setToken(null)
    document.cookie = "auth_token=; path=/; max-age=0"
    document.cookie = "auth_user=; path=/; max-age=0"
  }, [])

  const isAdmin = user?.role === "admin" || user?.role === "superadmin"
  const isSuperAdmin = user?.role === "superadmin"

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAdmin, isSuperAdmin, login, oauthLogin: handleOAuthLogin, completeOAuthLogin, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
