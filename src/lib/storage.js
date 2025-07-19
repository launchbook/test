// lib/storage.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function uploadToSupabase(filename, buffer) {
  const path = `exports/${Date.now()}-${filename}`;
  const { error } = await supabase.storage.from('ebooks').upload(path, buffer, {
    contentType: 'application/pdf',
    upsert: true,
  });

  if (error) throw new Error('Upload failed: ' + error.message);

  const { data } = supabase.storage.from('ebooks').getPublicUrl(path);
  return data.publicUrl;
}
