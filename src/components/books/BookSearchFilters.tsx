
import React, { useState, useEffect } from "react";
import { Search, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDebounce } from "@/hooks/useDebounce";

interface BookSearchFiltersProps {
  searchTerm: string;
  categoria: string;
  disponibilidad: string;
  categorias: string[];
  onSearchTermChange: (term: string) => void;
  onCategoriaChange: (cat: string) => void;
  onDisponibilidadChange: (value: string) => void;
  onReset: () => void;
}

const BookSearchFilters: React.FC<BookSearchFiltersProps> = ({
  searchTerm,
  categoria,
  disponibilidad,
  categorias = [],
  onSearchTermChange,
  onCategoriaChange,
  onDisponibilidadChange,
  onReset,
}) => {
  const [internalSearch, setInternalSearch] = useState(searchTerm);

  const debouncedSearch = useDebounce(internalSearch, 300);

  useEffect(() => {
    onSearchTermChange(debouncedSearch);
    // eslint-disable-next-line
  }, [debouncedSearch]);

  useEffect(() => {
    setInternalSearch(searchTerm);
  }, [searchTerm]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="sm:col-span-2 flex flex-col gap-1">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar por título, autor o ISBN..."
              className="pl-8"
              value={internalSearch}
              onChange={e => setInternalSearch(e.target.value)}
              aria-label="Buscar libros"
              autoComplete="off"
            />
          </div>
        </div>
        <div>
          <Select value={categoria || "all"} onValueChange={onCategoriaChange}>
            <SelectTrigger aria-label="Filtrar por categoría">
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {categorias.map((cat) => (
                <SelectItem key={cat} value={cat}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Select value={disponibilidad || "all"} onValueChange={onDisponibilidadChange}>
            <SelectTrigger aria-label="Filtrar por disponibilidad">
              <SelectValue placeholder="Cualquier disponibilidad" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquier disponibilidad</SelectItem>
              <SelectItem value="disponible">Disponible físicamente</SelectItem>
              <SelectItem value="no-disponible">No disponible</SelectItem>
              <SelectItem value="digital">Disponible en digital</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center col-span-full mt-2 sm:col-start-2 sm:col-span-2 gap-2">
          <Button
            variant="outline"
            type="button"
            onClick={onReset}
            aria-label="Limpiar filtros"
            className="w-full sm:w-auto"
          >
            <FilterX className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BookSearchFilters;
