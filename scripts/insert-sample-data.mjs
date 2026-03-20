// Script para insertar datos de ejemplo en Supabase
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

async function insertData() {
  console.log('📥 Insertando datos de ejemplo en la tabla "vinos"...\n');

  try {
    // Primero verificar si ya hay datos
    const { count } = await supabase.from('vinos').select('*', { count: 'exact' });

    if (count > 0) {
      console.log(`⚠️  Ya existen ${count} vinos en la tabla.`);
      const confirm = 'sí'; // Por defecto continuar
      if (confirm.toLowerCase() !== 'sí' && confirm.toLowerCase() !== 'si' && confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
        console.log('Operación cancelada.');
        process.exit(0);
      }
    }

    // Insertar datos
    const { data, error } = await supabase.from('vinos').insert(sampleWines);

    if (error) {
      console.error('❌ Error al insertar datos:', error.message);
      console.log('\n💡 Verifica que los nombres de columna coincidan exactamente:');
      console.log('   id (opcional), Title, Vintage, Country, Province, Variety, Points, Price, Winery, Designation, County');
      process.exit(1);
    }

    console.log(`✅ Datos insertados exitosamente!`);
    console.log(`   Se añadieron ${sampleWines.length} vinos\n`);

    // Verificar
    const { data: allWines } = await supabase.from('vinos').select('*');
    console.log(`📊 Total de vinos en la tabla: ${allWines.length}`);

  } catch (err) {
    console.error('❌ Error inesperado:', err.message);
    process.exit(1);
  }
}

insertData();
