import WineList from './components/WineList';
import { supabase } from './utils/supabase';
import { WineFilter } from './types/wine';

async function getWines(filters?: WineFilter) {
  if (!supabase) {
    console.error('Error: Cliente de Supabase no inicializado.');
    return { wines: [], total: 0 };
  }

  try {
    let query = supabase.from('vinos').select('*', { count: 'exact' });

    if (filters) {
      if (filters.variety) {
        query = query.or(`Variety.ilike.%${filters.variety}%,Winery.ilike.%${filters.variety}%`);
      }
      if (filters.winery) {
        query = query.ilike('Winery', `%${filters.winery}%`);
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('Price', filters.minPrice);
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('Price', filters.maxPrice);
      }
      if (filters.minPoints !== undefined) {
        query = query.gte('Points', filters.minPoints);
      }
      if (filters.vintage !== undefined) {
        query = query.eq('Vintage', filters.vintage);
      }
    }

    const { data, error, count } = await query;

    if (error) {
      console.error('Error al obtener vinos:', error);
      return { wines: [], total: 0 };
    }

    const winesMapped = data?.map(wine => ({
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
      winery: wine.Winery,
      image_url: wine.image_url
    })) || [];

    return { wines: winesMapped, total: count || 0 };
  } catch (error) {
    console.error('Error inesperado:', error);
    return { wines: [], total: 0 };
  }
}

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  
  const filters: WineFilter = {};
  if (params.variety) filters.variety = params.variety;
  if (params.winery) filters.winery = params.winery;
  if (params.minPrice) filters.minPrice = Number(params.minPrice);
  if (params.maxPrice) filters.maxPrice = Number(params.maxPrice);
  if (params.minPoints) filters.minPoints = Number(params.minPoints);
  if (params.vintage) filters.vintage = Number(params.vintage);

  const { wines, total } = await getWines(Object.keys(filters).length > 0 ? filters : undefined);

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

        <WineList initialWines={wines} total={total} />
      </div>
    </main>
  );
}
