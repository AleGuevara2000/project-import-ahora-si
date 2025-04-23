
import { useMemo } from "react";
import { Book } from "@/types/book";

type UseBookFiltersProps = {
  books: Book[];
  digitalBooks: string[];
  searchTerm: string;
  categoria: string;
  disponibilidad: string;
};

export function useBookFilters({
  books,
  digitalBooks,
  searchTerm,
  categoria,
  disponibilidad,
}: UseBookFiltersProps) {
  return useMemo(() => {
    let filtered = [...books];

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (libro) =>
          libro.titulo.toLowerCase().includes(searchTermLower) ||
          libro.autor.toLowerCase().includes(searchTermLower) ||
          libro.isbn.includes(searchTerm) ||
          libro.editorial.toLowerCase().includes(searchTermLower)
      );
    }

    if (categoria && categoria !== "all") {
      filtered = filtered.filter((libro) => libro.categoria === categoria);
    }

    if (disponibilidad === "disponible") {
      filtered = filtered.filter((libro) => libro.disponibles > 0);
    } else if (disponibilidad === "no-disponible") {
      filtered = filtered.filter((libro) => libro.disponibles === 0);
    } else if (disponibilidad === "digital") {
      filtered = filtered.filter((libro) => digitalBooks.includes(libro.id));
    }

    return filtered;
  }, [books, digitalBooks, searchTerm, categoria, disponibilidad]);
}
