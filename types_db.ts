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
      companies: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      equipment: {
        Row: {
          category: string
          floor_plan_id: number | null
          id: string
          last_maintenance: string | null
          location: string
          name: string
          position: Json | null
          site_id: number
          status: string
        }
        Insert: {
          category: string
          floor_plan_id?: number | null
          id?: string
          last_maintenance?: string | null
          location: string
          name: string
          position?: Json | null
          site_id: number
          status: string
        }
        Update: {
          category?: string
          floor_plan_id?: number | null
          id?: string
          last_maintenance?: string | null
          location?: string
          name?: string
          position?: Json | null
          site_id?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "equipment_site_id_fkey"
            columns: ["site_id"]
            referencedRelation: "sites"
            referencedColumns: ["id"]
          }
        ]
      }
      sites: {
        Row: {
          company_id: number
          id: number
          name: string
        }
        Insert: {
          company_id: number
          id?: number
          name: string
        }
        Update: {
          company_id?: number
          id?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "sites_company_id_fkey"
            columns: ["company_id"]
            referencedRelation: "companies"
            referencedColumns: ["id"]
          }
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          email: string
          id: string
          name: string
          roles: Json
        }
        Insert: {
          avatar_url?: string | null
          email: string
          id: string
          name: string
          roles: Json
        }
        Update: {
          avatar_url?: string | null
          email?: string
          id?: string
          name?: string
          roles?: Json
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
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