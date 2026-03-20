// Script de diagnóstico detallado
const { createClient } = await import('@supabase/supabase-js');
const fs = await import('fs');
const path = await import('path');

const envPath = path.resolve(process.cwd(), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf-8');

// Parsear variables de entorno
const envVars = {};
envContent.split('\n').forEach(line => {
  const match = line.match(/^(\w+)=(.*)$/);
  if (match) {
    envVars[match[1]] = match[2].replace(/^["']|["']$/g, '');
  }
});

console.log('🔍 DIAGNÓSTICO DE CONEXIÓN A SUPABASE\n');
console.log('Variables de entorno:');
console.log('  NEXT_PUBLIC_SUPABASE_URL:', envVars.NEXT_PUBLIC_SUPABASE_URL);
console.log('  NEXT_PUBLIC_SUPABASE_ANON_KEY:', envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✓ configurada' : '✗ faltante');

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('\n❌ ERROR: Variables de entorno faltantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function diagnose() {
  try {
    // 1. Verificar conexión básica
    console.log('\n1️⃣ Probando conexión básica...');
    const { data: health, error: healthError } = await supabase.from('vinos').select('count');

    if (healthError) {
      console.error('   ❌ Error de conexión:', healthError.message);
      console.error('   Código:', healthError.code);
      console.log('\n💡 Posibles causas:');
      console.log('   - RLS (Row Level Security) bloqueando el acceso');
      console.log('   - Tabla no existe o nombre incorrecto');
      console.log('   - Permisos insuficientes');
      return;
    }

    console.log('   ✅ Conexión exitosa');

    // 2. Contar registros
    console.log('\n2️⃣ Contando registros...');
    const { count, error: countError } = await supabase
      .from('vinos')
      .select('*', { count: 'exact', head: true });

    if (countError) {
      console.error('   ❌ Error al contar:', countError.message);
      return;
    }

    console.log(`   📊 Total de registros: ${count || 0}`);

    // 3. Si hay registros, mostrar uno
    if (count && count > 0) {
      console.log('\n3️⃣ Primer registro:');
      const { data: first, error: fetchError } = await supabase
        .from('vinos')
        .select('*')
        .limit(1);

      if (fetchError) {
        console.error('   ❌ Error al obtener datos:', fetchError.message);
      } else if (first && first.length > 0) {
        console.log('   ✅ Registro encontrado:');
        console.log('   ', JSON.stringify(first[0], null, 2));

        // Verificar tipos de datos
        console.log('\n4️⃣ Tipos de datos del registro:');
        Object.entries(first[0]).forEach(([key, value]) => {
          console.log(`   ${key}: ${typeof value} = ${JSON.stringify(value)}`);
        });
      }
    } else {
      console.log('\n⚠️  La tabla parece estar vacía desde la perspectiva de esta consulta');

      // 4. Verificar si hay problemas de RLS
      console.log('\n5️⃣ Verificando Row Level Security...');
      console.log('   ⚠️  Si RLS está habilitado y no hay políticas, las consultas pueden fallar silenciosamente');
      console.log('   Ve a Supabase → Table Editor → vinos → Policies');
      console.log('   Deshabilita RLS o crea una política:');
      console.log('   ```sql');
      console.log('   CREATE POLICY "Allow public select" ON vinos');
      console.log('   FOR SELECT USING (true);');
      console.log('   ```');
    }

  } catch (err) {
    console.error('\n❌ Error inesperado:', err);
  }
}

await diagnose();
