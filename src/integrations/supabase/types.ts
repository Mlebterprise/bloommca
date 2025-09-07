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
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      campaign_documents: {
        Row: {
          campaign_version_id: string
          created_at: string
          document_id: string
          id: string
          original_template_id: string | null
          position: number
          status: string
          title: string
        }
        Insert: {
          campaign_version_id: string
          created_at?: string
          document_id: string
          id?: string
          original_template_id?: string | null
          position?: number
          status: string
          title: string
        }
        Update: {
          campaign_version_id?: string
          created_at?: string
          document_id?: string
          id?: string
          original_template_id?: string | null
          position?: number
          status?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaign_documents_campaign_version_id_fkey"
            columns: ["campaign_version_id"]
            isOneToOne: false
            referencedRelation: "campaign_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_documents_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "campaign_documents_original_template_id_fkey"
            columns: ["original_template_id"]
            isOneToOne: false
            referencedRelation: "templates"
            referencedColumns: ["id"]
          },
        ]
      }
      campaign_globals: {
        Row: {
          campaign_id: string
          last_edited_at: string
          placeholder_name: string
          value: string
        }
        Insert: {
          campaign_id: string
          last_edited_at?: string
          placeholder_name: string
          value?: string
        }
        Update: {
          campaign_id?: string
          last_edited_at?: string
          placeholder_name?: string
          value?: string
        }
        Relationships: []
      }
      campaign_versions: {
        Row: {
          campaign_id: string
          created_at: string
          id: string
          is_current: boolean
          label: string | null
          version_number: number
        }
        Insert: {
          campaign_id: string
          created_at?: string
          id?: string
          is_current?: boolean
          label?: string | null
          version_number: number
        }
        Update: {
          campaign_id?: string
          created_at?: string
          id?: string
          is_current?: boolean
          label?: string | null
          version_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "campaign_versions_campaign_id_fkey"
            columns: ["campaign_id"]
            isOneToOne: false
            referencedRelation: "campaigns"
            referencedColumns: ["id"]
          },
        ]
      }
      campaigns: {
        Row: {
          created_at: string
          customer_id: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          customer_id: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          customer_id?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "campaigns_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          created_at: string
          id: string
          name: string
          notes: string | null
          organization: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          organization?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          organization?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          content: string
          created_at: string
          id: string
          name: string
        }
        Insert: {
          content?: string
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      edits: {
        Row: {
          document_id: string
          edited_at: string
          id: number
          new_value: string | null
          placeholder_name: string
          previous_value: string | null
        }
        Insert: {
          document_id: string
          edited_at?: string
          id?: number
          new_value?: string | null
          placeholder_name: string
          previous_value?: string | null
        }
        Update: {
          document_id?: string
          edited_at?: string
          id?: number
          new_value?: string | null
          placeholder_name?: string
          previous_value?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "edits_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      field_values: {
        Row: {
          default_value: string
          document_id: string
          last_edited_at: string
          placeholder_name: string
          value: string
        }
        Insert: {
          default_value?: string
          document_id: string
          last_edited_at?: string
          placeholder_name: string
          value?: string
        }
        Update: {
          default_value?: string
          document_id?: string
          last_edited_at?: string
          placeholder_name?: string
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "field_values_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id: string
          name: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      templates: {
        Row: {
          content: string
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          content?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          id: string
          user_id: string | null
          title: string
          content: string
          mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'excited'
          type: 'gratitude' | 'night' | 'morning' | 'anxiety' | 'custom'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          title: string
          content: string
          mood: 'happy' | 'calm' | 'anxious' | 'sad' | 'excited'
          type: 'gratitude' | 'night' | 'morning' | 'anxiety' | 'custom'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          title?: string
          content?: string
          mood?: 'happy' | 'calm' | 'anxious' | 'sad' | 'excited'
          type?: 'gratitude' | 'night' | 'morning' | 'anxiety' | 'custom'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      wheel_entries: {
        Row: {
          area: string
          created_at: string
          id: string
          month: string
          notes: string | null
          score: number
          updated_at: string
          user_id: string | null
          what_can_be_improved: string | null
          what_went_well: string | null
        }
        Insert: {
          area: string
          created_at?: string
          id?: string
          month: string
          notes?: string | null
          score: number
          updated_at?: string
          user_id?: string | null
          what_can_be_improved?: string | null
          what_went_well?: string | null
        }
        Update: {
          area?: string
          created_at?: string
          id?: string
          month?: string
          notes?: string | null
          score?: number
          updated_at?: string
          user_id?: string | null
          what_can_be_improved?: string | null
          what_went_well?: string | null
        }
        Relationships: []
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
