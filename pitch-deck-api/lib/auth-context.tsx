"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import type { User, LoginResponse } from "./types"
import { login as apiLogin } from "./api"

interface AuthContextType {
  user: User | null
  token: string | null
  isLoading: boolean
  isAdmin: boolean
  isSuperAdmin: boolean
  login: (email: string, password: string) => Promise<User>
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

  const logout = useCallback(() => {
    setUser(null)
    setToken(null)
    document.cookie = "auth_token=; path=/; max-age=0"
    document.cookie = "auth_user=; path=/; max-age=0"
  }, [])

  const isAdmin = user?.role === "admin" || user?.role === "superadmin"
  const isSuperAdmin = user?.role === "superadmin"

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, isAdmin, isSuperAdmin, login, logout }}
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
