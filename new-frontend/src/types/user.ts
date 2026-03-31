import { Database } from "./supabase";


export type UserView = Database['public']['Views']['user_view']['Row'];