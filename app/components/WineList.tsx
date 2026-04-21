'use client';

import { Wine, WineFilter } from '../types/wine';
import SearchBar from './SearchBar';
import Pagination from './Pagination';
import { useState, useEffect } from 'react';
import Image from 'next/image';

interface WineListProps {
  initialWines: Wine[];
  total: number;
}

export default function WineList({ initialWines }: WineListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeFilters, setActiveFilters] = useState<WineFilter>({});
  const [hoveredWine, setHoveredWine] = useState<string | null>(null);
  const itemsPerPage = 10;

  useEffect(() => {
    const stored = localStorage.getItem('wine-favorites');
    if (stored) {
      try {
        setFavorites(new Set(JSON.parse(stored)));
      } catch (e) {
        console.error('Error loading favorites:', e);
      }
    }
  }, []);

  const toggleFavorite = (wineId: string) => {
    setFavorites(prev => {
      const next = new Set(prev);
      if (next.has(wineId)) {
        next.delete(wineId);
      } else {
        next.add(wineId);
      }
      localStorage.setItem('wine-favorites', JSON.stringify([...next]));
      return next;
    });
  };

  const handleSearch = (filters: WineFilter) => {
    setActiveFilters(filters);
    setCurrentPage(1);
  };

  let result = initialWines;

  if (activeFilters.search) {
    const s = activeFilters.search.toLowerCase();
    result = result.filter(w =>
      w.title?.toLowerCase().includes(s) ||
      w.winery?.toLowerCase().includes(s) ||
      w.variety?.toLowerCase().includes(s)
    );
  }
  if (activeFilters.minPoints) {
    result = result.filter(w => (w.points ?? 0) >= activeFilters.minPoints!);
  }
  if (activeFilters.minPrice) {
    result = result.filter(w => (w.price ?? 0) >= activeFilters.minPrice!);
  }
  if (activeFilters.maxPrice) {
    result = result.filter(w => (w.price ?? 0) <= activeFilters.maxPrice!);
  }
  if (activeFilters.vintage) {
    result = result.filter(w => w.vintage === activeFilters.vintage);
  }
  if (activeFilters.sortField) {
    const field = activeFilters.sortField as keyof Wine;
    const dir = activeFilters.sortDirection === 'asc' ? 1 : -1;
    result = [...result].sort((a, b) => {
      const aVal = a[field];
      const bVal = b[field];
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return dir;
      if (bVal == null) return -dir;
      if (typeof aVal === 'string' && typeof bVal === 'string') return aVal.localeCompare(bVal) * dir;
      return ((aVal as number) - (bVal as number)) * dir;
    });
  }
  if (showFavoritesOnly) {
    result = result.filter(w => favorites.has(w.id || ''));
  }

  const totalPages = Math.ceil(result.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentWines = result.slice(startIndex, endIndex);

  return (
    <div className="container mx-auto px-4">
      <SearchBar onSearch={handleSearch} />
      
      <div className="flex justify-between items-center mb-4">
        <div className="text-cork-200">
          Total de vinos: {result.length}
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => { setShowFavoritesOnly(!showFavoritesOnly); setCurrentPage(1); }}
            className={`flex items-center gap-1 text-sm px-3 py-1 rounded-lg transition-colors ${
              showFavoritesOnly ? 'bg-wine-light/30 text-cork-100' : 'text-cork-300 hover:text-cork-100'
            }`}
          >
            {showFavoritesOnly ? '❤️' : '🤍'} Favoritos ({favorites.size})
          </button>
          <div className="text-cork-300 text-sm">
            Mostrando {startIndex + 1}-{Math.min(endIndex, result.length)} de {result.length}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {currentWines.map((wine, index) => {
          const isFav = favorites.has(wine.id || '');
          return (
            <div
              key={wine.id || index}
              className="bg-wine-dark/80 border border-cork-400/20 rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 hover:border-cork-400/40 backdrop-blur-sm text-sm group h-56 relative"
              onMouseEnter={() => setTimeout(() => setHoveredWine(wine.id || null), 2000)}
              onMouseLeave={() => setHoveredWine(null)}
            >
              {hoveredWine === wine.id && (
                <div className="absolute inset-x-0 bottom-0 bg-wine-darker/95 px-2 py-1 text-center z-30 pointer-events-none">
                  <span className="text-cork-100 text-xs truncate block">
                    {wine.title || wine.name || 'Sin título'}
                  </span>
                </div>
              )}
              <div className="flex items-stretch">
                <div className="flex-1 p-2">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-base font-semibold text-cork-100 line-clamp-2">
                      {wine.title || wine.name || 'Sin título'}
                      {!wine.title && !wine.name && <span className="text-red-500"> (Falta título)</span>}
                    </h3>
                    <span className="px-2 py-1 bg-wine-light/30 rounded-full text-cork-200 text-xs whitespace-nowrap">
                      {wine.vintage || 'N/A'}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-cork-200">
                    <p className="flex justify-between">
                      <span className="text-cork-300">Bodega</span>
                      <span className="text-right flex-1 ml-4 line-clamp-1">{wine.winery || 'N/A'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-cork-300">Variedad</span>
                      <span className="text-right flex-1 ml-4 line-clamp-1">{wine.variety || 'N/A'}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-cork-300">Región</span>
                      <span className="text-right flex-1 ml-4 line-clamp-1">
                        {[wine.province, wine.country].filter(Boolean).join(', ') || 'N/A'}
                      </span>
                    </p>
                    <div className="pt-3 mt-3 border-t border-cork-400/20 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <div className="w-8 h-8 rounded-full bg-wine-light/30 flex items-center justify-center">
                          <span className="text-cork-100 font-bold text-sm">{wine.points || '0'}</span>
                        </div>
                        <span className="text-cork-300 text-xs">pts</span>
                      </div>
                      <span className="text-xl font-bold text-cork-100">
                        {wine.price ? `$${wine.price}` : 'N/A'}
                      </span>
                    </div>
                    {wine.designation && (
                      <div className="mt-2 text-xs text-cork-300 italic line-clamp-1">
                        {wine.designation}
                      </div>
                    )}
                  </div>
                </div>
                <div className="w-24 flex-shrink-0 bg-gradient-to-b from-wine-dark/50 to-wine-darker/50 flex items-center justify-center relative overflow-hidden group/tooltip">
                  <div className="absolute inset-0 bg-wine-light/5 group-hover:bg-wine-light/10 transition-colors duration-300"></div>
                  <Image
                    src={wine.image_url || '/wine-bottle.svg'}
                    alt={wine.title || 'Vino'}
                    width={96}
                    height={224}
                    className="w-full h-full object-contain block relative z-10 drop-shadow-lg group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/wine-bottle.svg'; }}
                  />
                  <button
                    onClick={() => wine.id && toggleFavorite(wine.id)}
                    className="absolute top-1 right-1 text-lg hover:scale-125 transition-transform z-20"
                  >
                    {isFav ? '❤️' : '🤍'}
                  </button>
                  <div className="absolute left-0 right-0 bottom-0 bg-wine-darker/95 px-1 py-0.5 text-center opacity-0 group-hover/tooltip:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <span className="text-cork-100 text-xs truncate block">
                      {wine.title || wine.name || 'Sin título'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="mt-8 mb-12">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => {
              setCurrentPage(page);
            }}
          />
        </div>
      )}

      {result.length === 0 && (
        <div className="text-center py-12 text-cork-300">
          {showFavoritesOnly
            ? 'No tienes vinos favoritos aún. Toca el 🤍 para agregar.'
            : 'No se encontraron vinos que coincidan con los criterios de búsqueda.'}
        </div>
      )}
    </div>
  );
}
