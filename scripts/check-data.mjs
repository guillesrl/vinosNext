// Script para verificar datos en Supabase ejecutado desde Node
const { createClient } = await import('@supabase/supabase-js');

// Leer variables de entorno del archivo .env.local
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

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Variables de entorno no encontradas');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkData() {
  console.log('🔍 Verificando datos en Supabase...\n');

  try {
    const { data, error, count } = await supabase
      .from('vinos')
      .select('*', { count: 'exact' });

    if (error) {
      console.error('❌ Error:', error.message);
      console.log('\n💡 Asegúrate de:');
      console.log('   1. Que la tabla "vinos" existe en Supabase');
      console.log('   2. Que la tabla tiene las columnas correctas:');
      console.log('      Id, Title, Vintage, Country, Province, Variety, Points, Price, Winery, Designation, County');
      process.exit(1);
    }

    console.log(`✅ Conexión exitosa!`);
    console.log(`📊 Total de vinos en la base: ${count}\n`);

    if (data && data.length > 0) {
      console.log('📋 Primer vino registrado:');
      console.log(JSON.stringify(data[0], null, 2));
    } else {
      console.log('⚠️  La tabla está vacía.');
      console.log('💡 Ve a Supabase → Table Editor → vinos y añade algunos vinos.');
    }

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    process.exit(1);
  }
}

await checkData();
