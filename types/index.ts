export type Locale = 'en' | 'ru' | 'hy'

export type PropertyStatus = 'available' | 'sold' | 'reserved'
export type PropertyCountry = 'spain' | 'cyprus'

export interface Property {
  id: number
  name: string
  location: string
  price: number
  bedrooms: number | null
  bathrooms: number | null
  floor: number | null
  size_sqm: number | null
  parking: number
  status: PropertyStatus
  country: PropertyCountry
  ref: string | null
  description_en: string | null
  description_ru: string | null
  description_hy: string | null
  features_en: string | null
  features_ru: string | null
  features_hy: string | null
  internal_notes: string | null
  images: string[]           // JSON array (up to 20 URLs)
  latitude: number | null
  longitude: number | null
  created_at: string
  updated_at: string
}

export interface PropertyFormData {
  name: string
  location: string
  price: string
  bedrooms: string
  bathrooms: string
  floor: string
  size_sqm: string
  parking: boolean
  status: string
  country: string
  ref: string
  description_en: string
  description_ru: string
  description_hy: string
  features_en: string
  features_ru: string
  features_hy: string
  internal_notes: string
  images: string[]           // up to 20 URLs
  latitude: string
  longitude: string
}

export interface AdminUser {
  id: number
  username: string
  password_hash: string
  created_at: string
}
