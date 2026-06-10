import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Classification = {
  id: string;
  user_id: string;
  image_url: string;
  predictions: Array<{ className: string; probability: number }>;
  top_prediction: string;
  confidence: number;
  created_at: string;
};
