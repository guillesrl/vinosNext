// Script para ver la estructura de la tabla vinos
const { createClient } = await import('@supabase/supabase-js');
const fs = await import('fs');
const path = await import('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^(\w+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function describeTable() {
  console.log('🔍 Verificando estructura de la tabla "vinos"...\n');

  // Intentar obtener un registro para ver los campos
  const { data, error } = await supabase
    .from('vinos')
    .select('*')
    .limit(1);

  if (error) {
    console.error('❌ Error:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('\n⚠️  La tabla "vinos" no existe en tu base de datos.');
      console.log('💡 Debes crearla primero con las siguientes columnas:');
      console.log('   Id (integer, primary key)');
      console.log('   Title (text)');
      console.log('   Vintage (integer)');
      console.log('   Country (text)');
      console.log('   Province (text)');
      console.log('   Variety (text)');
      console.log('   Points (integer)');
      console.log('   Price (decimal/float8)');
      console.log('   Winery (text)');
      console.log('   Designation (text, nullable)');
      console.log('   County (text, nullable)');
    }
    process.exit(1);
  }

  console.log('✅ Tabla encontrada!\n');
  console.log('📋 Columnas detectadas:');

  if (data && data.length > 0) {
    Object.keys(data[0]).forEach(key => {
      const value = data[0][key];
      const type = typeof value;
      console.log(`   ${key}: ${type} (ejemplo: ${value})`);
    });
  } else {
    // Si no hay datos, necesitamos consultar la información de la tabla
    console.log('   (La tabla está vacía, ejecuta este SQL en Supabase para ver la estructura:)');
    console.log('   SELECT column_name, data_type FROM information_schema.columns WHERE table_name = \'vinos\' ORDER BY ordinal_position;');
  }
}

await describeTable();
