/**
 * Types for the FamAlbum database schema.
 *
 * These were generated from `supabase/migrations/0001_init.sql` with:
 *   npx supabase gen types typescript --project-id <your-project-ref> > src/lib/database.types.ts
 *
 * If you change the schema, regenerate this file — do not hand-edit it.
 * (Session 2: the Supabase MCP server can introspect the live schema instead.)
 */

export type Visibility = 'private' | 'shared'

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
      photos: {
        Row: {
          id: string
          owner_id: string
          storage_path: string
          visibility: Visibility
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          owner_id: string
          storage_path: string
          visibility?: Visibility
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          owner_id?: string
          storage_path?: string
          visibility?: Visibility
          caption?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'photos_owner_id_fkey'
            columns: ['owner_id']
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      photo_visibility: Visibility
    }
  }
}

/** Convenience aliases so feature code never reaches into `Database[...]` by hand. */
export type PhotoRow = Database['public']['Tables']['photos']['Row']
export type PhotoInsert = Database['public']['Tables']['photos']['Insert']
export type PhotoUpdate = Database['public']['Tables']['photos']['Update']
