import React, { useState, useEffect } from 'react';
import classes from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  hasNext,
  hasPrev,
  onPageChange,
}) => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (totalPages <= 1) {
    return null;
  }

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = isMobile ? 3 : 5;

    if (totalPages <= maxVisiblePages) {
      // Если страниц меньше или равно максимальному количеству, показываем все
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Для мобильных устройств показываем только текущую страницу и соседние
      if (isMobile) {
        const startPage = Math.max(1, currentPage - 1);
        const endPage = Math.min(totalPages, currentPage + 1);

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      } else {
        // Для десктопа показываем умную пагинацию
        let startPage = Math.max(
          1,
          currentPage - Math.floor(maxVisiblePages / 2)
        );
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        if (endPage - startPage + 1 < maxVisiblePages) {
          startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
          pages.push(i);
        }
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={classes.pagination}>
      <button
        className={`${classes.navButton} ${!hasPrev ? classes.disabled : ''}`}
        onClick={() => hasPrev && onPageChange(currentPage - 1)}
        disabled={!hasPrev}
      >
        ← Previous
      </button>

      <div className={classes.pageNumbers}>
        {pageNumbers.map((page) => (
          <button
            key={page}
            className={`${classes.pageButton} ${
              page === currentPage ? classes.active : ''
            }`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={`${classes.navButton} ${!hasNext ? classes.disabled : ''}`}
        onClick={() => hasNext && onPageChange(currentPage + 1)}
        disabled={!hasNext}
      >
        Next →
      </button>
    </div>
  );
};
