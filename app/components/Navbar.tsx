'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-wine-darker/80 backdrop-blur-sm border-b border-wine-dark/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center space-x-3">
                <span className="text-2xl">🍷</span>
                <span className="hidden md:block text-xl font-bold text-cork-100">
                  Colección de Vinos
                </span>
              </Link>
            </div>
          </div>
          <div className="hidden md:flex md:items-center md:space-x-6">
            <Link href="/" className="px-3 py-2 rounded-md text-sm font-medium text-cork-300 hover:bg-wine-dark/30 hover:text-cork-100 transition-colors">
              Inicio
            </Link>
            <Link href="/admin" className="px-3 py-2 rounded-md text-sm font-medium text-cork-300 hover:bg-wine-dark/30 hover:text-cork-100 transition-colors">
              Admin
            </Link>
          </div>
          <div className="flex items-center">
            <Link href="/#contact" className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium text-cork-300 hover:bg-wine-dark/30 hover:text-cork-100 transition-colors">
              <span>📧</span>
              <span className="hidden md:block">Contacto</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}