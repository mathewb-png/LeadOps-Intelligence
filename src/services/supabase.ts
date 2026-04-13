import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client configuration.
 *
 * Replace these with your project credentials:
 *   1. Go to https://supabase.com/dashboard → your project → Settings → API
 *   2. Copy the URL and anon/public key
 *   3. Set them as environment variables:
 *        VITE_SUPABASE_URL=https://your-project.supabase.co
 *        VITE_SUPABASE_ANON_KEY=your-anon-key
 *
 * Required tables (run in Supabase SQL Editor):
 *
 *   CREATE TABLE leads (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     name TEXT NOT NULL,
 *     company TEXT NOT NULL,
 *     job_title TEXT NOT NULL,
 *     email TEXT,
 *     phone TEXT,
 *     industry TEXT,
 *     location TEXT,
 *     employee_count TEXT,
 *     richard_score INTEGER DEFAULT 0,
 *     tier TEXT DEFAULT 'irrelevant',
 *     source TEXT DEFAULT 'manual',
 *     campaign_id TEXT,
 *     excluded BOOLEAN DEFAULT FALSE,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 *
 *   CREATE TABLE permanent_exclusions (
 *     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
 *     word TEXT NOT NULL UNIQUE,
 *     frequency INTEGER DEFAULT 1,
 *     source_titles TEXT[],
 *     active BOOLEAN DEFAULT TRUE,
 *     created_at TIMESTAMPTZ DEFAULT NOW()
 *   );
 */

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://placeholder.supabase.co";
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const isSupabaseConfigured =
  supabaseUrl !== "https://placeholder.supabase.co" && supabaseAnonKey !== "placeholder-key";
