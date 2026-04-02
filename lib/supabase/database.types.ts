export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string;
          display_name: string | null;
          email: string | null;
          id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          display_name?: string | null;
          email?: string | null;
          id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          created_at: string;
          id: string;
          name: string;
          profile_id: string | null;
          scope: Database["public"]["Enums"]["scope"];
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          name: string;
          profile_id?: string | null;
          scope: Database["public"]["Enums"]["scope"];
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          name?: string;
          profile_id?: string | null;
          scope?: Database["public"]["Enums"]["scope"];
          slug?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      catalog_items: {
        Row: {
          category_id: string;
          created_at: string;
          default_unit: string | null;
          id: string;
          name: string;
          normalized_name: string;
          profile_id: string | null;
          scope: Database["public"]["Enums"]["scope"];
          updated_at: string;
        };
        Insert: {
          category_id: string;
          created_at?: string;
          default_unit?: string | null;
          id?: string;
          name: string;
          normalized_name: string;
          profile_id?: string | null;
          scope: Database["public"]["Enums"]["scope"];
          updated_at?: string;
        };
        Update: {
          category_id?: string;
          created_at?: string;
          default_unit?: string | null;
          id?: string;
          name?: string;
          normalized_name?: string;
          profile_id?: string | null;
          scope?: Database["public"]["Enums"]["scope"];
          updated_at?: string;
        };
        Relationships: [];
      };
      packing_templates: {
        Row: {
          created_at: string;
          id: string;
          is_default: boolean;
          name: string;
          profile_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_default?: boolean;
          name: string;
          profile_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_default?: boolean;
          name?: string;
          profile_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      packing_template_items: {
        Row: {
          catalog_item_id: string | null;
          category_name: string;
          created_at: string;
          id: string;
          item_name: string;
          item_normalized_name: string;
          quantity: number;
          sort_order: number;
          template_id: string;
          unit: string;
          updated_at: string;
        };
        Insert: {
          catalog_item_id?: string | null;
          category_name: string;
          created_at?: string;
          id?: string;
          item_name: string;
          item_normalized_name: string;
          quantity: number;
          sort_order?: number;
          template_id: string;
          unit: string;
          updated_at?: string;
        };
        Update: {
          catalog_item_id?: string | null;
          category_name?: string;
          created_at?: string;
          id?: string;
          item_name?: string;
          item_normalized_name?: string;
          quantity?: number;
          sort_order?: number;
          template_id?: string;
          unit?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trips: {
        Row: {
          created_at: string;
          current_leg_index: number;
          id: string;
          mode: Database["public"]["Enums"]["trip_mode"];
          name: string;
          profile_id: string;
          status: Database["public"]["Enums"]["trip_status"];
          template_id: string | null;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          current_leg_index?: number;
          id?: string;
          mode: Database["public"]["Enums"]["trip_mode"];
          name: string;
          profile_id: string;
          status?: Database["public"]["Enums"]["trip_status"];
          template_id?: string | null;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          current_leg_index?: number;
          id?: string;
          mode?: Database["public"]["Enums"]["trip_mode"];
          name?: string;
          profile_id?: string;
          status?: Database["public"]["Enums"]["trip_status"];
          template_id?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      trip_stops: {
        Row: {
          created_at: string;
          id: string;
          kind: Database["public"]["Enums"]["stop_kind"];
          name: string;
          position: number;
          trip_id: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          kind: Database["public"]["Enums"]["stop_kind"];
          name: string;
          position: number;
          trip_id: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          kind?: Database["public"]["Enums"]["stop_kind"];
          name?: string;
          position?: number;
          trip_id?: string;
        };
        Relationships: [];
      };
      trip_items: {
        Row: {
          catalog_item_id: string | null;
          category_name: string;
          created_at: string;
          id: string;
          item_name: string;
          item_normalized_name: string;
          quantity: number;
          sort_order: number;
          template_item_id: string | null;
          trip_id: string;
          unit: string;
        };
        Insert: {
          catalog_item_id?: string | null;
          category_name: string;
          created_at?: string;
          id?: string;
          item_name: string;
          item_normalized_name: string;
          quantity: number;
          sort_order?: number;
          template_item_id?: string | null;
          trip_id: string;
          unit: string;
        };
        Update: {
          catalog_item_id?: string | null;
          category_name?: string;
          created_at?: string;
          id?: string;
          item_name?: string;
          item_normalized_name?: string;
          quantity?: number;
          sort_order?: number;
          template_item_id?: string | null;
          trip_id?: string;
          unit?: string;
        };
        Relationships: [];
      };
      trip_legs: {
        Row: {
          created_at: string;
          from_stop_id: string;
          id: string;
          position: number;
          status: Database["public"]["Enums"]["leg_status"];
          to_stop_id: string;
          trip_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          from_stop_id: string;
          id?: string;
          position: number;
          status?: Database["public"]["Enums"]["leg_status"];
          to_stop_id: string;
          trip_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          from_stop_id?: string;
          id?: string;
          position?: number;
          status?: Database["public"]["Enums"]["leg_status"];
          to_stop_id?: string;
          trip_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trip_leg_item_checks: {
        Row: {
          created_at: string;
          id: string;
          is_packed: boolean;
          leg_id: string;
          packed_at: string | null;
          trip_item_id: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          id?: string;
          is_packed?: boolean;
          leg_id: string;
          packed_at?: string | null;
          trip_item_id: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          id?: string;
          is_packed?: boolean;
          leg_id?: string;
          packed_at?: string | null;
          trip_item_id?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      copy_starter_template_for_profile: {
        Args: {
          p_profile_id: string;
          p_template_name?: string;
        };
        Returns: string;
      };
      ensure_profile_starter_template: {
        Args: {
          p_profile_id: string;
          p_template_name?: string;
        };
        Returns: string;
      };
      get_starter_template_blueprint: {
        Args: Record<PropertyKey, never>;
        Returns: {
          catalog_item_id: string;
          category_name: string;
          item_name: string;
          quantity: number;
          sort_order: number;
          unit: string;
        }[];
      };
      merge_packing_profiles: {
        Args: {
          p_source_profile_id: string;
          p_target_profile_id: string;
        };
        Returns: Json;
      };
      seed_packing_system_defaults: {
        Args: Record<PropertyKey, never>;
        Returns: undefined;
      };
      set_default_packing_template: {
        Args: {
          p_profile_id: string;
          p_template_id: string;
        };
        Returns: string;
      };
    };
    Enums: {
      leg_status: "pending" | "active" | "completed" | "skipped";
      scope: "system" | "user";
      stop_kind: "home" | "stop";
      trip_mode: "simple" | "multi_stop";
      trip_status: "draft" | "active" | "completed" | "archived";
    };
    CompositeTypes: Record<string, never>;
  };
}
