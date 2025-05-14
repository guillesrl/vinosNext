'use client';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;
    
    if (!showEllipsis) {
      // Mostrar todas las páginas si son 7 o menos
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Lógica para páginas con ellipsis
      if (currentPage <= 4) {
        // Inicio: 1 2 3 4 5 ... n
        for (let i = 1; i <= 5; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 3) {
        // Final: 1 ... n-4 n-3 n-2 n-1 n
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 4; i <= totalPages; i++) pages.push(i);
      } else {
        // Medio: 1 ... x-1 x x+1 ... n
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  const buttonClassName = (isActive: boolean) => `
    px-3 py-2 rounded-lg text-sm font-medium transition-colors
    ${isActive 
      ? 'bg-wine-light text-cork-100' 
      : 'text-cork-300 hover:bg-wine-dark/50 hover:text-cork-100'}
  `;

  return (
    <div className="flex items-center justify-center gap-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`${buttonClassName(false)} ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Anterior
      </button>

      <div className="flex items-center gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' ? onPageChange(page) : null}
            disabled={typeof page !== 'number'}
            className={`${buttonClassName(page === currentPage)} ${
              typeof page !== 'number' ? 'cursor-default hover:bg-transparent hover:text-cork-300' : ''
            }`}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`${buttonClassName(false)} ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        Siguiente
      </button>
    </div>
  );
} 