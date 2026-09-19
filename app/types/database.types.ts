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
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
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
      event_grading_criteria: {
        Row: {
          created_at: string
          event_id: string | null
          id: string
          name: string | null
          short_description: string | null
        }
        Insert: {
          created_at?: string
          event_id?: string | null
          id?: string
          name?: string | null
          short_description?: string | null
        }
        Update: {
          created_at?: string
          event_id?: string | null
          id?: string
          name?: string | null
          short_description?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_grading_criteria_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          content: Json | null
          created_at: string
          end_date: string | null
          id: string
          location: string | null
          max_score: number | null
          member_per_groups: number | null
          organized_date: string | null
          poster_path: string | null
          short_description: string | null
          start_date: string | null
          status: Database["public"]["Enums"]["EVENT_STATUS"] | null
          title: string | null
        }
        Insert: {
          content?: Json | null
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          max_score?: number | null
          member_per_groups?: number | null
          organized_date?: string | null
          poster_path?: string | null
          short_description?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["EVENT_STATUS"] | null
          title?: string | null
        }
        Update: {
          content?: Json | null
          created_at?: string
          end_date?: string | null
          id?: string
          location?: string | null
          max_score?: number | null
          member_per_groups?: number | null
          organized_date?: string | null
          poster_path?: string | null
          short_description?: string | null
          start_date?: string | null
          status?: Database["public"]["Enums"]["EVENT_STATUS"] | null
          title?: string | null
        }
        Relationships: []
      }
      group_feedbacks: {
        Row: {
          created_at: string
          description: string | null
          display_name: string | null
          group_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_name?: string | null
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          display_name?: string | null
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_feedbacks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_final_scores"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "group_feedbacks_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_feedbacks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          created_at: string
          group_id: string | null
          id: string
          member_email: string | null
          member_name: string | null
        }
        Insert: {
          created_at?: string
          group_id?: string | null
          id?: string
          member_email?: string | null
          member_name?: string | null
        }
        Update: {
          created_at?: string
          group_id?: string | null
          id?: string
          member_email?: string | null
          member_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_final_scores"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          avatar_url: string | null
          created_at: string
          event_id: string | null
          group_name: string | null
          id: string
          short_description: string | null
          youtube_link: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          event_id?: string | null
          group_name?: string | null
          id?: string
          short_description?: string | null
          youtube_link?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          event_id?: string | null
          group_name?: string | null
          id?: string
          short_description?: string | null
          youtube_link?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          company_name: string | null
          company_unit: string | null
          created_at: string | null
          degree: string | null
          description: string | null
          email: string | null
          full_name: string | null
          github: string | null
          id: string
          job_title: string | null
          linkedIn: string | null
          programme: string | null
          role: Database["public"]["Enums"]["PROFILE_ROLE"] | null
          university: string | null
          year: string | null
        }
        Insert: {
          avatar_url?: string | null
          company_name?: string | null
          company_unit?: string | null
          created_at?: string | null
          degree?: string | null
          description?: string | null
          email?: string | null
          full_name?: string | null
          github?: string | null
          id: string
          job_title?: string | null
          linkedIn?: string | null
          programme?: string | null
          role?: Database["public"]["Enums"]["PROFILE_ROLE"] | null
          university?: string | null
          year?: string | null
        }
        Update: {
          avatar_url?: string | null
          company_name?: string | null
          company_unit?: string | null
          created_at?: string | null
          degree?: string | null
          description?: string | null
          email?: string | null
          full_name?: string | null
          github?: string | null
          id?: string
          job_title?: string | null
          linkedIn?: string | null
          programme?: string | null
          role?: Database["public"]["Enums"]["PROFILE_ROLE"] | null
          university?: string | null
          year?: string | null
        }
        Relationships: []
      }
      user_group_grading: {
        Row: {
          created_at: string
          criteria_id: string | null
          grade: number | null
          group_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string
          criteria_id?: string | null
          grade?: number | null
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string
          criteria_id?: string | null
          grade?: number | null
          group_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_group_grading_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "event_grading_criteria"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_group_grading_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "group_criteria_cells"
            referencedColumns: ["criteria_id"]
          },
          {
            foreignKeyName: "user_group_grading_criteria_id_fkey"
            columns: ["criteria_id"]
            isOneToOne: false
            referencedRelation: "group_criteria_user_grades"
            referencedColumns: ["criteria_id"]
          },
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_final_scores"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_group_grading_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      group_criteria_cells: {
        Row: {
          avg_score: number | null
          criteria_id: string | null
          criteria_name: string | null
          graders: Json | null
          group_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_final_scores"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_criteria_user_grades: {
        Row: {
          criteria_id: string | null
          criteria_name: string | null
          grade: number | null
          group_id: string | null
          user_id: string | null
          user_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_final_scores"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_group_grading_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_final_cell: {
        Row: {
          final_avg_score: number | null
          group_id: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_final_scores"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_final_scores: {
        Row: {
          criteria: Json | null
          event_id: string | null
          final_avg_score: number | null
          group_id: string | null
          group_name: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      group_user_final_points: {
        Row: {
          group_id: string | null
          user_id: string | null
          user_name: string | null
          user_total: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "group_final_scores"
            referencedColumns: ["group_id"]
          },
          {
            foreignKeyName: "user_group_grading_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_group_grading_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin_or_judge: { Args: never; Returns: boolean }
    }
    Enums: {
      EVENT_STATUS: "ongoing" | "finished"
      INVITATION_STATUS: "pending" | "accepted" | "rejected"
      PROFILE_ROLE: "admin" | "judge" | "student"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      EVENT_STATUS: ["ongoing", "finished"],
      INVITATION_STATUS: ["pending", "accepted", "rejected"],
      PROFILE_ROLE: ["admin", "judge", "student"],
    },
  },
} as const

