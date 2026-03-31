// File: supabase/functions/ban-user/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: corsHeaders,
    });
  }
  try {
    // 1. Require some Authorization header (admin check handled by your setup)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({
          error: "Missing Authorization header",
        }),
        {
          status: 401,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }
    // 2. Parse body
    const { userId } = await req.json();
    if (!userId) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: userId",
        }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            "Content-Type": "application/json",
          },
        },
      );
    }
    // 3. Admin client
    const supabaseAdmin = createClient(
      Deno.env.get("PROJECT_URL") ?? "",
      Deno.env.get("SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      },
    );
    // 4. Permanent ban timestamp
    const bannedUntil = "2999-12-31T00:00:00.000Z";
    // 5. Update Auth user (ban)
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(
      userId,
      {
        banned_until: bannedUntil,
        app_metadata: {
          banType: "permanent",
          bannedReason: "Manually banned by admin",
        },
      },
    );
    if (error) throw error;
    // 6. Update your local users table: set is_active = false
    const { error: userUpdateError } = await supabaseAdmin
      .from("users")
      .update({
        is_active: false,
      })
      .eq("id", userId);
    if (userUpdateError) throw userUpdateError;
    // 7. Success
    return new Response(
      JSON.stringify({
        message: "User banned successfully",
        user: data.user,
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  } catch (err) {
    return new Response(
      JSON.stringify({
        error: String(err),
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      },
    );
  }
});
