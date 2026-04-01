'use client';

import { Wine, WineFilter } from '../types/wine';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { useState, useEffect } from 'react';

interface WineListProps {
  initialWines: Wine[];
}

export default function WineList({ initialWines }: WineListProps) {
  const [wines, setWines] = useState<Wine[]>(initialWines);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    console.log('WineList - initialWines:', initialWines);
    console.log('WineList - current wines state:', wines);
  }, [initialWines, wines]);

  const handleSearch = async (filters: WineFilter) => {
    setLoading(true);
    try {
      const filteredWines = initialWines.filter(wine => {
        const matchesSearch = !filters.variety && !filters.winery ? true :
          wine.variety?.toLowerCase().includes((filters.variety || '').toLowerCase()) ||
          wine.winery?.toLowerCase().includes((filters.winery || '').toLowerCase());

        const matchesPrice = (!filters.minPrice || (wine.price ?? 0) >= filters.minPrice) &&
          (!filters.maxPrice || (wine.price ?? 0) <= filters.maxPrice);

        const matchesPoints = !filters.minPoints || (wine.points ?? 0) >= filters.minPoints;

        const matchesVintage = !filters.vintage || wine.vintage === filters.vintage;

        return matchesSearch && matchesPrice && matchesPoints && matchesVintage;
      });

      setWines(filteredWines);
      setCurrentPage(1); // Resetear a la primera página cuando se aplica un filtro
    } catch (error) {
      console.error('Error al buscar vinos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calcular páginas y vinos a mostrar
  const totalPages = Math.ceil(wines.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWines = wines.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderWineCard = (wine: Wine, index: number) => {
    return (
      <div
        key={wine.id || index}
        className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm"
      >
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-cork-100">{wine.title || wine.name || 'Sin título'}</h3>
          <p className="text-cork-200 text-sm">Bodega: {wine.winery || 'N/A'}</p>
          <p className="text-cork-200 text-sm">Variedad: {wine.variety || 'N/A'}</p>
          <p className="text-cork-200 text-sm">Año: {wine.vintage || 'N/A'}</p>
          <p className="text-cork-200 text-sm">Precio: ${wine.price || 'N/A'} | Puntos: {wine.points || 'N/A'}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4">
      <SearchBar onSearch={handleSearch} />
      
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cork-300"></div>
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <div className="text-cork-200">
              Total de vinos: {wines.length}
            </div>
            <div className="text-cork-300 text-sm">
              Mostrando {startIndex + 1}-{Math.min(endIndex, wines.length)} de {wines.length}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {currentWines.map((wine, index) => renderWineCard(wine, index))}
          </div>

          {totalPages > 1 && (
            <div className="mt-8 mb-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          )}
        </>
      )}

      {wines.length === 0 && !loading && (
        <div className="text-center py-12 text-cork-300">
          No se encontraron vinos que coincidan con los criterios de búsqueda.
        </div>
      )}
    </div>
  );
} 