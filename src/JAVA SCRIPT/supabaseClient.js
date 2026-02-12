

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

export const SUPABASE_URL = "https://pigdklnidxdfymmmdcnm.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_WCYBdxfLLV23MvKyR5CgBw_uALbfpug";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
