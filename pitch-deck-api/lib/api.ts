import type { AdminActivity, Founder, FounderFilters, LoginResponse, PitchDeck, User } from "./types"

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://accounting-pitch-deck-.test/api"

export function getApiOrigin(): string {
  return API_BASE_URL.replace(/\/api\/?$/, "")
}

function getToken(): string | null {
  if (typeof window === "undefined") return null
  return document.cookie
    .split("; ")
    .find((row) => row.startsWith("auth_token="))
    ?.split("=")[1] ?? null
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken()
  const headers: HeadersInit = {
    Accept: "application/json",
    ...(options.headers || {}),
  }

  if (token) {
    ;(headers as Record<string, string>)["Authorization"] = `Bearer ${token}`
  }

  if (
    !(options.body instanceof FormData) &&
    !((headers as Record<string, string>)["Content-Type"])
  ) {
    ;(headers as Record<string, string>)["Content-Type"] = "application/json"
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    const error = new Error(errorData.message || errorData.error || `Request failed with status ${response.status}`)
    ;(error as Error & { status: number; data: unknown }).status = response.status
    ;(error as Error & { data: unknown }).data = errorData
    throw error
  }

  if (response.status === 204) return null as T

  return response.json()
}

// Auth
export async function login(email: string, password: string): Promise<LoginResponse> {
  return request<LoginResponse>("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export async function adminRegister(data: {
  name: string
  email: string
  password: string
  role: string
}): Promise<User> {
  return request<User>("/admin/register", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

// Founders
export async function getFounders(filters?: FounderFilters): Promise<Founder[]> {
  const params = new URLSearchParams()
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== "" && value !== null) {
        params.append(key, String(value))
      }
    })
  }
  const query = params.toString() ? `?${params.toString()}` : ""
  return request<Founder[]>(`/founders${query}`)
}

export async function getFounder(id: number): Promise<Founder> {
  return request<Founder>(`/founders/${id}`)
}

export async function createFounder(data: FormData): Promise<{ message: string; founder: Founder; pitch_deck: PitchDeck; file_url: string }> {
  return request(`/founders`, {
    method: "POST",
    body: data,
  })
}

export async function updateFounder(id: number, data: Record<string, string | null>): Promise<Founder> {
  return request<Founder>(`/founders/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteFounder(id: number): Promise<void> {
  return request<void>(`/founders/${id}`, { method: "DELETE" })
}

// Pitch Decks
export async function getPitchDecks(): Promise<PitchDeck[]> {
  return request<PitchDeck[]>("/pitch-decks")
}

export async function getPitchDeck(id: number): Promise<PitchDeck> {
  return request<PitchDeck>(`/pitch-decks/${id}`)
}

// Public pitch decks (no auth, published only)
export async function getPublicPitchDecks(): Promise<PitchDeck[]> {
  return request<PitchDeck[]>("/public/pitch-decks")
}

export async function getPublicPitchDeck(id: number): Promise<PitchDeck> {
  return request<PitchDeck>(`/public/pitch-decks/${id}`)
}

export async function createPitchDeck(data: FormData): Promise<{ message: string; pitch_deck: PitchDeck; file_url: string }> {
  return request(`/pitch-decks`, {
    method: "POST",
    body: data,
  })
}

export async function updatePitchDeck(id: number, data: { title?: string; status?: string }): Promise<PitchDeck> {
  return request<PitchDeck>(`/pitch-decks/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deletePitchDeck(id: number): Promise<void> {
  return request<void>(`/pitch-decks/${id}`, { method: "DELETE" })
}

export async function updatePitchDeckFile(
  id: number,
  data: FormData
): Promise<{ message: string; pitch_deck: PitchDeck; file_url: string }> {
  return request(`/pitch-decks/${id}/file`, {
    method: "POST",
    body: data,
  })
}

export async function changePitchDeckStatus(
  id: number,
  data: { status: string; notes?: string }
): Promise<{ message: string; pitch_deck: PitchDeck; changes: { old_status: string; new_status: string; changed_by: string } }> {
  return request(`/pitch-decks/${id}/status`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function downloadPitchDeck(id: number): Promise<Blob> {
  const token = getToken()
  const headers: HeadersInit = { Accept: "application/octet-stream" }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}/pitch-decks/${id}/download`, { headers })
  if (!response.ok) throw new Error("Download failed")
  return response.blob()
}

// Thumbnails
export async function uploadThumbnail(
  pitchDeckId: number,
  data: FormData
): Promise<{ message: string; thumbnail_url: string; thumbnail_path: string }> {
  return request(`/pitch-decks/${pitchDeckId}/thumbnail`, {
    method: "POST",
    body: data,
  })
}

export async function deleteThumbnail(pitchDeckId: number): Promise<{ message: string }> {
  return request(`/pitch-decks/${pitchDeckId}/thumbnail`, {
    method: "DELETE",
  })
}

// Admin activities
export async function getAdminActivities(): Promise<AdminActivity[]> {
  return request<AdminActivity[]>("/admin/activities")
}

// Users
export async function getUsers(): Promise<User[]> {
  return request<User[]>("/users")
}

export async function deleteUser(id: number): Promise<void> {
  return request<void>(`/users/${id}`, { method: "DELETE" })
}
