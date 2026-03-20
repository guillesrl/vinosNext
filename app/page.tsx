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
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🍷</span>
            <h1 className="text-xl font-bold text-cork-100">
              Colección de Vinos
            </h1>
          </div>
          <a
            href="mailto:guillesrl@gmail.com"
            className="px-3 py-2 rounded-lg text-sm font-medium transition-colors text-cork-300 hover:bg-wine-dark/50 hover:text-cork-100 inline-flex items-center gap-1"
          >
            <span>📧</span> Contacto
          </a>
        </div>

        <WineList initialWines={wines} />
      </div>
    </main>
  );
}
