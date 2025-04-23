
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

export const useReservationTimer = (
  initialTimeInMinutes: number = 30,
  onTimeout: () => void
) => {
  const [remainingTime, setRemainingTime] = useState(initialTimeInMinutes * 60); // in seconds
  const [isActive, setIsActive] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && remainingTime > 0) {
      interval = setInterval(() => {
        setRemainingTime((time) => {
          if (time <= 1) {
            setIsActive(false);
            onTimeout();
            toast({
              title: "Reserva cancelada",
              description: "El tiempo de reserva ha expirado.",
              variant: "destructive",
            });
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, remainingTime, onTimeout, toast]);

  const startTimer = () => {
    setRemainingTime(initialTimeInMinutes * 60);
    setIsActive(true);
  };

  const stopTimer = () => {
    setIsActive(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    remainingTime,
    isActive,
    startTimer,
    stopTimer,
    formatTime,
  };
};
