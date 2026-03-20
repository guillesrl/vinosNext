'use client';

import { WineFilter } from '../types/wine';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (filters: WineFilter) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [filters, setFilters] = useState<WineFilter>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  const inputClassName = "w-full px-2 py-1.5 bg-wine-dark/50 border border-cork-400/20 rounded focus:outline-none focus:ring-1 focus:ring-cork-300 text-cork-100 placeholder-cork-400 text-xs";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto mb-4">
      {/* Búsqueda principal y botón */}
      <div className="flex gap-2 mb-2 sm:mb-0">
        <div className="flex-1">
          <input
            type="text"
            placeholder="🔍 Buscar..."
            className={inputClassName}
            onChange={(e) => {
              const value = e.target.value;
              setFilters(prev => ({
                ...prev,
                variety: value || undefined,
                winery: value || undefined
              }));
            }}
          />
        </div>
        <button
          type="submit"
          className="px-3 py-1.5 bg-wine-light text-cork-100 rounded hover:bg-wine-light/80 transition-colors font-medium text-xs whitespace-nowrap"
        >
          Buscar
        </button>
      </div>

      {/* Filtros - en columna en móvil, en línea en pantallas más grandes */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-wine-dark/30 rounded-lg border border-cork-400/10">
        <div>
          <input
            type="number"
            placeholder="Puntaje"
            className={inputClassName}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              minPoints: e.target.value ? Number(e.target.value) : undefined
            }))}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="$ min"
            className={inputClassName}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              minPrice: e.target.value ? Number(e.target.value) : undefined
            }))}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="$ max"
            className={inputClassName}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              maxPrice: e.target.value ? Number(e.target.value) : undefined
            }))}
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Año"
            className={inputClassName}
            onChange={(e) => setFilters(prev => ({
              ...prev,
              vintage: e.target.value ? Number(e.target.value) : undefined
            }))}
          />
        </div>
      </div>
    </form>
  );
}
