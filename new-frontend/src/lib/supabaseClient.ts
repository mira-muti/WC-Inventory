import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://qtozlukrkvmcjdfkrstp.supabase.co";
const supabaseAnonKey = "sb_publishable_w9IetqVjk_omGidgYTGWDQ_dj4iw6Zt";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
