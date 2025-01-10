export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      album: {
        Row: {
          album: number
          album_image: string | null
          album_info: string | null
          apple_link: string | null
          bugs_link: string | null
          date: string | null
          flo_link: string | null
          genie_link: string | null
          genre: string | null
          melon_link: string | null
          title: string
          total_song: number | null
        }
        Insert: {
          album?: number
          album_image?: string | null
          album_info?: string | null
          apple_link?: string | null
          bugs_link?: string | null
          date?: string | null
          flo_link?: string | null
          genie_link?: string | null
          genre?: string | null
          melon_link?: string | null
          title: string
          total_song?: number | null
        }
        Update: {
          album?: number
          album_image?: string | null
          album_info?: string | null
          apple_link?: string | null
          bugs_link?: string | null
          date?: string | null
          flo_link?: string | null
          genie_link?: string | null
          genre?: string | null
          melon_link?: string | null
          title?: string
          total_song?: number | null
        }
        Relationships: []
      }
      customer_info: {
        Row: {
          created_at: string
          email: string
          id: string
          name: string
          phone: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          name: string
          phone: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string
          user_id?: string
        }
        Relationships: []
      }
      goods: {
        Row: {
          color: string | null
          created_at: string | null
          delivery_info: string | null
          description: Json | null
          discount_rate: number | null
          id: string
          images: Json | null
          price: number
          review_count: number | null
          shipping_type: string | null
          size: string | null
          thumbnail: string | null
          title: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          delivery_info?: string | null
          description?: Json | null
          discount_rate?: number | null
          id?: string
          images?: Json | null
          price: number
          review_count?: number | null
          shipping_type?: string | null
          size?: string | null
          thumbnail?: string | null
          title: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          delivery_info?: string | null
          description?: Json | null
          discount_rate?: number | null
          id?: string
          images?: Json | null
          price?: number
          review_count?: number | null
          shipping_type?: string | null
          size?: string | null
          thumbnail?: string | null
          title?: string
        }
        Relationships: []
      }
      goods_reviews: {
        Row: {
          content: string | null
          created_at: string | null
          goods_id: string | null
          id: string
          name: string | null
          order_id: string | null
          rating: number | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          goods_id?: string | null
          id?: string
          name?: string | null
          order_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          goods_id?: string | null
          id?: string
          name?: string | null
          order_id?: string | null
          rating?: number | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "goods_reviews_goods_id_fkey"
            columns: ["goods_id"]
            isOneToOne: false
            referencedRelation: "goods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "goods_reviews_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          color: string | null
          created_at: string
          delivery_info: string | null
          discount_rate: number | null
          id: string
          is_confirmed: boolean | null
          order_id: string
          price: number
          product_id: string
          product_image: string | null
          product_name: string
          quantity: number
          rating: number | null
          review_count: number | null
          shipping_type: string | null
          size: string | null
          user_id: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string
          delivery_info?: string | null
          discount_rate?: number | null
          id?: string
          is_confirmed?: boolean | null
          order_id: string
          price: number
          product_id: string
          product_image?: string | null
          product_name: string
          quantity: number
          rating?: number | null
          review_count?: number | null
          shipping_type?: string | null
          size?: string | null
          user_id?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string
          delivery_info?: string | null
          discount_rate?: number | null
          id?: string
          is_confirmed?: boolean | null
          order_id?: string
          price?: number
          product_id?: string
          product_image?: string | null
          product_name?: string
          quantity?: number
          rating?: number | null
          review_count?: number | null
          shipping_type?: string | null
          size?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "order_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          address_line1: string | null
          address_line2: string | null
          amount: string | null
          created_at: string | null
          delivery_status: string | null
          id: string
          installment_months: number | null
          order_id: string | null
          order_name: string | null
          payment_method: string | null
          postal_code: string | null
          recipient_name: string | null
          recipient_phone: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          address_line1?: string | null
          address_line2?: string | null
          amount?: string | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          installment_months?: number | null
          order_id?: string | null
          order_name?: string | null
          payment_method?: string | null
          postal_code?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          address_line1?: string | null
          address_line2?: string | null
          amount?: string | null
          created_at?: string | null
          delivery_status?: string | null
          id?: string
          installment_months?: number | null
          order_id?: string | null
          order_name?: string | null
          payment_method?: string | null
          postal_code?: string | null
          recipient_name?: string | null
          recipient_phone?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      shipping_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          created_at: string
          id: string
          is_default: boolean
          postal_code: string
          recipient_name: string
          recipient_phone: string
          request: string
          user_id: string
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          created_at: string
          id?: string
          is_default: boolean
          postal_code: string
          recipient_name: string
          recipient_phone: string
          request: string
          user_id: string
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          created_at?: string
          id?: string
          is_default?: boolean
          postal_code?: string
          recipient_name?: string
          recipient_phone?: string
          request?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shipping_addresses_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
      user: {
        Row: {
          avatar_url: string | null
          email: string
          id: string
          name: string | null
        }
        Insert: {
          avatar_url?: string | null
          email: string
          id?: string
          name?: string | null
        }
        Update: {
          avatar_url?: string | null
          email?: string
          id?: string
          name?: string | null
        }
        Relationships: []
      }
      wish_lists: {
        Row: {
          created_at: string
          id: string
          product_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "wish_lists_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "goods"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wish_lists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      set_default_address: {
        Args: {
          p_address_id: string
          p_user_id: string
        }
        Returns: undefined
      }
      set_latest_as_default: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
      }
      update_default_address: {
        Args: {
          p_user_id: string
        }
        Returns: undefined
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
