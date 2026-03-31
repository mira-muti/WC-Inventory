import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import CryptoJS from "https://esm.sh/crypto-js@4.2.0";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email, password, role, name } = await req.json();

    if (!email || !password || !role) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

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

    // this isnt checking auth only if header is present it seems
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      throw new Error("No authorization header");
    }

    // Decrpytion Step
    const decryptedPassword = CryptoJS.AES.decrypt(
      password,
      Deno.env.get("ENCRYPTION_KEY"), // same key used on the client
    ).toString(CryptoJS.enc.Utf8);

    console.log("Decryption attempt completed");
    console.log("Decrypted password length:", decryptedPassword.length);

    if (!decryptedPassword) {
      return new Response(
        JSON.stringify({ error: "Password decryption failed" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // 4) Create the user in Supabase Auth
    const { data: userData, error: createUserError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password: decryptedPassword,
        email_confirm: true, // skip sending the confirmation email, or set to false if you want them to confirm
        user_metadata: { name, role },
      });

    if (createUserError) {
      throw createUserError;
    }

    const { error: userError } = await supabaseAdmin.from("users").insert([
      {
        id: userData.user.id,
        name,
        role,
      },
    ]);

    if (userError) {
      throw userError;
    }

    return new Response(
      JSON.stringify({
        user: userData.user,
        message: "User created successfully",
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
