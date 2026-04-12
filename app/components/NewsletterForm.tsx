'use client';

import { useState } from 'react';
import toast from 'react-hot-toast';

export default function NewsletterForm() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Aquí iría la llamada a la API para guardar el email
      // Simulamos una llamada asíncrona
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('¡Gracias por suscribirte a nuestro boletín!');
      setEmail('');
    } catch {
      toast.error('Hubo un error al procesar tu suscripción. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-purple-50 p-8 rounded-lg max-w-xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Suscríbete a nuestro boletín</h2>
      <p className="text-gray-600 text-center mb-6">
        Recibe las últimas novedades sobre vinos, ofertas exclusivas y consejos de expertos.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Tu correo electrónico"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full px-6 py-2 text-white rounded-lg transition-colors ${
            isLoading
              ? 'bg-purple-400 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Procesando...
            </span>
          ) : (
            'Suscribirse'
          )}
        </button>
      </form>
    </div>
  );
} 