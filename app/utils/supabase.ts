import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Configuración de Supabase:');
console.log('- URL configurada:', !!supabaseUrl);
console.log('- Clave anónima configurada:', !!supabaseAnonKey);

let supabase: SupabaseClient | null = null;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false
    }
  });
} else {
  console.warn('Advertencia: Variables de entorno de Supabase no configuradas. El cliente no se inicializará.');
}

export { supabase }; 