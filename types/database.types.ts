export type Role = 'composer' | 'producer' | 'admin'
export type ComposerStatus = 'pending' | 'active' | 'rejected'
export type BriefStatus = 'draft' | 'active' | 'matched' | 'closed'
export type SubmissionStatus = 'pending' | 'shortlisted' | 'accepted' | 'rejected'
export type PlacementStatus = 'pending' | 'confirmed' | 'paid'
export type OutreachStatus = 'invited' | 'accepted' | 'declined'
export type TaskStatus = 'open' | 'in_progress' | 'done'

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: Role
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role: Role
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: Role
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      composers: {
        Row: {
          id: string
          profile_id: string
          bio: string | null
          genres: string[] | null
          portfolio_url: string | null
          status: ComposerStatus
          ai_score: number | null
          ai_tags: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          bio?: string | null
          genres?: string[] | null
          portfolio_url?: string | null
          status?: ComposerStatus
          ai_score?: number | null
          ai_tags?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          bio?: string | null
          genres?: string[] | null
          portfolio_url?: string | null
          status?: ComposerStatus
          ai_score?: number | null
          ai_tags?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'composers_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      producers: {
        Row: {
          id: string
          profile_id: string
          company: string | null
          website: string | null
          profile_complete: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          company?: string | null
          website?: string | null
          profile_complete?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          company?: string | null
          website?: string | null
          profile_complete?: boolean
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'producers_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: true
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          }
        ]
      }
      genres: {
        Row: { id: string; name: string }
        Insert: { id?: string; name: string }
        Update: { name?: string }
        Relationships: []
      }
      communities: {
        Row: { id: string; name: string }
        Insert: { id?: string; name: string }
        Update: { name?: string }
        Relationships: []
      }
      briefs: {
        Row: {
          id: string
          producer_id: string
          title: string
          description: string | null
          genres: string[] | null
          budget_min: number | null
          budget_max: number | null
          deadline: string | null
          status: BriefStatus
          ai_suggested_composers: string[] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          producer_id: string
          title: string
          description?: string | null
          genres?: string[] | null
          budget_min?: number | null
          budget_max?: number | null
          deadline?: string | null
          status?: BriefStatus
          ai_suggested_composers?: string[] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          genres?: string[] | null
          budget_min?: number | null
          budget_max?: number | null
          deadline?: string | null
          status?: BriefStatus
          ai_suggested_composers?: string[] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'briefs_producer_id_fkey'
            columns: ['producer_id']
            isOneToOne: false
            referencedRelation: 'producers'
            referencedColumns: ['id']
          }
        ]
      }
      submissions: {
        Row: {
          id: string
          brief_id: string
          composer_id: string
          track_url: string
          notes: string | null
          status: SubmissionStatus
          ai_match_score: number | null
          ai_match_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          brief_id: string
          composer_id: string
          track_url: string
          notes?: string | null
          status?: SubmissionStatus
          ai_match_score?: number | null
          ai_match_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          track_url?: string
          notes?: string | null
          status?: SubmissionStatus
          ai_match_score?: number | null
          ai_match_reason?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'submissions_brief_id_fkey'
            columns: ['brief_id']
            isOneToOne: false
            referencedRelation: 'briefs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'submissions_composer_id_fkey'
            columns: ['composer_id']
            isOneToOne: false
            referencedRelation: 'composers'
            referencedColumns: ['id']
          }
        ]
      }
      placements: {
        Row: {
          id: string
          submission_id: string
          fee: number
          commission: number
          status: PlacementStatus
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          submission_id: string
          fee: number
          commission: number
          status?: PlacementStatus
          created_at?: string
          updated_at?: string
        }
        Update: {
          fee?: number
          commission?: number
          status?: PlacementStatus
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'placements_submission_id_fkey'
            columns: ['submission_id']
            isOneToOne: false
            referencedRelation: 'submissions'
            referencedColumns: ['id']
          }
        ]
      }
      outreach: {
        Row: {
          id: string
          brief_id: string
          composer_id: string
          status: OutreachStatus
          sent_at: string
          responded_at: string | null
        }
        Insert: {
          id?: string
          brief_id: string
          composer_id: string
          status?: OutreachStatus
          sent_at?: string
          responded_at?: string | null
        }
        Update: {
          status?: OutreachStatus
          responded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'outreach_brief_id_fkey'
            columns: ['brief_id']
            isOneToOne: false
            referencedRelation: 'briefs'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'outreach_composer_id_fkey'
            columns: ['composer_id']
            isOneToOne: false
            referencedRelation: 'composers'
            referencedColumns: ['id']
          }
        ]
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          assigned_to: string | null
          related_entity: string | null
          related_id: string | null
          status: TaskStatus
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          assigned_to?: string | null
          related_entity?: string | null
          related_id?: string | null
          status?: TaskStatus
          due_date?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          assigned_to?: string | null
          related_entity?: string | null
          related_id?: string | null
          status?: TaskStatus
          due_date?: string | null
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      role: Role
      composer_status: ComposerStatus
      brief_status: BriefStatus
      submission_status: SubmissionStatus
      placement_status: PlacementStatus
      outreach_status: OutreachStatus
      task_status: TaskStatus
    }
  }
}
