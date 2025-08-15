export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          role: string
          avatar: string | null
          phone: string | null
          created_at: string | null
          is_approved: boolean | null
          privacy_accepted: boolean | null
        }
        Insert: {
          id: string
          name: string
          email: string
          role: string
          avatar?: string | null
          phone?: string | null
          created_at?: string | null
          is_approved?: boolean | null
          privacy_accepted?: boolean | null
        }
        Update: {
          id?: string
          name?: string
          email?: string
          role?: string
          avatar?: string | null
          phone?: string | null
          created_at?: string | null
          is_approved?: boolean | null
          privacy_accepted?: boolean | null
        }
      }
      events: {
        Row: {
          id: string
          title: string
          date: string
          venue: string
          couple_names: Json
          guest_count: number
          budget: number
          spent: number
          is_public: boolean | null
          progress: number | null
          description: string | null
          location: string
          style: string
          photos: Json
          created_by: string
          status: string
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          title: string
          date: string
          venue: string
          couple_names?: Json
          guest_count?: number
          budget?: number
          spent?: number
          is_public?: boolean | null
          progress?: number | null
          description?: string | null
          location: string
          style: string
          photos?: Json
          created_by: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          date?: string
          venue?: string
          couple_names?: Json
          guest_count?: number
          budget?: number
          spent?: number
          is_public?: boolean | null
          progress?: number | null
          description?: string | null
          location?: string
          style?: string
          photos?: Json
          created_by?: string
          status?: string
          created_at?: string | null
          updated_at?: string | null
        }
      }
      vendors: {
        Row: {
          id: string
          name: string
          category: string
          email: string
          phone: string
          website: string | null
          rating: number
          review_count: number
          starting_price: number
          location: string
          description: string
          services: Json
          photos: Json
          availability: Json
          is_approved: boolean | null
          is_featured: boolean | null
          created_at: string | null
          social_media: Json | null
        }
        Insert: {
          id?: string
          name: string
          category: string
          email: string
          phone: string
          website?: string | null
          rating?: number
          review_count?: number
          starting_price?: number
          location: string
          description: string
          services?: Json
          photos?: Json
          availability?: Json
          is_approved?: boolean | null
          is_featured?: boolean | null
          created_at?: string | null
          social_media?: Json | null
        }
        Update: {
          id?: string
          name?: string
          category?: string
          email?: string
          phone?: string
          website?: string | null
          rating?: number
          review_count?: number
          starting_price?: number
          location?: string
          description?: string
          services?: Json
          photos?: Json
          availability?: Json
          is_approved?: boolean | null
          is_featured?: boolean | null
          created_at?: string | null
          social_media?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}