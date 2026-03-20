import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no configuradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkConnection() {
  console.log('🔍 Verificando conexión a Supabase...');

  try {
    // Verificar que la tabla vinos existe
    const { data: tableInfo, error: tableError } = await supabase
      .from('vinos')
      .select('count');

    if (tableError) {
      console.error('❌ Error al acceder a la tabla "vinos":', tableError.message);
      console.log('\n📋 Posibles causas:');
      console.log('   - La tabla "vinos" no existe');
      console.log('   - Las columnas tienen nombres diferentes');
      console.log('   - Problemas de permisos (RLS)\n');
      process.exit(1);
    }

    console.log('✅ Conexión exitosa a Supabase');

    // Obtener datos
    const { data: wines, error: queryError } = await supabase
      .from('vinos')
      .select('*')
      .limit(5);

    if (queryError) {
      console.error('❌ Error al obtener vinos:', queryError.message);
      process.exit(1);
    }

    console.log(`📊 Total de vinos encontrados: ${wines.length}`);
    console.log('\n📋 Estructura de datos recibida:');

    if (wines.length > 0) {
      console.log(wines[0]);
    } else {
      console.log('⚠️  La tabla está vacía. Añade algunos datos para verlos en la app.');
    }

  } catch (error) {
    console.error('❌ Error inesperado:', error.message);
    process.exit(1);
  }
}

checkConnection();
