export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      pins: {
        Row: {
          claim_requests: number | null
          created_at: string
          creator_id: string
          description: string | null
          fts: unknown | null
          item: string | null
          item_id: string
          resolved: boolean
          user_name: string | null
          x_coordinate: number | null
          y_coordinate: number | null
          item_description_username: string | null
        }
        Insert: {
          claim_requests?: number | null
          created_at?: string
          creator_id: string
          description?: string | null
          fts?: unknown | null
          item?: string | null
          item_id?: string
          resolved?: boolean
          user_name?: string | null
          x_coordinate?: number | null
          y_coordinate?: number | null
        }
        Update: {
          claim_requests?: number | null
          created_at?: string
          creator_id?: string
          description?: string | null
          fts?: unknown | null
          item?: string | null
          item_id?: string
          resolved?: boolean
          user_name?: string | null
          x_coordinate?: number | null
          y_coordinate?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_id"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          id: string
          items_found: number | null
          username: string | null
        }
        Insert: {
          id: string
          items_found?: number | null
          username?: string | null
        }
        Update: {
          id?: string
          items_found?: number | null
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      requests: {
        Row: {
          contact: string | null
          created_at: string
          creator_id: string
          creator_name: string | null
          description: string | null
          item_id: string
          pin_creator_id: string
          request_id: string
          status: string
        }
        Insert: {
          contact?: string | null
          created_at?: string
          creator_id: string
          creator_name?: string | null
          description?: string | null
          item_id: string
          pin_creator_id: string
          request_id: string
          status?: string
        }
        Update: {
          contact?: string | null
          created_at?: string
          creator_id?: string
          creator_name?: string | null
          description?: string | null
          item_id?: string
          pin_creator_id?: string
          request_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_requests_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_requests_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "pins"
            referencedColumns: ["item_id"]
          },
          {
            foreignKeyName: "public_requests_pin_creator_id_fkey"
            columns: ["pin_creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      item_description_username: {
        Args: {
          "": unknown
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
