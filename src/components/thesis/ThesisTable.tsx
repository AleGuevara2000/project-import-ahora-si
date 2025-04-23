
import React, { useMemo } from 'react';
import { AlertTriangle, Pencil, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { Thesis } from '@/types';
import PDFViewer from '@/components/shared/PDFViewer';
import { useAuth } from '@/contexts/AuthContext';

interface ThesisTableProps {
  theses: Thesis[];
  onEdit?: (thesis: Thesis) => void;
  onDelete?: (thesis: Thesis) => void;
  renderActions?: (thesis: Thesis) => React.ReactNode;
}

const ThesisTable = ({ theses, onEdit, onDelete, renderActions }: ThesisTableProps) => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();

  const sortedTheses = useMemo(() => {
    return [...theses].sort((a, b) => {
      return b.anio - a.anio;
    });
  }, [theses]);

  const handleLoanRequest = (thesis: Thesis) => {
    toast({
      title: "Solicitud de préstamo enviada",
      description: `Tu solicitud para "${thesis.titulo}" ha sido registrada. El personal de biblioteca te notificará cuando esté disponible.`,
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[200px]">Título</TableHead>
              <TableHead className="min-w-[150px]">Autor</TableHead>
              <TableHead className="min-w-[150px] hidden md:table-cell">Carrera/posgrado</TableHead>
              <TableHead className="min-w-[100px] hidden sm:table-cell">Tipo</TableHead>
              <TableHead className="min-w-[80px] hidden lg:table-cell">Año</TableHead>
              <TableHead className="min-w-[150px] hidden md:table-cell">Director</TableHead>
              <TableHead className="min-w-[100px]">Estado</TableHead>
              <TableHead className="min-w-[100px]">Archivo</TableHead>
              <TableHead className="min-w-[100px]">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTheses.length > 0 ? sortedTheses.map(thesis => (
              <TableRow key={thesis.id}>
                <TableCell className="font-medium" title={thesis.titulo}>
                  <div className="truncate max-w-[200px]">{thesis.titulo}</div>
                </TableCell>
                <TableCell title={thesis.autor}>
                  <div className="truncate max-w-[150px]">{thesis.autor}</div>
                </TableCell>
                <TableCell className="hidden md:table-cell" title={thesis.carrera}>
                  <div className="truncate max-w-[150px]">{thesis.carrera}</div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{thesis.tipo}</TableCell>
                <TableCell className="hidden lg:table-cell">{thesis.anio}</TableCell>
                <TableCell className="hidden md:table-cell" title={thesis.director}>
                  <div className="truncate max-w-[150px]">{thesis.director}</div>
                </TableCell>
                <TableCell>
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${thesis.disponible ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {thesis.disponible ? 'Disponible' : 'No disponible'}
                  </span>
                </TableCell>
                <TableCell>
                  {thesis.archivoPdf ? (
                    <PDFViewer 
                      url={thesis.archivoPdf}
                      fileName={`${thesis.titulo}.pdf`}
                    />
                  ) : (
                    <span className="text-gray-400">No disponible</span>
                  )}
                </TableCell>
                <TableCell>
                  {renderActions ? (
                    renderActions(thesis)
                  ) : thesis.disponible ? (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleLoanRequest(thesis)}
                    >
                      <BookOpen className="h-4 w-4" />
                      <span className="hidden sm:inline">Solicitar</span>
                    </Button>
                  ) : (
                    <span className="text-gray-400 text-sm">No disponible</span>
                  )}
                </TableCell>
                {onDelete && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(thesis)}
                      aria-label={`Eliminar tesis ${thesis.titulo}`}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                )}
                {onEdit && (
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit ? onEdit(thesis) : null}
                      aria-label={`Editar tesis ${thesis.titulo}`}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                )}
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <AlertTriangle className="h-8 w-8 text-gray-300 mb-2" />
                    <span className="text-gray-500">
                      No se encontraron tesis con los filtros actuales
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ThesisTable;
