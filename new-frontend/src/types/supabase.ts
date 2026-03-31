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
      box_contents: {
        Row: {
          box_content_id: string
          box_id: string
          category_id: string
          gender: Database["public"]["Enums"]["gender_enum"]
          quantity: number
          size_id: string | null
        }
        Insert: {
          box_content_id?: string
          box_id: string
          category_id: string
          gender: Database["public"]["Enums"]["gender_enum"]
          quantity?: number
          size_id?: string | null
        }
        Update: {
          box_content_id?: string
          box_id?: string
          category_id?: string
          gender?: Database["public"]["Enums"]["gender_enum"]
          quantity?: number
          size_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "box_contents_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "box_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "box_contents_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["box_id"]
          },
          {
            foreignKeyName: "box_contents_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
          {
            foreignKeyName: "box_contents_size_id_fkey"
            columns: ["size_id"]
            isOneToOne: false
            referencedRelation: "sizes"
            referencedColumns: ["size_id"]
          },
        ]
      }
      box_contents_backup: {
        Row: {
          box_content_id: string | null
          box_id: string | null
          category_id: string | null
          gender: Database["public"]["Enums"]["gender_enum"] | null
          quantity: number | null
        }
        Insert: {
          box_content_id?: string | null
          box_id?: string | null
          category_id?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          quantity?: number | null
        }
        Update: {
          box_content_id?: string | null
          box_id?: string | null
          category_id?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"] | null
          quantity?: number | null
        }
        Relationships: []
      }
      box_movements: {
        Row: {
          action: Database["public"]["Enums"]["box_movement_action"]
          box_id: string | null
          box_movement_id: string
          from_location_id: string | null
          moved_at: string | null
          moved_by: string | null
          note: string | null
          to_location_id: string | null
        }
        Insert: {
          action?: Database["public"]["Enums"]["box_movement_action"]
          box_id?: string | null
          box_movement_id?: string
          from_location_id?: string | null
          moved_at?: string | null
          moved_by?: string | null
          note?: string | null
          to_location_id?: string | null
        }
        Update: {
          action?: Database["public"]["Enums"]["box_movement_action"]
          box_id?: string | null
          box_movement_id?: string
          from_location_id?: string | null
          moved_at?: string | null
          moved_by?: string | null
          note?: string | null
          to_location_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "box_movements_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "box_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "box_movements_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["box_id"]
          },
          {
            foreignKeyName: "box_movements_from_location_id_fkey"
            columns: ["from_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
          {
            foreignKeyName: "box_movements_moved_by_fkey"
            columns: ["moved_by"]
            isOneToOne: false
            referencedRelation: "box_movements_view"
            referencedColumns: ["moved_by_user_id"]
          },
          {
            foreignKeyName: "box_movements_to_location_id_fkey"
            columns: ["to_location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
        ]
      }
      box_tags: {
        Row: {
          box_id: string
          tag_id: string
        }
        Insert: {
          box_id: string
          tag_id: string
        }
        Update: {
          box_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "box_tags_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "box_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "box_tags_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["box_id"]
          },
          {
            foreignKeyName: "box_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["tag_id"]
          },
        ]
      }
      boxes: {
        Row: {
          box_id: string
          box_name: string | null
          box_number: number
          created_at: string | null
          description: string | null
          donated_at: string | null
          location_id: string | null
          status: Database["public"]["Enums"]["box_status_enum"]
          updated_at: string | null
        }
        Insert: {
          box_id?: string
          box_name?: string | null
          box_number?: number
          created_at?: string | null
          description?: string | null
          donated_at?: string | null
          location_id?: string | null
          status?: Database["public"]["Enums"]["box_status_enum"]
          updated_at?: string | null
        }
        Update: {
          box_id?: string
          box_name?: string | null
          box_number?: number
          created_at?: string | null
          description?: string | null
          donated_at?: string | null
          location_id?: string | null
          status?: Database["public"]["Enums"]["box_status_enum"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "boxes_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
        ]
      }
      categories: {
        Row: {
          category_id: string
          description: string | null
          icon: string | null
          level: number
          name: string
          parent_id: string | null
        }
        Insert: {
          category_id?: string
          description?: string | null
          icon?: string | null
          level: number
          name: string
          parent_id?: string | null
        }
        Update: {
          category_id?: string
          description?: string | null
          icon?: string | null
          level?: number
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["category_id"]
          },
        ]
      }
      category_icons: {
        Row: {
          created_at: string
          data: string
          icon_id: string
          mime_type: string
          name: string
          uploaded_by: string | null
        }
        Insert: {
          created_at?: string
          data: string
          icon_id?: string
          mime_type: string
          name: string
          uploaded_by?: string | null
        }
        Update: {
          created_at?: string
          data?: string
          icon_id?: string
          mime_type?: string
          name?: string
          uploaded_by?: string | null
        }
        Relationships: []
      }
      hook_debug_log: {
        Row: {
          called_at: string | null
          id: number
          sub: string | null
          who: string | null
        }
        Insert: {
          called_at?: string | null
          id?: number
          sub?: string | null
          who?: string | null
        }
        Update: {
          called_at?: string | null
          id?: number
          sub?: string | null
          who?: string | null
        }
        Relationships: []
      }
      hook_error_log: {
        Row: {
          called_at: string | null
          error: string | null
          id: number
          sub: string | null
        }
        Insert: {
          called_at?: string | null
          error?: string | null
          id?: number
          sub?: string | null
        }
        Update: {
          called_at?: string | null
          error?: string | null
          id?: number
          sub?: string | null
        }
        Relationships: []
      }
      locations: {
        Row: {
          description: string | null
          level: number | null
          location_id: string
          name: string
          parent_id: string | null
        }
        Insert: {
          description?: string | null
          level?: number | null
          location_id?: string
          name: string
          parent_id?: string | null
        }
        Update: {
          description?: string | null
          level?: number | null
          location_id?: string
          name?: string
          parent_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "locations_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["location_id"]
          },
        ]
      }
      sizes: {
        Row: {
          category: Database["public"]["Enums"]["size_category_enum"]
          created_at: string | null
          gender: Database["public"]["Enums"]["gender_enum"]
          is_numerical: boolean | null
          name: string
          numerical_value: number | null
          region: Database["public"]["Enums"]["size_region_enum"]
          size_id: string
          updated_at: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["size_category_enum"]
          created_at?: string | null
          gender: Database["public"]["Enums"]["gender_enum"]
          is_numerical?: boolean | null
          name: string
          numerical_value?: number | null
          region: Database["public"]["Enums"]["size_region_enum"]
          size_id?: string
          updated_at?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["size_category_enum"]
          created_at?: string | null
          gender?: Database["public"]["Enums"]["gender_enum"]
          is_numerical?: boolean | null
          name?: string
          numerical_value?: number | null
          region?: Database["public"]["Enums"]["size_region_enum"]
          size_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          description: string | null
          name: string
          tag_id: string
        }
        Insert: {
          description?: string | null
          name: string
          tag_id?: string
        }
        Update: {
          description?: string | null
          name?: string
          tag_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "box_movements_view"
            referencedColumns: ["moved_by_user_id"]
          },
        ]
      }
      users: {
        Row: {
          can_create_box: boolean | null
          can_delete_box: boolean | null
          can_modify_box: boolean | null
          can_move_box: boolean | null
          id: string
          is_active: boolean | null
          name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        }
        Insert: {
          can_create_box?: boolean | null
          can_delete_box?: boolean | null
          can_modify_box?: boolean | null
          can_move_box?: boolean | null
          id: string
          is_active?: boolean | null
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Update: {
          can_create_box?: boolean | null
          can_delete_box?: boolean | null
          can_modify_box?: boolean | null
          can_move_box?: boolean | null
          id?: string
          is_active?: boolean | null
          name?: string | null
          role?: Database["public"]["Enums"]["user_role"] | null
        }
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "box_movements_view"
            referencedColumns: ["moved_by_user_id"]
          },
        ]
      }
    }
    Views: {
      box_movements_view: {
        Row: {
          action: Database["public"]["Enums"]["box_movement_action"] | null
          box_id: string | null
          box_movement_id: string | null
          box_name: string | null
          from_location_name: string | null
          moved_at: string | null
          moved_by_email: string | null
          moved_by_user_id: string | null
          note: string | null
          to_location_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "box_movements_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "box_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "box_movements_box_id_fkey"
            columns: ["box_id"]
            isOneToOne: false
            referencedRelation: "boxes"
            referencedColumns: ["box_id"]
          },
        ]
      }
      box_view: {
        Row: {
          contents: Json | null
          createdAt: string | null
          id: string | null
          location: string | null
          name: string | null
          status: Database["public"]["Enums"]["box_status_enum"] | null
          updatedAt: string | null
        }
        Relationships: []
      }
      user_view: {
        Row: {
          can_create_box: boolean | null
          can_delete_box: boolean | null
          can_modify_box: boolean | null
          can_move_box: boolean | null
          created_at: string | null
          email: string | null
          id: string | null
          is_active: boolean | null
          name: string | null
          role: Database["public"]["Enums"]["user_role"] | null
        } 
        Relationships: [
          {
            foreignKeyName: "users_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "box_movements_view"
            referencedColumns: ["moved_by_user_id"]
          },
        ]
      }
    }
    Functions: {
      add_user_role:
        | {
            Args: { new_role: string; new_user_id: number }
            Returns: undefined
          }
        | {
            Args: { new_role: string; new_user_id: string }
            Returns: undefined
          }
      add_user_role_uuid:
        | {
            Args: { new_role: string; new_user_id: string }
            Returns: undefined
          }
        | {
            Args: {
              new_role: Database["public"]["Enums"]["app_role"]
              new_user_id: string
            }
            Returns: undefined
          }
      authorize: {
        Args: {
          requested_permission: Database["public"]["Enums"]["app_permission"]
        }
        Returns: boolean
      }
      check_user_exists: { Args: { input_email: string }; Returns: boolean }
      create_new_user: {
        Args: { email: string; name: string; password: string; role: string }
        Returns: undefined
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
      get_user_role: { Args: never; Returns: Json }
      insert_user_role_uuid: {
        Args: {
          new_role: Database["public"]["Enums"]["app_role"]
          new_user_id: string
        }
        Returns: undefined
      }
      move_boxes: {
        Args: { p_box_ids: string[]; p_location_id: string; p_note?: string }
        Returns: Json
      }
    }
    Enums: {
      app_permission: "users.create" | "users.edit" | "users.delete"
      app_role: "admin" | "volunteer"
      box_movement_action: "Donated" | "Moved" | "Retired" | "Created" | "Other"
      box_status_enum: "Active" | "Donated" | "Archived"
      gender_enum: "Male" | "Female" | "Unisex" | "Kids"
      icon_name_enum:
        | "Folder"
        | "FolderTree"
        | "Shirt"
        | "ShirtRound"
        | "Watch"
        | "Bath"
        | "PenLine"
        | "CircleDot"
        | "Backpack"
        | "Cloud"
        | "Smile"
      movement_type_enum: "Create" | "Move" | "Donate" | "Archive"
      size_category_enum: "Adult" | "Kid" | "Shoe" | "Other" | "baby"
      size_region_enum: "US" | "EU" | "UK" | "INT"
      user_role: "admin" | "volunteer"
      user_role_enum: "volunteer" | "admin"
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
    Enums: {
      app_permission: ["users.create", "users.edit", "users.delete"],
      app_role: ["admin", "volunteer"],
      box_movement_action: ["Donated", "Moved", "Retired", "Created", "Other"],
      box_status_enum: ["Active", "Donated", "Archived"],
      gender_enum: ["Male", "Female", "Unisex", "Kids"],
      icon_name_enum: [
        "Folder",
        "FolderTree",
        "Shirt",
        "ShirtRound",
        "Watch",
        "Bath",
        "PenLine",
        "CircleDot",
        "Backpack",
        "Cloud",
        "Smile",
      ],
      movement_type_enum: ["Create", "Move", "Donate", "Archive"],
      size_category_enum: ["Adult", "Kid", "Shoe", "Other", "baby"],
      size_region_enum: ["US", "EU", "UK", "INT"],
      user_role: ["admin", "volunteer"],
      user_role_enum: ["volunteer", "admin"],
    },
  },
} as const
