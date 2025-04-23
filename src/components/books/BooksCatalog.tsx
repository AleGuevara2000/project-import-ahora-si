
import React from "react";
import BookList from "./BooksCatalogBookList";
import BooksCatalogSummary from "./BooksCatalogSummary";
import { useBooksCatalog } from "./useBooksCatalog";
import { Book } from "@/types/book";
import BookSearchTesisStyle from "./BookSearchTesisStyle";

interface BooksCatalogProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoria: string;
  setCategoria: (category: string) => void;
  disponibilidad: string;
  setDisponibilidad: (availability: string) => void;
  booksProp?: Book[];
}

/**
 * Catálogo de libros adaptado a la lógica y UI de filtros estilo "tesis":
 * - Input de búsqueda desacoplado con debounce.
 * - Select de categoría y disponibilidad.
 * - Diseño visual inspirado en búsqueda de tesis.
 */
export function BooksCatalog({
  searchTerm,
  setSearchTerm,
  categoria,
  setCategoria,
  disponibilidad,
  setDisponibilidad,
  booksProp,
}: BooksCatalogProps) {
  let libros = booksProp ?? [];
  let isLoading = false;
  let categorias: string[] = [];
  if (booksProp) {
    categorias = Array.from(new Set(booksProp.map((b) => b.categoria)));
  } else {
    const c = useBooksCatalog({ searchTerm, categoria, disponibilidad });
    libros = c.libros;
    isLoading = c.isLoading;
    categorias = c.categorias;
  }

  const handleReset = () => {
    setSearchTerm("");
    setCategoria("");
    setDisponibilidad("");
  };

  return (
    <div className="space-y-4">
      <BookSearchTesisStyle
        searchTerm={searchTerm}
        categoria={categoria}
        disponibilidad={disponibilidad}
        categorias={categorias}
        onSearchTermChange={setSearchTerm}
        onCategoriaChange={setCategoria}
        onDisponibilidadChange={setDisponibilidad}
        onReset={handleReset}
      />

      <div className="bg-white p-4 rounded-lg shadow-sm mb-2">
        <h3 className="text-lg font-semibold">Resultados de búsqueda</h3>
        <BooksCatalogSummary
          isLoading={isLoading}
          librosLength={libros.length}
          filteredLength={libros.length}
        />
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        {isLoading ? (
          <div className="py-8 text-center text-gray-500">Cargando resultados...</div>
        ) : libros.length === 0 ? (
          <div className="py-8 text-center text-gray-500">
            No se encontraron libros que coincidan con los criterios de búsqueda
          </div>
        ) : (
          <BookList libros={libros} searchTerm={searchTerm} />
        )}
      </div>
    </div>
  );
}

