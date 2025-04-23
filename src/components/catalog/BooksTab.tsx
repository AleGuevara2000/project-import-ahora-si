
import React, { useState } from "react";
import { BooksCatalog } from "@/components/books/BooksCatalog";
import { useBooksData } from "@/components/books/hooks/useBooksData";

/**
 * La búsqueda de libros ahora utiliza la misma configuración de filtro que la búsqueda de tesis,
 * con debounce y filtros desacoplados.
 */
const BooksTab: React.FC = () => {
  const { books } = useBooksData();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoria, setCategoria] = useState("");
  const [disponibilidad, setDisponibilidad] = useState("");

  return (
    <BooksCatalog
      searchTerm={searchTerm}
      setSearchTerm={setSearchTerm}
      categoria={categoria}
      setCategoria={setCategoria}
      disponibilidad={disponibilidad}
      setDisponibilidad={setDisponibilidad}
      booksProp={books}
    />
  );
};

export default BooksTab;
