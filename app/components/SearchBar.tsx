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

  const inputClassName = "w-full px-4 py-2.5 bg-wine-dark/50 border border-cork-400/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-cork-300 text-cork-100 placeholder-cork-400";

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto mb-8 backdrop-blur-sm">
      <div className="space-y-4">
        {/* Barra principal */}
        <div className="flex gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Buscar por nombre, bodega o variedad..."
              className={`${inputClassName} text-base`}
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
            className="px-6 py-2.5 bg-wine-light text-cork-100 rounded-lg hover:bg-wine-light/80 transition-colors font-medium shadow-lg whitespace-nowrap"
          >
            Buscar
          </button>
        </div>

        {/* Filtros */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-wine-dark/30 rounded-lg border border-cork-400/10">
          <div>
            <label className="block text-xs text-cork-300 mb-1.5">Precio mínimo</label>
            <input
              type="number"
              placeholder="$"
              className={`${inputClassName} text-sm`}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                minPrice: e.target.value ? Number(e.target.value) : undefined
              }))}
            />
          </div>
          
          <div>
            <label className="block text-xs text-cork-300 mb-1.5">Precio máximo</label>
            <input
              type="number"
              placeholder="$"
              className={`${inputClassName} text-sm`}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                maxPrice: e.target.value ? Number(e.target.value) : undefined
              }))}
            />
          </div>

          <div>
            <label className="block text-xs text-cork-300 mb-1.5">Puntuación mínima</label>
            <input
              type="number"
              placeholder="0-100"
              className={`${inputClassName} text-sm`}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                minPoints: e.target.value ? Number(e.target.value) : undefined
              }))}
            />
          </div>

          <div>
            <label className="block text-xs text-cork-300 mb-1.5">Año</label>
            <input
              type="number"
              placeholder="YYYY"
              className={`${inputClassName} text-sm`}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                vintage: e.target.value ? Number(e.target.value) : undefined
              }))}
            />
          </div>
        </div>
      </div>
    </form>
  );
} 