const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Leer variables de entorno desde .env.local
let supabaseUrl, supabaseKey;
try {
  const envContent = fs.readFileSync('.env.local', 'utf8');
  const lines = envContent.split('\n');
  lines.forEach(line => {
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) {
      supabaseUrl = line.split('=')[1].trim().replace(/["']/g, '');
    }
    if (line.startsWith('NEXT_PUBLIC_SUPABASE_ANON_KEY=')) {
      supabaseKey = line.split('=')[1].trim().replace(/["']/g, '');
    }
  });
} catch (e) {
  console.error('Error leyendo .env.local:', e.message);
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdmin() {
  console.log('🧪 Probando funcionalidad del admin...\n');

  // 1. Obtener un vino aleatorio
  const { data: wines, error: fetchError } = await supabase
    .from('vinos')
    .select('*')
    .limit(1);

  if (fetchError) {
    console.error('❌ Error obteniendo vino:', fetchError);
    return;
  }

  if (!wines || wines.length === 0) {
    console.log('❌ No hay vinos en la base de datos');
    return;
  }

  const wine = wines[0];
  console.log('📦 Vino original:');
  console.log(`   ID: ${wine.Id}`);
  console.log(`   Título: ${wine.Title}`);
  console.log(`   Bodega: ${wine.Winery}`);
  console.log(`   Precio: $${wine.Price}`);
  console.log(`   Puntos: ${wine.Points}\n`);

  // 2. Modificar el vino (cambiar puntos y precio)
  const newPoints = wine.Points ? wine.Points + 1 : 85;
  const newPrice = wine.Price ? wine.Price + 5 : 25;

  console.log('✏️  Modificando vino...');
  const { data: updated, error: updateError } = await supabase
    .from('vinos')
    .update({
      Points: newPoints,
      Price: newPrice
    })
    .eq('Id', wine.Id)
    .select();

  if (updateError) {
    console.error('❌ Error actualizando vino:', updateError);
    return;
  }

  console.log('✅ Vino actualizado:');
  console.log(`   Puntos: ${wine.Points} → ${newPoints}`);
  console.log(`   Precio: $${wine.Price} → $${newPrice}\n`);

  // 3. Verificar los cambios
  const { data: verified, error: verifyError } = await supabase
    .from('vinos')
    .select('*')
    .eq('Id', wine.Id)
    .single();

  if (verifyError) {
    console.error('❌ Error verificando cambios:', verifyError);
    return;
  }

  console.log('🔍 Verificación:');
  console.log(`   Puntos guardados: ${verified.Points}`);
  console.log(`   Precio guardado: $${verified.Price}\n`);

  // 4. Restaurar valores originales
  console.log('🔄 Restaurando valores originales...');
  const { error: restoreError } = await supabase
    .from('vinos')
    .update({
      Points: wine.Points,
      Price: wine.Price
    })
    .eq('Id', wine.Id);

  if (restoreError) {
    console.error('❌ Error restaurando valores:', restoreError);
    return;
  }

  console.log('✅ Valores restaurados correctamente\n');
  console.log('🎉 Test completado exitosamente!');
  console.log('\n📍 Para probar la interfaz visual, abre: http://localhost:3000/admin');
  console.log('🔑 Password: admin123');
}

testAdmin().catch(console.error);
