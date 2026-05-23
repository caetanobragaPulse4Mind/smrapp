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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      adicionais_condicionais: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adicionais_condicionais_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      adicional_noturno: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "adicional_noturno_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          acao: string
          id: string
          processo_id: string
          secao: string | null
          timestamp: string
          usuario: string | null
        }
        Insert: {
          acao: string
          id?: string
          processo_id: string
          secao?: string | null
          timestamp?: string
          usuario?: string | null
        }
        Update: {
          acao?: string
          id?: string
          processo_id?: string
          secao?: string | null
          timestamp?: string
          usuario?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: false
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      base: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "base_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      danos: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "danos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      deducoes: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "deducoes_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      devolucao_descontos: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "devolucao_descontos_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      dif_salariais: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "dif_salariais_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      honorarios: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "honorarios_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      horas_extras: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "horas_extras_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      horas_intervalares: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "horas_intervalares_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      jornada_arbitrada: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jornada_arbitrada_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      jornada_mista: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "jornada_mista_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      multa_convencional: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "multa_convencional_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      pensao_vitalicia: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pensao_vitalicia_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      plr: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "plr_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      processos: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          numero: string | null
          reclamada: string | null
          reclamante: string | null
          responsavel: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          numero?: string | null
          reclamada?: string | null
          reclamante?: string | null
          responsavel?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          numero?: string | null
          reclamada?: string | null
          reclamante?: string | null
          responsavel?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      reintegracao: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reintegracao_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      vales: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vales_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
      }
      verbas_rescisorias: {
        Row: {
          dados: Json
          id: string
          processo_id: string
          updated_at: string
        }
        Insert: {
          dados?: Json
          id?: string
          processo_id: string
          updated_at?: string
        }
        Update: {
          dados?: Json
          id?: string
          processo_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "verbas_rescisorias_processo_id_fkey"
            columns: ["processo_id"]
            isOneToOne: true
            referencedRelation: "processos"
            referencedColumns: ["id"]
          },
        ]
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
