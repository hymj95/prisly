export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      price_alerts: {
        Row: {
          alert_triggered: boolean
          created_at: string
          current_price: number | null
          id: string
          is_active: boolean
          product_brand: string | null
          product_name: string
          store_location: string | null
          store_name: string | null
          target_price: number
          updated_at: string
          user_id: string
        }
        Insert: {
          alert_triggered?: boolean
          created_at?: string
          current_price?: number | null
          id?: string
          is_active?: boolean
          product_brand?: string | null
          product_name: string
          store_location?: string | null
          store_name?: string | null
          target_price: number
          updated_at?: string
          user_id: string
        }
        Update: {
          alert_triggered?: boolean
          created_at?: string
          current_price?: number | null
          id?: string
          is_active?: boolean
          product_brand?: string | null
          product_name?: string
          store_location?: string | null
          store_name?: string | null
          target_price?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      price_scans: {
        Row: {
          barcode: string
          created_at: string
          id: string
          price: number
          product_brand: string | null
          product_category: string | null
          product_image: string | null
          product_name: string
          quantity: number
          store_location: string | null
          store_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          barcode: string
          created_at?: string
          id?: string
          price: number
          product_brand?: string | null
          product_category?: string | null
          product_image?: string | null
          product_name: string
          quantity?: number
          store_location?: string | null
          store_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          barcode?: string
          created_at?: string
          id?: string
          price?: number
          product_brand?: string | null
          product_category?: string | null
          product_image?: string | null
          product_name?: string
          quantity?: number
          store_location?: string | null
          store_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ratings: {
        Row: {
          created_at: string
          id: string
          product_brand: string | null
          product_name: string
          rating: number
          review: string | null
          store_location: string | null
          store_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_brand?: string | null
          product_name: string
          rating: number
          review?: string | null
          store_location?: string | null
          store_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_brand?: string | null
          product_name?: string
          rating?: number
          review?: string | null
          store_location?: string | null
          store_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      stores: {
        Row: {
          address: string
          category: string | null
          city: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
          opening_hours: Json | null
          phone: string | null
          postal_code: string | null
          updated_at: string
          verified: boolean
          website: string | null
        }
        Insert: {
          address: string
          category?: string | null
          city: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          verified?: boolean
          website?: string | null
        }
        Update: {
          address?: string
          category?: string | null
          city?: string
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
          opening_hours?: Json | null
          phone?: string | null
          postal_code?: string | null
          updated_at?: string
          verified?: boolean
          website?: string | null
        }
        Relationships: []
      }
      wishlists: {
        Row: {
          created_at: string
          id: string
          product_brand: string | null
          product_image: string | null
          product_name: string
          product_price: number | null
          store_location: string | null
          store_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_brand?: string | null
          product_image?: string | null
          product_name: string
          product_price?: number | null
          store_location?: string | null
          store_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_brand?: string | null
          product_image?: string | null
          product_name?: string
          product_price?: number | null
          store_location?: string | null
          store_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      product_rating_summary: {
        Row: {
          avg_rating: number | null
          five_star_count: number | null
          four_star_count: number | null
          one_star_count: number | null
          positive_count: number | null
          product_brand: string | null
          product_name: string | null
          rating_count: number | null
          store_location: string | null
          store_name: string | null
          three_star_count: number | null
          two_star_count: number | null
        }
        Relationships: []
      }
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
