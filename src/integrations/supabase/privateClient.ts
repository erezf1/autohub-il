import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://saryeqatvnojibayzxxu.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNhcnllcWF0dm5vamliYXl6eHh1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0NjU1NDMsImV4cCI6MjA3NTA0MTU0M30.3W7YoV_m-1s_seAvipnMk86-IuVwjToyH-zrIALhF0w";

/**
 * Separate Supabase client for Private Users
 * Uses different storage key to prevent session conflicts with dealer auth
 */
export const privateClient = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== 'undefined' ? window.localStorage : undefined,
      storageKey: 'private-auth', // Separate storage key for private users
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  }
);
