
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface PenalizacionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (dias: number, razon: string) => void;
  nombreUsuario: string;
}

const PenalizacionDialog = ({ isOpen, onClose, onConfirm, nombreUsuario }: PenalizacionDialogProps) => {
  const [dias, setDias] = React.useState<number>(0);
  const [razon, setRazon] = React.useState<string>('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dias <= 0) {
      toast({
        title: "Error",
        description: "Los días de penalización deben ser mayores a 0",
        variant: "destructive",
      });
      return;
    }
    if (!razon.trim()) {
      toast({
        title: "Error",
        description: "Debe ingresar una razón para la penalización",
        variant: "destructive",
      });
      return;
    }
    onConfirm(dias, razon);
    setDias(0);
    setRazon('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Aplicar Penalización</DialogTitle>
          <DialogDescription>
            Asignar penalización a {nombreUsuario} por devolución tardía
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="dias">Días de penalización</Label>
            <Input
              id="dias"
              type="number"
              min="1"
              value={dias}
              onChange={(e) => setDias(parseInt(e.target.value) || 0)}
              placeholder="Número de días"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="razon">Razón de la penalización</Label>
            <Textarea
              id="razon"
              value={razon}
              onChange={(e) => setRazon(e.target.value)}
              placeholder="Describa el motivo de la penalización"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit">
              Aplicar Penalización
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PenalizacionDialog;
