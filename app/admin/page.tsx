'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Wine } from '../types/wine';

export default function AdminPage() {
  const [wines, setWines] = useState<Wine[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingWine, setEditingWine] = useState<Wine | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [password, setPassword] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (authenticated) {
      loadWines();
    }
  }, [authenticated]);

  const loadWines = async () => {
    if (!supabase) return;

    setLoading(true);
    setSearchTerm('');
    try {
      const { data, error } = await supabase
        .from('vinos')
        .select('*')
        .order('Id', { ascending: true });

      if (error) throw error;

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

      setWines(winesMapped);
    } catch (error) {
      console.error('Error cargando vinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setAuthenticated(true);
    } else {
      alert('Contraseña incorrecta');
    }
  };

  const handleEdit = (wine: Wine) => {
    setEditingWine({ ...wine });
  };

  const handleSave = async () => {
    if (!supabase || !editingWine || !editingWine!.id) return;

    try {
      const { error } = await supabase
        .from('vinos')
        .update({
          Title: editingWine!.title,
          Vintage: editingWine!.vintage,
          Country: editingWine!.country,
          County: editingWine!.county,
          Designation: editingWine!.designation,
          Points: editingWine!.points,
          Price: editingWine!.price,
          Province: editingWine!.province,
          Variety: editingWine!.variety,
          Winery: editingWine!.winery,
          image_url: editingWine!.image_url
        })
        .eq('Id', parseInt(editingWine!.id));

      if (error) throw error;

      setEditingWine(null);
      loadWines();
      alert('Vino actualizado correctamente');
    } catch (error) {
      console.error('Error actualizando vino:', error);
      alert('Error al actualizar el vino');
    }
  };

  const handleDelete = async (id: string) => {
    if (!supabase || !confirm('¿Seguro que deseas eliminar este vino?')) return;

    try {
      const { error } = await supabase
        .from('vinos')
        .delete()
        .eq('Id', parseInt(id));

      if (error) throw error;

      loadWines();
      alert('Vino eliminado correctamente');
    } catch (error) {
      console.error('Error eliminando vino:', error);
      alert('Error al eliminar el vino');
    }
  };



  if (!authenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-wine-darker via-wine-dark to-wine-light flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="bg-wine-dark/80 p-8 rounded-lg border border-cork-400/20 backdrop-blur-sm max-w-md w-full">
          <h1 className="text-2xl font-bold text-cork-100 mb-6 text-center">Panel de Administración</h1>
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 rounded-lg bg-wine-darker border border-cork-400/20 text-cork-100 placeholder-cork-400 focus:outline-none focus:border-cork-300 mb-4"
          />
          <button
            type="submit"
            className="w-full px-4 py-2 bg-wine-light hover:bg-wine-light/80 text-cork-100 rounded-lg font-semibold transition-colors"
          >
            Acceder
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-wine-darker via-wine-dark to-wine-light p-4">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cork-100">Panel de Administración - Vinos</h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="px-4 py-2 bg-wine-light/30 hover:bg-wine-light/50 text-cork-200 rounded-lg transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cork-300"></div>
          </div>
        ) : (
          <div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Buscar por nombre..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-wine-darker border border-cork-400/20 text-cork-100 placeholder-cork-400 focus:outline-none focus:border-cork-300 text-sm"
              />
            </div>
            <div className="grid gap-4">
            {wines
              .filter(wine => wine.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              wine.winery?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              wine.variety?.toLowerCase().includes(searchTerm.toLowerCase()))
              .map((wine) => (
              <div
                key={wine.id}
                className="bg-wine-dark/80 border border-cork-400/20 rounded-lg p-4 backdrop-blur-sm"
              >
                {editingWine?.id === wine.id ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Título"
                        value={editingWine!.title || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, title: e.target.value } : prev)}
                        className="px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Año"
                        value={editingWine!.vintage || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, vintage: parseInt(e.target.value) } : prev)}
                        className="px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Bodega"
                        value={editingWine!.winery || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, winery: e.target.value } : prev)}
                        className="px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Variedad"
                        value={editingWine!.variety || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, variety: e.target.value } : prev)}
                        className="px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="País"
                        value={editingWine!.country || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, country: e.target.value } : prev)}
                        className="px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="Provincia"
                        value={editingWine!.province || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, province: e.target.value } : prev)}
                        className="px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Precio"
                        value={editingWine!.price || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, price: parseFloat(e.target.value) } : prev)}
                        className="px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                      <input
                        type="number"
                        placeholder="Puntos"
                        value={editingWine!.points || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, points: parseInt(e.target.value) } : prev)}
                        className="px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Designación"
                      value={editingWine!.designation || ''}
                      onChange={(e) => setEditingWine(prev => prev ? { ...prev, designation: e.target.value } : prev)}
                      className="w-full px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                    />
                    <div className="space-y-2">
                      <label className="block text-cork-200 text-sm font-medium">Imagen del vino</label>
                      {editingWine!.image_url && (
                        <div className="relative w-full h-40 rounded overflow-hidden border border-cork-400/20">
                          <img
                            src={editingWine!.image_url}
                            alt={editingWine!.title || 'Vino'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                       <input
                         type="file"
                         accept="image/*"
                         onChange={async (e) => {
                           const file = e.target.files?.[0];
                           if (!file) return;
                           try {
                             const formData = new FormData();
                             formData.append('file', file);
                             const res = await fetch('/api/upload-image', {
                               method: 'POST',
                               body: formData,
                             });
                              if (!res.ok) {
                                const errData = await res.json();
                                throw new Error(errData.error || errData.details?.message || 'Error en la subida');
                              }
                              const data = await res.json();
                             setEditingWine(prev => prev ? { ...prev, image_url: data.url } : prev);
                           } catch (error) {
                             console.error('Error subiendo imagen:', error);
                             alert('Error al subir la imagen');
                           }
                         }}
                        className="w-full px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm file:mr-4 file:py-1 file:px-3 file:rounded file:border-0 file:bg-wine-light file:text-cork-100 file:text-sm file:font-semibold file:cursor-pointer"
                      />
                      <p className="text-cork-400 text-xs">O pega una URL:</p>
                      <input
                        type="text"
                        placeholder="https://ejemplo.com/imagen.jpg"
                        value={editingWine!.image_url || ''}
                        onChange={(e) => setEditingWine(prev => prev ? { ...prev, image_url: e.target.value } : prev)}
                        className="w-full px-3 py-2 rounded bg-wine-darker border border-cork-400/20 text-cork-100 text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSave}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-colors text-sm"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingWine(null)}
                        className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors text-sm"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex">
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1 flex-1">
                          <h3 className="text-lg font-semibold text-cork-100">{wine.title || 'Sin título'}</h3>
                          <p className="text-cork-200 text-sm">Bodega: {wine.winery || 'N/A'}</p>
                          <p className="text-cork-200 text-sm">Variedad: {wine.variety || 'N/A'}</p>
                          <p className="text-cork-200 text-sm">Año: {wine.vintage || 'N/A'}</p>
                          <p className="text-cork-200 text-sm">Precio: ${wine.price || 'N/A'} | Puntos: {wine.points || 'N/A'}</p>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleEdit(wine)}
                            className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm transition-colors"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => wine.id && handleDelete(wine.id)}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="w-20 flex-shrink-0 bg-gradient-to-b from-wine-dark/50 to-wine-darker/50 flex items-center justify-center p-2 rounded">
                      <img
                        src={wine.image_url || '/wine-bottle.svg'}
                        alt={wine.title || 'Vino'}
                        className="w-full h-auto object-contain drop-shadow-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = '/wine-bottle.svg'; }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          </div>
        )}
      </div>
    </div>
  );
}
