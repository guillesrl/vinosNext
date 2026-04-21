'use client';

import { Wine } from '../types/wine';
import { useState } from 'react';

interface StatsProps {
  wines: Wine[];
}

export default function Stats({ wines }: StatsProps) {
  const [isOpen, setIsOpen] = useState(false);

  if (wines.length === 0) return null;

  // Cálculos de estadísticas
  const totalWines = wines.length;

  const winesWithPrice = wines.filter(w => w.price && w.price > 0);
  const avgPrice = winesWithPrice.length > 0
    ? winesWithPrice.reduce((sum, w) => sum + (w.price || 0), 0) / winesWithPrice.length
    : 0;

  const winesWithPoints = wines.filter(w => w.points && w.points > 0);
  const avgPoints = winesWithPoints.length > 0
    ? winesWithPoints.reduce((sum, w) => sum + (w.points || 0), 0) / winesWithPoints.length
    : 0;

  // Top 5 vinos mejor puntuados
  const topRated = [...wines]
    .filter(w => w.points && w.points > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 5);

  // Distribución por país
  const countryDistribution = wines.reduce((acc, wine) => {
    const country = wine.country || 'Sin especificar';
    acc[country] = (acc[country] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topCountries = Object.entries(countryDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxCountryCount = Math.max(...topCountries.map(([, count]) => count));

  // Distribución por variedad
  const varietyDistribution = wines.reduce((acc, wine) => {
    const variety = wine.variety || 'Sin especificar';
    acc[variety] = (acc[variety] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topVarieties = Object.entries(varietyDistribution)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const maxVarietyCount = Math.max(...topVarieties.map(([, count]) => count));

  // Rango de precios
  const prices = wines.filter(w => w.price && w.price > 0).map(w => w.price || 0);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0;

  return (
    <div className="mb-6">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-wine-dark/80 border border-cork-400/20 rounded-lg p-3 backdrop-blur-sm hover:border-cork-400/40 transition-all duration-300 flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <span className="text-lg">📊</span>
          <h2 className="text-base font-semibold text-cork-100">Estadísticas de la Colección</h2>
        </div>
        <span className="text-cork-300 text-2xl">{isOpen ? '−' : '+'}</span>
      </button>

      {isOpen && (
        <div className="mt-4 space-y-4">
          {/* Tarjetas de resumen */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-cork-300 text-sm mb-1">Total de Vinos</div>
              <div className="text-3xl font-bold text-cork-100">{totalWines}</div>
            </div>
            <div className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-cork-300 text-sm mb-1">Precio Promedio</div>
              <div className="text-3xl font-bold text-cork-100">${avgPrice.toFixed(0)}</div>
            </div>
            <div className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-cork-300 text-sm mb-1">Puntuación Promedio</div>
              <div className="text-3xl font-bold text-cork-100">{avgPoints.toFixed(1)}</div>
            </div>
            <div className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-cork-300 text-sm mb-1">Rango de Precios</div>
              <div className="text-lg font-bold text-cork-100">${minPrice} - ${maxPrice}</div>
            </div>
          </div>

          {/* Grid de gráficos y top */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Top 5 vinos mejor puntuados */}
            <div className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-cork-100 mb-3 flex items-center gap-2">
                <span>🏆</span> Top 5 Mejor Puntuados
              </h3>
              <div className="space-y-2">
                {topRated.map((wine, index) => (
                  <div key={wine.id || index} className="flex items-center justify-between text-sm">
                    <div className="flex-1 truncate">
                      <span className="text-cork-200">{index + 1}. </span>
                      <span className="text-cork-100">{wine.title || wine.name}</span>
                    </div>
                    <div className="ml-2 px-2 py-1 bg-wine-light/30 rounded text-cork-100 font-semibold">
                      {wine.points}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribución por país */}
            <div className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-cork-100 mb-3 flex items-center gap-2">
                <span>🌍</span> Top 5 Países
              </h3>
              <div className="space-y-3">
                {topCountries.map(([country, count]) => (
                  <div key={country}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cork-200">{country}</span>
                      <span className="text-cork-100 font-semibold">{count}</span>
                    </div>
                    <div className="w-full bg-wine-darker/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-wine-light to-cork-300 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxCountryCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Distribución por variedad */}
            <div className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm md:col-span-2">
              <h3 className="text-lg font-semibold text-cork-100 mb-3 flex items-center gap-2">
                <span>🍇</span> Top 5 Variedades
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {topVarieties.map(([variety, count]) => (
                  <div key={variety}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-cork-200 truncate">{variety}</span>
                      <span className="text-cork-100 font-semibold ml-2">{count}</span>
                    </div>
                    <div className="w-full bg-wine-darker/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-wine-light to-cork-300 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${(count / maxVarietyCount) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
