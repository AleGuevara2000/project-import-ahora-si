
import { useState, useMemo, useEffect } from "react";
import { Book } from "@/types/book";
import { useBooksData } from "./hooks/useBooksData";
import { useBooksRealtime } from "./hooks/useBooksRealtime";
import { useBookFilters } from "./hooks/useBookFilters";
import { usePagination } from "./hooks/usePagination";

const ITEMS_PER_PAGE = 6; // Cambiado de 9 a 6 para limitar libros por página

type UseBooksCatalogProps = {
  searchTerm: string;
  categoria: string;
  disponibilidad: string;
};

/**
 * Combina obtención, sincronización y filtrado/paginación para el catálogo de libros.
 */
export function useBooksCatalog({
  searchTerm,
  categoria,
  disponibilidad,
}: UseBooksCatalogProps) {
  const {
    books,
    setBooks,
    digitalBooks,
    setDigitalBooks,
    isLoading,
    setIsLoading,
  } = useBooksData();

  useBooksRealtime(setBooks, setDigitalBooks);

  // Filtering with debounce effect
  const [debouncedFilters, setDebouncedFilters] = useState({
    searchTerm,
    categoria,
    disponibilidad,
  });

  useEffect(() => {
    setIsLoading(true);
    const timeoutId = setTimeout(() => {
      setDebouncedFilters({ searchTerm, categoria, disponibilidad });
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line
  }, [searchTerm, categoria, disponibilidad]);

  const filteredBooks = useBookFilters({
    books,
    digitalBooks,
    ...debouncedFilters,
  });

  const categorias = useMemo(
    () => Array.from(new Set(books.map((libro) => libro.categoria))),
    [books]
  );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    items: libros,
    goToPage,
  } = usePagination(filteredBooks, ITEMS_PER_PAGE);

  return {
    libros,
    filteredBooks,
    isLoading,
    categorias,
    totalPages,
    currentPage,
    goToPage,
    setCurrentPage,
  };
}

