
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { CheckCircle2, AlertTriangle } from 'lucide-react';
import type { Prestamo } from '@/types';
import BarcodeScanner from './BarcodeScanner';
import { useToast } from '@/hooks/use-toast';
import PenalizacionDialog from './PenalizacionDialog';

interface PrestamoItemProps {
  prestamo: Prestamo & {
    usuario: string;
    userEmail: string;
    userRole: string;
    libroTitulo: string;
    vencido: boolean;
  };
  onMarcarDevuelto: (id: string) => void;
  onAplicarPenalizacion: (id: string, dias: number, razon: string) => void;
}

const PrestamoItem = ({ prestamo, onMarcarDevuelto, onAplicarPenalizacion }: PrestamoItemProps) => {
  const { toast } = useToast();
  const [showPenalizacionDialog, setShowPenalizacionDialog] = useState(false);
  
  const handleScan = (isbn: string) => {
    // Aquí deberías verificar que el ISBN escaneado corresponde al libro
    // Por ahora, solo validamos que se haya escaneado algo
    if (isbn) {
      onMarcarDevuelto(prestamo.id);
      toast({
        title: "Libro escaneado correctamente",
        description: `ISBN: ${isbn}`,
      });
    }
  };

  const handlePenalizacion = (dias: number, razon: string) => {
    onAplicarPenalizacion(prestamo.id, dias, razon);
    setShowPenalizacionDialog(false);
  };

  return (
    <TableRow 
      className={
        prestamo.vencido && prestamo.estado === 'prestado' 
          ? 'bg-red-50' 
          : prestamo.estado === 'retrasado'
            ? 'bg-amber-50'
            : prestamo.estado === 'devuelto'
              ? 'bg-gray-50'
              : ''
      }
    >
      <TableCell className="font-medium">
        {prestamo.libroTitulo}
      </TableCell>
      <TableCell>
        <div>
          <div>{prestamo.usuario}</div>
          <div className="text-xs text-gray-500">{prestamo.userEmail}</div>
        </div>
      </TableCell>
      <TableCell className="capitalize">
        {prestamo.userRole}
      </TableCell>
      <TableCell>
        {format(new Date(prestamo.fechaPrestamo), 'PPP', { locale: es })}
      </TableCell>
      <TableCell className={prestamo.vencido && prestamo.estado !== 'devuelto' ? 'text-red-600 font-medium' : ''}>
        {format(new Date(prestamo.fechaDevolucion), 'PPP', { locale: es })}
      </TableCell>
      <TableCell>
        <div className="flex items-center">
          {prestamo.estado === 'prestado' && !prestamo.vencido && (
            <>
              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
              <span>Prestado</span>
            </>
          )}
          {prestamo.estado === 'prestado' && prestamo.vencido && (
            <>
              <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
              <span className="text-red-600">Vencido</span>
            </>
          )}
          {prestamo.estado === 'retrasado' && (
            <>
              <div className="h-2 w-2 rounded-full bg-amber-500 mr-2"></div>
              <span className="text-amber-600">Retrasado</span>
            </>
          )}
          {prestamo.estado === 'devuelto' && (
            <>
              <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
              <span>Devuelto</span>
            </>
          )}
        </div>
        {prestamo.penalizacion && (
          <div className="mt-1 text-xs text-red-600">
            <AlertTriangle className="inline-block h-3 w-3 mr-1" />
            Penalizado {prestamo.penalizacion.dias} días
          </div>
        )}
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          {prestamo.estado !== 'devuelto' ? (
            <>
              <BarcodeScanner onScan={handleScan} />
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => onMarcarDevuelto(prestamo.id)}
              >
                <CheckCircle2 className="h-4 w-4 mr-1" />
                Marcar como devuelto
              </Button>
              {(prestamo.vencido || prestamo.estado === 'retrasado') && (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => setShowPenalizacionDialog(true)}
                >
                  <AlertTriangle className="h-4 w-4 mr-1" />
                  Penalizar
                </Button>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500">Devuelto</span>
          )}
        </div>

        <PenalizacionDialog
          isOpen={showPenalizacionDialog}
          onClose={() => setShowPenalizacionDialog(false)}
          onConfirm={handlePenalizacion}
          nombreUsuario={prestamo.usuario}
        />
      </TableCell>
    </TableRow>
  );
};

export default PrestamoItem;
