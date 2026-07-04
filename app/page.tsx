import WineList from './components/WineList';
import Stats from './components/Stats';
import { WineFilter } from './types/wine';
import { mapWineRow } from './utils/map-wine';
import { queryWines } from './utils/wines-db';

async function getWines(filters?: WineFilter) {
  try {
    const { rows, total } = await queryWines(filters || {});
    return { wines: rows.map(mapWineRow), total };
  } catch (error) {
    console.error('Error al obtener vinos:', error);
    return { wines: [], total: 0 };
  }
}

export const dynamic = 'force-dynamic';

export default async function Home({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = await searchParams;
  
  const filters: WineFilter = {};
  if (params.search) filters.search = params.search;
  if (params.minPrice) filters.minPrice = Number(params.minPrice);
  if (params.maxPrice) filters.maxPrice = Number(params.maxPrice);
  if (params.minPoints) filters.minPoints = Number(params.minPoints);
  if (params.vintage) filters.vintage = Number(params.vintage);
  if (params.sortField) filters.sortField = params.sortField;
  if (params.sortDirection) filters.sortDirection = params.sortDirection as 'asc' | 'desc';

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

        <Stats wines={wines} />
        <WineList initialWines={wines} total={total} />
      </div>
    </main>
  );
}
