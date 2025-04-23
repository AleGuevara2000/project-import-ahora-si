
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import PrestamoItem from './PrestamoItem';
import type { Prestamo } from '@/types';

interface PrestamosListProps {
  prestamos: Array<Prestamo & {
    usuario: string;
    userEmail: string;
    userRole: string;
    libroTitulo: string;
    vencido: boolean;
  }>;
  onMarcarDevuelto: (id: string) => void;
  onAplicarPenalizacion: (id: string, dias: number, razon: string) => void;
}

const PrestamosList = ({ prestamos, onMarcarDevuelto, onAplicarPenalizacion }: PrestamosListProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Libro</TableHead>
            <TableHead>Usuario</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Préstamo</TableHead>
            <TableHead>Devolución</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {prestamos.length > 0 ? (
            prestamos.map((prestamo) => (
              <PrestamoItem 
                key={prestamo.id} 
                prestamo={prestamo} 
                onMarcarDevuelto={onMarcarDevuelto}
                onAplicarPenalizacion={onAplicarPenalizacion}
              />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                <div className="flex flex-col items-center justify-center">
                  <AlertTriangle className="h-8 w-8 text-gray-300 mb-2" />
                  <span className="text-gray-500">
                    No se encontraron préstamos con los filtros actuales
                  </span>
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PrestamosList;
