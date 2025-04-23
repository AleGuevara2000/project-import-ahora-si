
import React from 'react';
import { Search, FilterX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface PrestamosFilterProps {
  busqueda: string;
  setBusqueda: (value: string) => void;
  filtroEstado: string;
  setFiltroEstado: (value: string) => void;
  limpiarFiltros: () => void;
}

const PrestamosFilter = ({
  busqueda,
  setBusqueda,
  filtroEstado,
  setFiltroEstado,
  limpiarFiltros
}: PrestamosFilterProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <div className="grid gap-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="text"
              placeholder="Buscar por título, usuario o correo..."
              className="pl-8"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>
        </div>
        
        <div>
          <Select value={filtroEstado} onValueChange={setFiltroEstado}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="prestado">Prestados</SelectItem>
              <SelectItem value="devuelto">Devueltos</SelectItem>
              <SelectItem value="retrasado">Retrasados</SelectItem>
              <SelectItem value="vencido">Vencidos</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end">
          <Button variant="outline" onClick={limpiarFiltros} className="w-full">
            <FilterX className="h-4 w-4 mr-2" />
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PrestamosFilter;
