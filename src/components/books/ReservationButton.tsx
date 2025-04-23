
import React from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useReservationTimer } from '@/hooks/useReservationTimer';
import { Clock, AlertTriangle } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ReservationButtonProps {
  bookId: string;
  bookTitle: string;
  isAvailable: boolean;
}

export const ReservationButton = ({ bookId, bookTitle, isAvailable }: ReservationButtonProps) => {
  const { toast } = useToast();
  const { isActive, startTimer, stopTimer, formatTime } = useReservationTimer(30, () => {
    // When timer expires, cancel reservation
    handleCancelReservation();
  });

  const handleReserve = () => {
    startTimer();
    toast({
      title: "Libro reservado",
      description: `Has reservado "${bookTitle}" por 30 minutos. Por favor, pasa por la biblioteca para recogerlo.`,
    });
  };

  const handleCancelReservation = () => {
    stopTimer();
    toast({
      title: "Reserva cancelada",
      description: "La reserva ha sido cancelada.",
    });
  };

  if (!isAvailable) {
    return (
      <Button className="w-full" disabled>
        <AlertTriangle className="mr-2 h-4 w-4" />
        No disponible
      </Button>
    );
  }

  return (
    <div className="space-y-2">
      {!isActive ? (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button className="w-full" variant="secondary">
              <Clock className="mr-2 h-4 w-4" />
              Reservar por 30 minutos
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirmar reserva</AlertDialogTitle>
              <AlertDialogDescription>
                ¿Deseas reservar "{bookTitle}" por 30 minutos? 
                <br /><br />
                Deberás pasar por la biblioteca dentro de este tiempo para recoger el libro,
                de lo contrario la reserva se cancelará automáticamente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleReserve}>
                Confirmar reserva
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : (
        <div className="space-y-2">
          <div className="bg-accent/20 p-3 rounded-md text-center">
            <p className="text-sm text-muted-foreground mb-1">Tiempo restante de reserva</p>
            <p className="text-2xl font-mono font-bold">{formatTime()}</p>
          </div>
          <Button 
            variant="destructive" 
            className="w-full"
            onClick={handleCancelReservation}
          >
            Cancelar reserva
          </Button>
        </div>
      )}
    </div>
  );
};
