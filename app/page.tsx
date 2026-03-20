import WineList from './components/WineList';
import { supabase } from './utils/supabase';

async function getWines() {
  console.log('Intentando obtener vinos de Supabase...');

  if (!supabase) {
    console.error('Error: Cliente de Supabase no inicializado. Variables de entorno faltantes.');
    return [];
  }

  try {
    console.log('URL de Supabase:', process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log('Clave anónima presente:', !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    
    const { data, error } = await supabase
      .from('vinos')
      .select('*');

    if (error) {
      console.error('Error detallado al obtener vinos:', {
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      return [];
    }

    if (data && data.length > 0) {
      console.log('Estructura del primer vino:', {
        camposDisponibles: Object.keys(data[0]),
        ejemplo: data[0]
      });

      // Mapear los datos al formato esperado
      const winesMapped = data.map(wine => ({
        id: wine.Id?.toString(),
        title: wine.Title,
        name: wine.Title,
        vintage: wine.Vintage,
        country: wine.Country,
        county: wine.County,
        designation: wine.Designation,
        points: wine.Points,
        price: wine.Price,
        province: wine.Province,
        variety: wine.Variety,
        winery: wine.Winery
      }));

      console.log('Estructura después del mapeo:', {
        camposDisponibles: Object.keys(winesMapped[0]),
        ejemplo: winesMapped[0]
      });

      return winesMapped;
    }
    
    return [];
  } catch (error) {
    console.error('Error inesperado al obtener vinos:', error);
    return [];
  }
}

export default async function Home() {
  const wines = await getWines();
  
  if (!wines || wines.length === 0) {
    console.log('No se encontraron vinos en la base de datos');
  } else {
    console.log(`Se encontraron ${wines.length} vinos`);
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-wine-darker via-wine-dark to-wine-light">
      <div className="py-16 px-4">
        <h1 className="text-5xl font-bold text-center mb-12 text-cork-100">
          Nuestra Colección de Vinos
        </h1>
        <WineList initialWines={wines} />
      </div>
    </main>
  );
}
