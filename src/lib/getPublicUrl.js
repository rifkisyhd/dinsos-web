import { supabase } from "./supabaseClient";

export const getPublicUrl = (path, bucket = "uploads") => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path);
    return data.publicUrl;
};
