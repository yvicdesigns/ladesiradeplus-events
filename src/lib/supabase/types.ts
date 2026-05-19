export type ServiceType = "logistique" | "traiteur" | "decoration";
export type OrderStatus = "pending" | "confirmed" | "delivered" | "cancelled";
export type UserRole = "user" | "admin";

export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          slug: string;
          service: ServiceType;
          name_fr: string;
          name_en: string;
          icon: string;
          image_url: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          service: ServiceType;
          name_fr: string;
          name_en: string;
          icon: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          service?: ServiceType;
          name_fr?: string;
          name_en?: string;
          icon?: string;
          image_url?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Relationships: [];
      };
      articles: {
        Row: {
          id: string;
          slug: string;
          service: ServiceType;
          category_id: string;
          name_fr: string;
          name_en: string;
          description_fr: string;
          description_en: string;
          price_per_day: number;
          unit_fr: string;
          stock_available: number;
          images: string[];
          is_active: boolean;
          is_featured: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          service: ServiceType;
          category_id: string;
          name_fr: string;
          name_en: string;
          description_fr: string;
          description_en: string;
          price_per_day: number;
          unit_fr: string;
          stock_available?: number;
          images?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          service?: ServiceType;
          category_id?: string;
          name_fr?: string;
          name_en?: string;
          description_fr?: string;
          description_en?: string;
          price_per_day?: number;
          unit_fr?: string;
          stock_available?: number;
          images?: string[];
          is_active?: boolean;
          is_featured?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          first_name: string | null;
          last_name: string | null;
          phone: string | null;
          role: UserRole;
          created_at: string;
        };
        Insert: {
          id: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Update: {
          id?: string;
          first_name?: string | null;
          last_name?: string | null;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
        };
        Relationships: [];
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          customer_name: string;
          customer_phone: string;
          event_date: string;
          delivery_address: string | null;
          notes: string | null;
          total_amount: number;
          status: OrderStatus;
          whatsapp_sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          customer_name: string;
          customer_phone: string;
          event_date: string;
          delivery_address?: string | null;
          notes?: string | null;
          total_amount: number;
          status?: OrderStatus;
          whatsapp_sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          customer_name?: string;
          customer_phone?: string;
          event_date?: string;
          delivery_address?: string | null;
          notes?: string | null;
          total_amount?: number;
          status?: OrderStatus;
          whatsapp_sent_at?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          article_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Insert: {
          id?: string;
          order_id: string;
          article_id: string;
          quantity: number;
          unit_price: number;
          subtotal: number;
        };
        Update: {
          id?: string;
          order_id?: string;
          article_id?: string;
          quantity?: number;
          unit_price?: number;
          subtotal?: number;
        };
        Relationships: [];
      };
      settings: {
        Row: { key: string; value: string };
        Insert: { key: string; value: string };
        Update: { key?: string; value?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
  };
}

// Convenience types
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Article = Database["public"]["Tables"]["articles"]["Row"];
export type Order = Database["public"]["Tables"]["orders"]["Row"];
export type OrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
