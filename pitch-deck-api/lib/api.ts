import type {
  AdminActivity,
  Appointment,
  AppointmentSlot,
  AvailabilitySlot,
  Founder,
  FounderFilters,
  LoginResponse,
  PitchDeck,
  PitchDeckDownloadLog,
  User,
} from "./types"

export const API_BASE_URL =
process.env.NEXT_PUBLIC_API_URL || "https://pitchdeck.ascendadvisoryet.com/api"
//process.env.NEXT_PUBLIC_API_URL || "http://finance-backend.test/api"
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

// OAuth functions
export async function oauthLogin(provider: string, accessToken: string): Promise<LoginResponse> {
  return request<LoginResponse>(`/oauth/${provider}/login`, {
    method: "POST",
    body: JSON.stringify({ access_token: accessToken }),
  })
}

export function getOAuthRedirectUrl(provider: string): string {
  return `${API_BASE_URL}/oauth/${provider}/redirect`
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

export async function verifyRegistrationOtp(data: {
  email: string
  otp: string
}): Promise<LoginResponse> {
  return request<LoginResponse>("/verify-otp", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function sendForgotPasswordOtp(email: string): Promise<{ message: string }> {
  return request<{ message: string }>("/forgot-password/send-otp", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export async function verifyForgotPasswordOtp(data: {
  email: string
  otp: string
  password: string
  password_confirmation: string
}): Promise<{ message: string }> {
  return request<{ message: string }>("/forgot-password/verify-otp", {
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

export async function getPitchDeckFileUrl(id: number): Promise<string> {
  return `${getApiOrigin()}/api/pitch-decks/${id}/file`
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

export async function getDownloadLogs(): Promise<PitchDeckDownloadLog[]> {
  return request<PitchDeckDownloadLog[]>("/admin/downloads")
}

// Appointments
export async function getAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/appointments")
}

export async function createAppointmentSlot(data: {
  scheduled_at: string
  duration_minutes?: number
  title?: string
  notes?: string
}): Promise<Appointment> {
  return request<Appointment>("/appointments", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function updateAppointment(
  id: number,
  data: Partial<Pick<Appointment, "scheduled_at" | "duration_minutes" | "status" | "title" | "notes">>
): Promise<Appointment> {
  return request<Appointment>(`/appointments/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteAppointment(id: number): Promise<void> {
  return request<void>(`/appointments/${id}`, { method: "DELETE" })
}

export async function getAvailableAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/appointments/available")
}

export async function getMyAppointments(): Promise<Appointment[]> {
  return request<Appointment[]>("/appointments/mine")
}

export async function getAvailability(dayOfWeek?: string): Promise<AvailabilitySlot[]> {
  const query = dayOfWeek ? `?day_of_week=${encodeURIComponent(dayOfWeek)}` : ""
  return request<AvailabilitySlot[]>(`/availability${query}`)
}

export async function createAvailabilitySlot(data: {
  day_of_week: string
  start_time: string
  end_time: string
  increment_minutes: number
}): Promise<AvailabilitySlot> {
  return request<AvailabilitySlot>("/availability", {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function deleteAvailabilitySlot(id: number): Promise<void> {
  return request<void>(`/availability/${id}`, { method: "DELETE" })
}

export async function getAppointmentSlots(): Promise<AppointmentSlot[]> {
  return request<AppointmentSlot[]>("/appointments/available")
}

export async function bookAppointmentAt(time: string): Promise<Appointment> {
  return request<Appointment>("/appointments/book", {
    method: "POST",
    body: JSON.stringify({ scheduled_at: time }),
  })
}

// Users
export async function getUsers(): Promise<User[]> {
  return request<User[]>("/users")
}

export async function logout(): Promise<void> {
  return request<void>("/logout", { method: "POST" })
}

export async function deleteUser(id: number): Promise<void> {
  return request<void>(`/users/${id}`, { method: "DELETE" })
}
 
/**
 * Get thumbnail URL for a pitch deck (uses API endpoint, no symlink needed)
 */
export function getThumbnailUrl(pitchDeckId: number): string {
    return `${API_BASE_URL}/thumbnails/${pitchDeckId}`
}
export async function previewPitchDeckFile(id: number): Promise<{ blob: Blob; contentType: string | null; fileName: string }> {
  const token = getToken()
  const headers: HeadersInit = {
    Accept: "application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation",
  }
  if (token) headers["Authorization"] = `Bearer ${token}`

  const response = await fetch(`${API_BASE_URL}/pitch-decks/${id}/file`, { headers })
  
  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Please login to view this file")
    }
    if (response.status === 403) {
      throw new Error("You don't have permission to access this file")
    }
    if (response.status === 404) {
      throw new Error("File not found")
    }
    throw new Error("Failed to load file")
  }
  
  const blob = await response.blob()
  const contentType = response.headers.get("Content-Type")
  
  // Try to get filename from Content-Disposition header
  const contentDisposition = response.headers.get("Content-Disposition")
  let fileName = `pitch-deck-${id}`
  if (contentDisposition) {
    const match = contentDisposition.match(/filename="?([^"]+)"?/)
    if (match) fileName = match[1]
  }
  
  return { blob, contentType, fileName }
}