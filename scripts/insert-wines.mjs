// Script para insertar datos según la estructura real de la tabla
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

// IMPORTANTE: Todos los valores numéricos como enteros (JavaScript numbers)
// Los campos son bigint en la BD pero JS number funciona para valores dentro del rango seguro
const sampleWines = [
  {
    Id: '1',
    Title: 'Marqués de Murrieta Reserva',
    Vintage: 2018,  // bigint en BD
    Country: 'Spain',
    County: 'Logroño',
    Designation: 'Reserva',
    Points: 92,     // bigint en BD
    Price: 45,      // bigint en BD - precio entero sin decimales
    Province: 'Rioja',
    Variety: 'Tempranillo',
    Winery: 'Marqués de Murrieta'
  },
  {
    Id: '2',
    Title: 'Vega Sicilia Valbuena 5º',
    Vintage: 2016,
    Country: 'Spain',
    County: 'Valbuena de Duero',
    Designation: 'Valbuena 5º',
    Points: 94,
    Price: 180,
    Province: 'Valladolid',
    Variety: 'Tinto Fino, Merlot',
    Winery: 'Vega Sicilia'
  },
  {
    Id: '3',
    Title: 'Château Margaux',
    Vintage: 2015,
    Country: 'France',
    County: 'Margaux',
    Designation: 'Grand Cru Classé',
    Points: 98,
    Price: 850,
    Province: 'Bordeaux',
    Variety: 'Cabernet Sauvignon, Merlot',
    Winery: 'Château Margaux'
  },
  {
    Id: '4',
    Title: 'Barolo Brunate',
    Vintage: 2017,
    Country: 'Italy',
    County: 'Serralunga d\'Alba',
    Designation: 'Barolo DOCG',
    Points: 96,
    Price: 120,
    Province: 'Piedmont',
    Variety: 'Nebbiolo',
    Winery: 'Giacomo Conterno'
  },
  {
    Id: '5',
    Title: 'Opus One',
    Vintage: 2019,
    Country: 'USA',
    County: 'Napa',
    Designation: 'Napa Valley',
    Points: 97,
    Price: 425,
    Province: 'California',
    Variety: 'Cabernet Sauvignon',
    Winery: 'Opus One Winery'
  },
  {
    Id: '6',
    Title: 'Penfolds Grange',
    Vintage: 2018,
    Country: 'Australia',
    County: 'Adelaide',
    Designation: 'Grange Hermitage',
    Points: 99,
    Price: 780,
    Province: 'South Australia',
    Variety: 'Shiraz',
    Winery: 'Penfolds'
  },
  {
    Id: '7',
    Title: 'Domaine de la Romanée-Conti',
    Vintage: 2019,
    Country: 'France',
    County: 'Vosne-Romanée',
    Designation: 'Grand Cru',
    Points: 100,
    Price: 2500,
    Province: 'Burgundy',
    Variety: 'Pinot Noir',
    Winery: 'Domaine de la Romanée-Conti'
  },
  {
    Id: '8',
    Title: 'Screaming Eagle',
    Vintage: 2020,
    Country: 'USA',
    County: 'Oakville',
    Designation: 'Napa Valley',
    Points: 98,
    Price: 3200,
    Province: 'California',
    Variety: 'Cabernet Sauvignon',
    Winery: 'Screaming Eagle Winery'
  },
  {
    Id: '9',
    Title: 'Château d\'Yquem',
    Vintage: 2014,
    Country: 'France',
    County: 'Sauternes',
    Designation: 'Sauternes',
    Points: 100,
    Price: 895,
    Province: 'Bordeaux',
    Variety: 'Sémillon, Sauvignon Blanc',
    Winery: 'Château d\'Yquem'
  },
  {
    Id: '10',
    Title: 'Roman Conti',
    Vintage: 2005,
    Country: 'France',
    County: 'Vosne-Romanée',
    Designation: 'Romanée-Conti Grand Cru',
    Points: 100,
    Price: 4500,
    Province: 'Burgundy',
    Variety: 'Pinot Noir',
    Winery: 'Domaine de la Romanée-Conti'
  }
];

async function insertData() {
  console.log('📥 Insertando vinos (formato bigint)...\n');

  // Primero verificar si ya hay datos
  const { count } = await supabase.from('vinos').select('*', { count: 'exact' });

  if (count > 0) {
    console.log(`⚠️  Ya existen ${count} registros.`);
    console.log('   Vacía tabla primero si quieres renovar los datos.\n');
    return false;
  }

  // Insertar uno por uno
  for (const wine of sampleWines) {
    const { error } = await supabase.from('vinos').insert(wine);
    if (error) {
      console.error(`❌ Error insertando "${wine.Title}":`, error.message);
      console.log('Datos:', JSON.stringify(wine, null, 2));
      if (error.details) console.log('Detalles:', error.details);
      if (error.hint) console.log('Sugerencia:', error.hint);
      return false;
    }
    console.log(`   ✓ ${wine.Title} ($${wine.Price})`);
  }

  console.log(`\n✅ Todos los vinos insertados!\n`);

  // Verificar
  const { data: wines, count: total } = await supabase.from('vinos').select('*', { count: 'exact' });
  console.log(`📊 Total en base de datos: ${total} vinos`);

  return true;
}

await insertData();
