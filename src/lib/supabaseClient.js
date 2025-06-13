// lib/supabaseClient.js
// import { createClient } from "@supabase/supabase-js";

import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";

// export const supabase = createClient(
//     process.env.NEXT_PUBLIC_SUPABASE_URL,
//     process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
// );

export const supabase = createBrowserSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);
