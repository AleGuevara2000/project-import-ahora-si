
import React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

interface BooksCatalogFiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  categoria: string;
  setCategoria: (category: string) => void;
  categorias: string[];
  disponibilidad: string;
  setDisponibilidad: (availability: string) => void;
  resetFilters: () => void;
  onBuscar: () => void;                 // NUEVO: función para buscar
  isUserLoggedIn: boolean;              // NUEVO: saber si el usuario puede buscar (siempre true para este caso)
}

const BooksCatalogFilters: React.FC<BooksCatalogFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  categoria,
  setCategoria,
  categorias,
  disponibilidad,
  setDisponibilidad,
  resetFilters,
  onBuscar,
  isUserLoggedIn
}) => (
  <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-4">
    <form
      className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
      onSubmit={e => {
        e.preventDefault();
        if (isUserLoggedIn) onBuscar();
      }}
    >
      <div className="sm:col-span-2">
        <Label htmlFor="search">Buscar por título, autor o ISBN</Label>
        <div className="relative flex gap-2">
          <span className="absolute left-2.5 top-2.5">
            <Search className="h-4 w-4 text-gray-500" />
          </span>
          <Input
            id="search"
            type="text"
            placeholder="Buscar..."
            className="pl-8"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <Button
            type="submit"
            className="ml-2"
            disabled={!isUserLoggedIn}
          >
            Buscar
          </Button>
        </div>
      </div>

      <div>
        <Label htmlFor="categoria">Categoría</Label>
        <Select value={categoria} onValueChange={setCategoria}>
          <SelectTrigger id="categoria">
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
        <Label htmlFor="disponibilidad">Disponibilidad</Label>
        <Select value={disponibilidad} onValueChange={setDisponibilidad}>
          <SelectTrigger id="disponibilidad">
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
      <div className="flex justify-end col-span-full sm:col-start-2 sm:col-span-2 mt-4 gap-2">
        <Button
          variant="outline"
          type="button"
          onClick={resetFilters}
          className="w-full sm:w-auto"
        >
          Limpiar filtros
        </Button>
      </div>
    </form>
  </div>
);

export default BooksCatalogFilters;
