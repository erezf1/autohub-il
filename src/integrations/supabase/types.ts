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
      admin_notifications: {
        Row: {
          assigned_to: string | null
          created_at: string | null
          description: string
          id: string
          is_read: boolean | null
          notification_type: string
          priority: string | null
          read_at: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_read?: boolean | null
          notification_type: string
          priority?: string | null
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_read?: boolean | null
          notification_type?: string
          priority?: string | null
          read_at?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "admin_notifications_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      auction_bids: {
        Row: {
          auction_id: string | null
          bid_amount: number
          bidder_id: string | null
          created_at: string | null
          id: string
          is_automatic: boolean | null
        }
        Insert: {
          auction_id?: string | null
          bid_amount: number
          bidder_id?: string | null
          created_at?: string | null
          id?: string
          is_automatic?: boolean | null
        }
        Update: {
          auction_id?: string | null
          bid_amount?: number
          bidder_id?: string | null
          created_at?: string | null
          id?: string
          is_automatic?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "auction_bids_auction_id_fkey"
            columns: ["auction_id"]
            isOneToOne: false
            referencedRelation: "auctions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auction_bids_bidder_id_fkey"
            columns: ["bidder_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      auctions: {
        Row: {
          auction_end_time: string
          auction_start_time: string | null
          auction_type: string | null
          bid_count: number | null
          buy_now_price: number | null
          created_at: string | null
          creator_id: string | null
          current_highest_bid: number | null
          highest_bidder_id: string | null
          id: string
          reserve_price: number | null
          starting_price: number
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          auction_end_time: string
          auction_start_time?: string | null
          auction_type?: string | null
          bid_count?: number | null
          buy_now_price?: number | null
          created_at?: string | null
          creator_id?: string | null
          current_highest_bid?: number | null
          highest_bidder_id?: string | null
          id?: string
          reserve_price?: number | null
          starting_price: number
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          auction_end_time?: string
          auction_start_time?: string | null
          auction_type?: string | null
          bid_count?: number | null
          buy_now_price?: number | null
          created_at?: string | null
          creator_id?: string | null
          current_highest_bid?: number | null
          highest_bidder_id?: string | null
          id?: string
          reserve_price?: number | null
          starting_price?: number
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "auctions_creator_id_fkey"
            columns: ["creator_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auctions_highest_bidder_id_fkey"
            columns: ["highest_bidder_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "auctions_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          details_revealed_at: string | null
          details_revealed_by: string | null
          id: string
          is_details_revealed: boolean | null
          iso_request_id: string | null
          last_message_at: string | null
          participant_1_id: string | null
          participant_2_id: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          details_revealed_at?: string | null
          details_revealed_by?: string | null
          id?: string
          is_details_revealed?: boolean | null
          iso_request_id?: string | null
          last_message_at?: string | null
          participant_1_id?: string | null
          participant_2_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          details_revealed_at?: string | null
          details_revealed_by?: string | null
          id?: string
          is_details_revealed?: boolean | null
          iso_request_id?: string | null
          last_message_at?: string | null
          participant_1_id?: string | null
          participant_2_id?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_conversations_details_revealed_by_fkey"
            columns: ["details_revealed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_iso_request_id_fkey"
            columns: ["iso_request_id"]
            isOneToOne: false
            referencedRelation: "iso_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_participant_1_id_fkey"
            columns: ["participant_1_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_participant_2_id_fkey"
            columns: ["participant_2_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_conversations_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          conversation_id: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          message_content: string
          message_type: string | null
          read_at: string | null
          sender_id: string | null
        }
        Insert: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
        }
        Update: {
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message_content?: string
          message_type?: string | null
          read_at?: string | null
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      iso_request_offers: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          iso_request_id: string | null
          message: string | null
          offered_price: number
          offerer_id: string | null
          status: string | null
          updated_at: string | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          iso_request_id?: string | null
          message?: string | null
          offered_price: number
          offerer_id?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          iso_request_id?: string | null
          message?: string | null
          offered_price?: number
          offerer_id?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "iso_request_offers_iso_request_id_fkey"
            columns: ["iso_request_id"]
            isOneToOne: false
            referencedRelation: "iso_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iso_request_offers_offerer_id_fkey"
            columns: ["offerer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iso_request_offers_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      iso_requests: {
        Row: {
          additional_requirements: string | null
          created_at: string | null
          description: string | null
          expires_at: string | null
          fuel_type_preference: string | null
          id: string
          location_id: number | null
          make_id: number | null
          max_kilometers: number | null
          model_id: number | null
          price_from: number | null
          price_to: number | null
          requester_id: string | null
          status: string | null
          title: string
          transmission_preference: string | null
          updated_at: string | null
          year_from: number | null
          year_to: number | null
        }
        Insert: {
          additional_requirements?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          fuel_type_preference?: string | null
          id?: string
          location_id?: number | null
          make_id?: number | null
          max_kilometers?: number | null
          model_id?: number | null
          price_from?: number | null
          price_to?: number | null
          requester_id?: string | null
          status?: string | null
          title: string
          transmission_preference?: string | null
          updated_at?: string | null
          year_from?: number | null
          year_to?: number | null
        }
        Update: {
          additional_requirements?: string | null
          created_at?: string | null
          description?: string | null
          expires_at?: string | null
          fuel_type_preference?: string | null
          id?: string
          location_id?: number | null
          make_id?: number | null
          max_kilometers?: number | null
          model_id?: number | null
          price_from?: number | null
          price_to?: number | null
          requester_id?: string | null
          status?: string | null
          title?: string
          transmission_preference?: string | null
          updated_at?: string | null
          year_from?: number | null
          year_to?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "iso_requests_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iso_requests_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iso_requests_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iso_requests_requester_id_fkey"
            columns: ["requester_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      locations: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name_english: string
          name_hebrew: string
          region: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name_english: string
          name_hebrew: string
          region?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name_english?: string
          name_hebrew?: string
          region?: string | null
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          max_vehicles: number
          monthly_auctions: number
          monthly_boosts: number
          name_english: string
          name_hebrew: string
          price_monthly: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          is_active?: boolean | null
          max_vehicles: number
          monthly_auctions: number
          monthly_boosts: number
          name_english: string
          name_hebrew: string
          price_monthly?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          max_vehicles?: number
          monthly_auctions?: number
          monthly_boosts?: number
          name_english?: string
          name_hebrew?: string
          price_monthly?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      support_ticket_messages: {
        Row: {
          created_at: string | null
          id: string
          is_internal: boolean | null
          message_content: string
          sender_id: string | null
          ticket_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message_content: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message_content?: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_ticket_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string | null
          created_at: string | null
          description: string
          id: string
          priority: string | null
          reported_user_id: string | null
          reporter_id: string | null
          resolution_notes: string | null
          resolved_at: string | null
          status: string | null
          subject: string
          ticket_type: string | null
          updated_at: string | null
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description: string
          id?: string
          priority?: string | null
          reported_user_id?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject: string
          ticket_type?: string | null
          updated_at?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          created_at?: string | null
          description?: string
          id?: string
          priority?: string | null
          reported_user_id?: string | null
          reporter_id?: string | null
          resolution_notes?: string | null
          resolved_at?: string | null
          status?: string | null
          subject?: string
          ticket_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "support_tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_reported_user_id_fkey"
            columns: ["reported_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "support_tickets_reporter_id_fkey"
            columns: ["reporter_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          action_url: string | null
          created_at: string | null
          description: string
          id: string
          is_read: boolean | null
          notification_type: string
          read_at: string | null
          recipient_id: string | null
          related_entity_id: string | null
          related_entity_type: string | null
          title: string
        }
        Insert: {
          action_url?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_read?: boolean | null
          notification_type: string
          read_at?: string | null
          recipient_id?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title: string
        }
        Update: {
          action_url?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_read?: boolean | null
          notification_type?: string
          read_at?: string | null
          recipient_id?: string | null
          related_entity_id?: string | null
          related_entity_type?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_notifications_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          available_auctions: number | null
          available_boosts: number | null
          avg_response_time: number | null
          business_description: string | null
          business_name: string
          created_at: string | null
          full_name: string
          id: string
          location_id: number | null
          profile_picture_url: string | null
          rating_tier: string | null
          subscription_type: string | null
          subscription_valid_until: string | null
          tenure: number | null
          trade_license_file_url: string | null
          trade_license_number: string | null
          updated_at: string | null
          vehicles_limit: number | null
        }
        Insert: {
          available_auctions?: number | null
          available_boosts?: number | null
          avg_response_time?: number | null
          business_description?: string | null
          business_name: string
          created_at?: string | null
          full_name: string
          id: string
          location_id?: number | null
          profile_picture_url?: string | null
          rating_tier?: string | null
          subscription_type?: string | null
          subscription_valid_until?: string | null
          tenure?: number | null
          trade_license_file_url?: string | null
          trade_license_number?: string | null
          updated_at?: string | null
          vehicles_limit?: number | null
        }
        Update: {
          available_auctions?: number | null
          available_boosts?: number | null
          avg_response_time?: number | null
          business_description?: string | null
          business_name?: string
          created_at?: string | null
          full_name?: string
          id?: string
          location_id?: number | null
          profile_picture_url?: string | null
          rating_tier?: string | null
          subscription_type?: string | null
          subscription_valid_until?: string | null
          tenure?: number | null
          trade_license_file_url?: string | null
          trade_license_number?: string | null
          updated_at?: string | null
          vehicles_limit?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_profiles_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "locations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          created_at: string | null
          id: string
          phone_number: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          phone_number: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          phone_number?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicle_listing_tags: {
        Row: {
          created_at: string | null
          id: string
          tag_id: number | null
          vehicle_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          tag_id?: number | null
          vehicle_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          tag_id?: number | null
          vehicle_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_listing_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "vehicle_tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_listing_tags_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicle_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_listings: {
        Row: {
          boosted_until: string | null
          color: string | null
          created_at: string | null
          description: string | null
          engine_size: number | null
          fuel_type: string | null
          had_severe_crash: boolean | null
          hot_sale_price: number | null
          id: string
          images: string[] | null
          is_boosted: boolean | null
          kilometers: number | null
          make_id: number | null
          model_id: number | null
          owner_id: string | null
          previous_owners: number | null
          price: number
          status: string | null
          sub_model: string | null
          test_result_file_url: string | null
          transmission: string | null
          updated_at: string | null
          year: number
        }
        Insert: {
          boosted_until?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          engine_size?: number | null
          fuel_type?: string | null
          had_severe_crash?: boolean | null
          hot_sale_price?: number | null
          id?: string
          images?: string[] | null
          is_boosted?: boolean | null
          kilometers?: number | null
          make_id?: number | null
          model_id?: number | null
          owner_id?: string | null
          previous_owners?: number | null
          price: number
          status?: string | null
          sub_model?: string | null
          test_result_file_url?: string | null
          transmission?: string | null
          updated_at?: string | null
          year: number
        }
        Update: {
          boosted_until?: string | null
          color?: string | null
          created_at?: string | null
          description?: string | null
          engine_size?: number | null
          fuel_type?: string | null
          had_severe_crash?: boolean | null
          hot_sale_price?: number | null
          id?: string
          images?: string[] | null
          is_boosted?: boolean | null
          kilometers?: number | null
          make_id?: number | null
          model_id?: number | null
          owner_id?: string | null
          previous_owners?: number | null
          price?: number
          status?: string | null
          sub_model?: string | null
          test_result_file_url?: string | null
          transmission?: string | null
          updated_at?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_listings_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_listings_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "vehicle_models"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_makes: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          name_english: string
          name_hebrew: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name_english: string
          name_hebrew: string
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name_english?: string
          name_hebrew?: string
        }
        Relationships: []
      }
      vehicle_models: {
        Row: {
          created_at: string | null
          id: number
          is_active: boolean | null
          make_id: number | null
          name_english: string
          name_hebrew: string
          vehicle_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          make_id?: number | null
          name_english: string
          name_hebrew: string
          vehicle_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          make_id?: number | null
          name_english?: string
          name_hebrew?: string
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_models_make_id_fkey"
            columns: ["make_id"]
            isOneToOne: false
            referencedRelation: "vehicle_makes"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_tags: {
        Row: {
          color: string | null
          created_at: string | null
          id: number
          is_active: boolean | null
          name_english: string
          name_hebrew: string
          tag_type: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name_english: string
          name_hebrew: string
          tag_type?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          id?: number
          is_active?: boolean | null
          name_english?: string
          name_hebrew?: string
          tag_type?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_boosts: { Args: never; Returns: undefined }
      create_admin_notification: {
        Args: {
          p_assigned_to?: string
          p_description: string
          p_entity_id?: string
          p_entity_type?: string
          p_priority?: string
          p_title: string
          p_type: string
        }
        Returns: string
      }
      create_user_notification: {
        Args: {
          p_action_url?: string
          p_description: string
          p_entity_id?: string
          p_entity_type?: string
          p_recipient_id: string
          p_title: string
          p_type: string
        }
        Returns: string
      }
      get_admin_unread_notifications_count: { Args: never; Returns: number }
      get_remaining_boosts: { Args: { user_id: string }; Returns: number }
      get_user_unread_messages_count: {
        Args: { user_id: string }
        Returns: number
      }
      get_user_unread_notifications_count: {
        Args: { user_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { user_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "dealer" | "admin" | "support"
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
      app_role: ["dealer", "admin", "support"],
    },
  },
} as const
