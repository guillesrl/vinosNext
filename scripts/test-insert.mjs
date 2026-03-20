// Script para insertar datos usando SQL directo
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

// Datos como valores individuales
const wine = {
  Title: 'Marqués de Murrieta Reserva',
  Vintage: 2018,
  Country: 'Spain',
  Province: 'Rioja',
  Variety: 'Tempranillo',
  Points: 92,
  Price: 45,  // Entero en lugar de decimal
  Winery: 'Marqués de Murrieta',
  Designation: 'Reserva',
  County: 'Logroño'
};

async function testInsert() {
  console.log('Probando inserción de UN solo vino...\n');
  console.log('Datos a insertar:', JSON.stringify(wine, null, 2));

  try {
    // Intentar insertar sin especificar Id (que es autoincremental)
    const { data, error } = await supabase
      .from('vinos')
      .insert(wine)
      .select();

    if (error) {
      console.error('\n❌ Error detallado:', JSON.stringify(error, null, 2));

      if (error.details) {
        console.log('\n🔍 Detalles adicionales:', error.details);
      }
      if (error.hint) {
        console.log('💡 Sugerencia:', error.hint);
      }
    } else {
      console.log('\n✅ Inserción exitosa!');
      console.log('Vino insertado:', JSON.stringify(data, null, 2));
    }

  } catch (err) {
    console.error('❌ Error inesperado:', err);
  }
}

await testInsert();
