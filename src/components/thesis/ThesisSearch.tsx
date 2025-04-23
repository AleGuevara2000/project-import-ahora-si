
import React, { useState, useEffect } from 'react';
import { FilterX, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useDebounce } from '@/hooks/useDebounce';

interface ThesisSearchProps {
  busqueda: string;
  tipoFiltro: string;
  onBusquedaChange: (value: string) => void;
  onTipoFiltroChange: (value: string) => void;
  onLimpiarFiltros: () => void;
}

const ThesisSearch = ({
  busqueda,
  tipoFiltro,
  onBusquedaChange,
  onTipoFiltroChange,
  onLimpiarFiltros
}: ThesisSearchProps) => {
  const [searchTerm, setSearchTerm] = useState(busqueda);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  useEffect(() => {
    onBusquedaChange(debouncedSearchTerm);
  }, [debouncedSearchTerm, onBusquedaChange]);

  return (
    <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input 
              type="text" 
              placeholder="Buscar por título, autor o director..." 
              className="pl-8" 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              aria-label="Buscar tesis"
            />
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <Select value={tipoFiltro || "all"} onValueChange={onTipoFiltroChange}>
              <SelectTrigger aria-label="Filtrar por tipo">
                <SelectValue placeholder="Todos los tipos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los tipos</SelectItem>
                <SelectItem value="Licenciatura">Licenciatura</SelectItem>
                <SelectItem value="Maestría">Maestría</SelectItem>
                <SelectItem value="Doctorado">Doctorado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            variant="outline" 
            onClick={onLimpiarFiltros} 
            className="whitespace-nowrap"
            aria-label="Limpiar filtros"
          >
            <FilterX className="h-4 w-4 mr-2" />
            Limpiar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThesisSearch;
