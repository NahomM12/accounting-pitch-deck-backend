export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "superadmin" | "investors"
  created_at: string
  updated_at: string
}

export interface AdminActivity {
  id: number
  admin_user_id: number
  action: string
  subject_type: string | null
  subject_id: number | null
  data: Record<string, unknown> | null
  ip_address: string | null
  created_at: string
  updated_at: string
  admin_user?: User
}

export interface PitchDeckDownloadLog {
  id: number
  user_id: number
  pitch_deck_id: number
  downloaded_at: string
  ip_address: string | null
  user?: User
  pitch_deck?: PitchDeck
}

export interface Appointment {
  id: number
  admin_user_id: number
  investor_user_id: number | null
  scheduled_at: string
  duration_minutes: number
  status: "available" | "booked" | "cancelled" | "completed"
  title: string | null
  notes: string | null
  created_at: string
  updated_at: string
  admin_user?: User
  investor_user?: User
}

export interface AvailabilitySlot {
  id: number
  admin_user_id: number
  day_of_week: "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"
  start_time: string
  end_time: string
  increment_minutes: number
  created_at: string
  updated_at: string
}

export interface AppointmentSlot {
  scheduled_at: string
  end_at: string
}

export interface Founder {
  id: number
  company_name: string
  sector: string
  location: string
  operational_stage: string
  valuation: string
  years_of_establishment: string
  investment_size: number
  description: string
  file_path: string | null
  status: string
  number_of_employees: string
  created_at: string
  updated_at: string
  pitch_decks?: PitchDeck[]
}

export interface PitchDeck {
  id: number
  founder_id: number
  title: string
  file_path: string
  file_type: "pdf" | "ppt" | "pptx"
  thumbnail_path: string | null
  status: "draft" | "published" | "archived"
  uploaded_by: number | null
  created_at: string
  updated_at: string
  founder?: Founder
}

export interface LoginResponse {
  user: User
  access_token: string
  token_type: string
}

export interface ApiError {
  error?: string
  message?: string
  errors?: Record<string, string[]>
}

export interface FounderFilters {
  company_name?: string
  sector?: string
  location?: string
  operational_stage?: string
  min_investment_size?: string
  max_investment_size?: string
  status?: string
  number_of_employees?: string
  search?: string
  sort_by?: string
  sort_direction?: "asc" | "desc"
}

export const LOCATIONS = [
  "addis ababa",
  "diredawa",
  "hawassa",
  "bahirdar",
  "gondar",
  "mekele",
] as const

export const SECTORS = [
  "Agriculture",
  "Manufacturing",
  "Finance",
  "Healthcare",
  "Education",
  "Energy",
  "Technology",
  "Transportation",
  "Tourism"
] as const

export const OPERATIONAL_STAGES = [
  "pre-operational",
  "early-operations",
  "revenue-generating",
  "profitable/cash-flow positive"
] as const

export const VALUATION_STAGES = [
  "pre seed under 1M$",
  "seed 1M$ - 5M$",
  "series A 5M$ - 10M$",
  "series B 10M$ - 50M$",
  "series C 50M$ - 100M$",
  "IPO 100M$+"
] as const

export const EMPLOYEE_RANGES = [
  "1-10",
  "11-50",
  "51-200",
  "201-500",
  "501-1000",
  "1001+",
] as const

export const PITCH_DECK_STATUSES = ["draft", "published", "archived"] as const

export const FOUNDER_STATUSES = ["pending", "active", "funded", "archived"] as const
