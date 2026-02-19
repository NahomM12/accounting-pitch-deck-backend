export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "superadmin" | "investors"
  created_at: string
  updated_at: string
}

export interface Founder {
  id: number
  company_name: string
  sector: string
  location: string
  funding_stage: string
  valuation: string
  years_of_establishment: number
  funding_amount: number
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
  funding_stage?: string
  min_funding_amount?: string
  max_funding_amount?: string
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

export const FUNDING_STAGES = [
  "pre-seed",
  "seed",
  "series A",
  "series B",
  "series C",
  "IPO",
] as const

export const VALUATION_STAGES = [
  "pre seed under 1M$",
  "seed 1M$ - 5M$",
  "series A 5M$ - 10M$",
  "series B 10M$ - 50M$",
  "series C 50M$ - 100M$",
  "IPO 100M$+",
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
