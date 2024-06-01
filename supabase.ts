export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      locations: {
        Row: {
          address: string;
          items_found: number;
          location_id: string;
          name: string;
          x_coordinate: number;
          y_coordinate: number;
        };
        Insert: {
          address: string;
          items_found?: number;
          location_id?: string;
          name: string;
          x_coordinate: number;
          y_coordinate: number;
        };
        Update: {
          address?: string;
          items_found?: number;
          location_id?: string;
          name?: string;
          x_coordinate?: number;
          y_coordinate?: number;
        };
        Relationships: [];
      };
      pins: {
        Row: {
          claim_requests: number | null;
          created_at: string;
          creator_id: string;
          days_resolved: number;
          description: string | null;
          fts: unknown | null;
          in_possession: boolean;
          item: string | null;
          item_id: string;
          resolved: boolean;
          user_name: string | null;
          x_coordinate: number;
          y_coordinate: number;
          item_description_username: string | null;
        };
        Insert: {
          claim_requests?: number | null;
          created_at?: string;
          creator_id: string;
          days_resolved?: number;
          description?: string | null;
          fts?: unknown | null;
          in_possession?: boolean;
          item?: string | null;
          item_id?: string;
          resolved?: boolean;
          user_name?: string | null;
          x_coordinate?: number;
          y_coordinate?: number;
        };
        Update: {
          claim_requests?: number | null;
          created_at?: string;
          creator_id?: string;
          days_resolved?: number;
          description?: string | null;
          fts?: unknown | null;
          in_possession?: boolean;
          item?: string | null;
          item_id?: string;
          resolved?: boolean;
          user_name?: string | null;
          x_coordinate?: number;
          y_coordinate?: number;
        };
        Relationships: [
          {
            foreignKeyName: "fk_user_id";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          daily_pin_count: number;
          id: string;
          items_found: number | null;
          username: string | null;
        };
        Insert: {
          daily_pin_count?: number;
          id: string;
          items_found?: number | null;
          username?: string | null;
        };
        Update: {
          daily_pin_count?: number;
          id?: string;
          items_found?: number | null;
          username?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      requests: {
        Row: {
          contact: string | null;
          created_at: string;
          creator_id: string;
          creator_name: string | null;
          description: string | null;
          item_id: string;
          pin_creator_id: string;
          request_id: string;
          status: string;
        };
        Insert: {
          contact?: string | null;
          created_at?: string;
          creator_id: string;
          creator_name?: string | null;
          description?: string | null;
          item_id: string;
          pin_creator_id: string;
          request_id: string;
          status?: string;
        };
        Update: {
          contact?: string | null;
          created_at?: string;
          creator_id?: string;
          creator_name?: string | null;
          description?: string | null;
          item_id?: string;
          pin_creator_id?: string;
          request_id?: string;
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "public_requests_creator_id_fkey";
            columns: ["creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "public_requests_item_id_fkey";
            columns: ["item_id"];
            isOneToOne: false;
            referencedRelation: "pins";
            referencedColumns: ["item_id"];
          },
          {
            foreignKeyName: "public_requests_pin_creator_id_fkey";
            columns: ["pin_creator_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      testing_table: {
        Row: {
          created_at: string;
          id: number;
          name: string | null;
        };
        Insert: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Update: {
          created_at?: string;
          id?: number;
          name?: string | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      item_description_username: {
        Args: {
          "": unknown;
        };
        Returns: string;
      };
      reset_daily_pin_count: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      test_insert: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      update_days_resolved: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

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
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

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
    : never;
