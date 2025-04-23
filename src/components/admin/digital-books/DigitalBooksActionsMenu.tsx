
import React from 'react';
import { EditDigitalBookDialog } from '../EditDigitalBookDialog';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Trash2 } from 'lucide-react';
import { DigitalBook } from '@/types/digitalBook';
import { useToast } from '@/hooks/use-toast';

interface DigitalBooksActionsMenuProps {
  isStaff: boolean;
  digitalBook: DigitalBook;
  onDelete?: (id: string) => void;
  onEdit?: (id: string, data: Partial<DigitalBook>) => void;
}

export function DigitalBooksActionsMenu({ 
  isStaff, 
  digitalBook, 
  onDelete,
  onEdit 
}: DigitalBooksActionsMenuProps) {
  const { toast } = useToast();
  
  if (!isStaff) return null;

  const handleEdit = (data: Partial<DigitalBook>) => {
    if (onEdit) {
      onEdit(digitalBook.id, data);
    }
  };
  
  const handleDelete = () => {
    if (onDelete) {
      try {
        onDelete(digitalBook.id);
        toast({
          title: "Archivo eliminado",
          description: "El archivo digital ha sido eliminado correctamente."
        });
      } catch (error) {
        console.error("Error al eliminar:", error);
        toast({
          title: "Error",
          description: "No se pudo eliminar el archivo. Intente nuevamente.",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <>
      <EditDigitalBookDialog
        digitalBook={digitalBook}
        onEdit={handleEdit}
      />
      
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="text-red-500 hover:text-red-700"
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Eliminar</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Confirma eliminar este archivo?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. El archivo digital será eliminado permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  );
}
