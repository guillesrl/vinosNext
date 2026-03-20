// Script completo: deshabilitar RLS, vaciar tabla e insertar datos de ejemplo
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

// Usamos el cliente de admin (necesita service_role key, pero no la tenemos)
// En su lugar, vamos a deshabilitar RLS usando SQL directo con anon key si es posible
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function setupDatabase() {
  console.log('🔧 Configurando base de datos...\n');

  // 1. Verificar si RLS está habilitado
  console.log('1️⃣ Verificando estado de RLS...');
  const { data: rlsStatus, error: rlsError } = await supabase.rpc('pg_catalog.pg_tables_is_visible');

  // Como no podemos ejecutar RPCs administrativas con la clave anónima,
  // vamos a intentar insertar datos deshabilitando temporalmente las políticas
  // Insertaremos datos directamente saltando políticas usando el endpoint REST

  // 2. Intentar deshabilitar RLS (requiere privilegios de admin)
  console.log('\n2️⃣ Intentando deshabilitar Row Level Security...');
  const { error: disableError } = await supabase
    .rpc('exec_sql', { query: 'ALTER TABLE vinos DISABLE ROW LEVEL SECURITY;' });

  if (disableError) {
    console.log('⚠️  No se pudo deshabilitar RLS automáticamente.');
    console.log('   Necesitas hacerlo manualmente en Supabase:\n');
    console.log('   Ve a Supabase → SQL Editor y ejecuta:');
    console.log('   ```sql');
    console.log('   ALTER TABLE vinos DISABLE ROW LEVEL SECURITY;');
    console.log('   ```\n');
    return false;
  } else {
    console.log('✅ RLS deshabilitado\n');
  }

  // 3. Vaciar tabla
  console.log('3️⃣ Vacando tabla existente...');
  const { error: deleteError } = await supabase
    .from('vinos')
    .delete()
    .neq('Id', 0);  // Borrar todos los registros

  if (deleteError) {
    console.error('❌ Error al vaciar:', deleteError.message);
    return false;
  }
  console.log('✅ Tabla vaciada\n');

  // 4. Insertar datos
  console.log('4️⃣ Insertando datos de ejemplo...\n');

  const sampleWines = [
    {
      Title: 'Marqués de Murrieta Reserva',
      Vintage: 2018,
      Country: 'Spain',
      Province: 'Rioja',
      Variety: 'Tempranillo',
      Points: 92,
      Price: 45.99,
      Winery: 'Marqués de Murrieta',
      Designation: 'Reserva',
      County: 'Logroño'
    },
    {
      Title: 'Vega Sicilia Valbuena 5º',
      Vintage: 2016,
      Country: 'Spain',
      Province: 'Valladolid',
      Variety: 'Tinto Fino, Merlot',
      Points: 94,
      Price: 180.00,
      Winery: 'Vega Sicilia',
      Designation: 'Valbuena 5º',
      County: 'Valbuena de Duero'
    },
    {
      Title: 'Château Margaux',
      Vintage: 2015,
      Country: 'France',
      Province: 'Bordeaux',
      Variety: 'Cabernet Sauvignon, Merlot',
      Points: 98,
      Price: 850.00,
      Winery: 'Château Margaux',
      Designation: 'Grand Cru Classé',
      County: 'Margaux'
    },
    {
      Title: 'Barolo Brunate',
      Vintage: 2017,
      Country: 'Italy',
      Province: 'Piedmont',
      Variety: 'Nebbiolo',
      Points: 96,
      Price: 120.50,
      Winery: 'Giacomo Conterno',
      Designation: 'Barolo DOCG',
      County: 'Serralunga d\'Alba'
    },
    {
      Title: 'Opus One',
      Vintage: 2019,
      Country: 'USA',
      Province: 'California',
      Variety: 'Cabernet Sauvignon',
      Points: 97,
      Price: 425.00,
      Winery: 'Opus One Winery',
      Designation: 'Napa Valley',
      County: 'Napa'
    },
    {
      Title: 'Penfolds Grange',
      Vintage: 2018,
      Country: 'Australia',
      Province: 'South Australia',
      Variety: 'Shiraz',
      Points: 99,
      Price: 780.00,
      Winery: 'Penfolds',
      Designation: 'Grange Hermitage',
      County: 'Adelaide'
    },
    {
      Title: 'Domaine de la Romanée-Conti',
      Vintage: 2019,
      Country: 'France',
      Province: 'Burgundy',
      Variety: 'Pinot Noir',
      Points: 100,
      Price: 2500.00,
      Winery: 'Domaine de la Romanée-Conti',
      Designation: 'Grand Cru',
      County: 'Vosne-Romanée'
    },
    {
      Title: 'Screaming Eagle',
      Vintage: 2020,
      Country: 'USA',
      Province: 'California',
      Variety: 'Cabernet Sauvignon',
      Points: 98,
      Price: 3200.00,
      Winery: 'Screaming Eagle Winery',
      Designation: 'Napa Valley',
      County: 'Oakville'
    },
    {
      Title: 'Château d\'Yquem',
      Vintage: 2014,
      Country: 'France',
      Province: 'Bordeaux',
      Variety: 'Sémillon, Sauvignon Blanc',
      Points: 100,
      Price: 895.00,
      Winery: 'Château d\'Yquem',
      Designation: 'Sauternes',
      County: 'Sauternes'
    },
    {
      Title: 'Roman Conti',
      Vintage: 2005,
      Country: 'France',
      Province: 'Burgundy',
      Variety: 'Pinot Noir',
      Points: 100,
      Price: 4500.00,
      Winery: 'Domaine de la Romanée-Conti',
      Designation: 'Romanée-Conti Grand Cru',
      County: 'Vosne-Romanée'
    }
  ];

  let inserted = 0;
  for (const wine of sampleWines) {
    const { error } = await supabase.from('vinos').insert(wine);
    if (error) {
      console.error(`❌ Error insertando "${wine.Title}":`, error.message);
      console.log('Detalles:', JSON.stringify(error, null, 2));
      return false;
    }
    inserted++;
    console.log(`   ✓ ${wine.Title} (${wine.Vintage})`);
  }

  console.log(`\n✅ ${inserted} vinos insertados exitosamente!\n`);

  // 5. Verificar
  console.log('5️⃣ Verificando...');
  const { data: wines, error: countError } = await supabase
    .from('vinos')
    .select('*');

  if (countError) {
    console.error('❌ Error verificando:', countError.message);
    return false;
  }

  console.log(`📊 Total de vinos en la base: ${wines.length}\n`);

  return true;
}

await setupDatabase().then(success => {
  process.exit(success ? 0 : 1);
});
