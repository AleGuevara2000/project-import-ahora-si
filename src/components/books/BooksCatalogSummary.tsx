
import React from "react";

interface BooksCatalogSummaryProps {
  isLoading: boolean;
  librosLength: number;
  filteredLength: number;
}

const BooksCatalogSummary: React.FC<BooksCatalogSummaryProps> = ({
  isLoading,
  librosLength,
  filteredLength,
}) => (
  <div className="mt-2">
    <p className="text-gray-600 text-sm sm:text-base">
      {isLoading
        ? "Cargando libros..."
        : filteredLength === 0
        ? "No se encontraron libros que coincidan con los criterios de búsqueda"
        : `Mostrando ${librosLength} de ${filteredLength} ${
            filteredLength === 1 ? "libro" : "libros"
          }`}
    </p>
  </div>
);

export default BooksCatalogSummary;
