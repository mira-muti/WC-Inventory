// supabase/functions/delete-user/index.ts
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // 1) Require auth header (same check level as your create-user)
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "No authorization header" }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 2) Parse input
    const { userId } = await req.json();
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "Missing required field: userId" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 3) Admin client (same env names you used)
    const supabaseAdmin = createClient(
      Deno.env.get("PROJECT_URL") || "",
      Deno.env.get("SERVICE_ROLE_KEY") || "",
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      },
    );

    // 4) Delete from Auth (primary source of truth)
    const { error: delAuthErr } =
      await supabaseAdmin.auth.admin.deleteUser(userId);
    if (delAuthErr) {
      return new Response(JSON.stringify({ error: delAuthErr.message }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 5) Optional: delete app row (safe even if ON DELETE CASCADE already removed it)
    //    If you have ON DELETE CASCADE on public.users(id -> auth.users.id),
    //    this will be a no-op and return 0 rows affected, which is fine.
    const { error: delAppErr } = await supabaseAdmin
      .from("users")
      .delete()
      .eq("id", userId);

    if (delAppErr) {
      // Not fatal, since the Auth delete already happened; include info for debugging.
      console.warn("users delete error:", delAppErr.message);
    }

    return new Response(
      JSON.stringify({
        ok: true,
        message: "User deleted successfully",
        userId,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    return new Response(JSON.stringify({ error: `${error}` }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
