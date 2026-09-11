// Specific DB / domain types only — input shapes come from zod schemas
export type WardrobeRow = {
  id: string
  user_id: string
  image_url: string | null
  image_file_id: string | null
  title: string
  type: string
  description: string | null
  status: string
  store_location: string | null
  borrowed_by: string | null
  in_use_since: string | null
  created_at: string
  updated_at: string
}

export type WardrobeListResult = {
  items: WardrobeRow[]
  total: number
  page: number
  limit: number
}
