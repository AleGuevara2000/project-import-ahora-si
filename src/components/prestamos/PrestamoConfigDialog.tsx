
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { UserRole, PrestamoConfig } from '@/types';

interface PrestamoConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (configs: PrestamoConfig[]) => void;
  currentConfigs: PrestamoConfig[];
}

const PrestamoConfigDialog = ({ isOpen, onClose, onSave, currentConfigs }: PrestamoConfigDialogProps) => {
  const [configs, setConfigs] = React.useState<PrestamoConfig[]>(currentConfigs);
  const { toast } = useToast();
  const isMobile = useIsMobile();

  // Type-safe helper function to cast role string to UserRole
  const handleInputChange = (role: UserRole, field: 'diasPrestamo' | 'maxLibros', value: number) => {
    setConfigs(prev => 
      prev.map(config => 
        config.role === role 
          ? { ...config, [field]: value } 
          : config
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all values are positive numbers
    const hasInvalidValues = configs.some(
      config => config.diasPrestamo <= 0 || config.maxLibros <= 0
    );

    if (hasInvalidValues) {
      toast({
        title: "Error",
        description: "Todos los valores deben ser números positivos",
        variant: "destructive",
      });
      return;
    }

    onSave(configs);
    toast({
      title: "Configuración actualizada",
      description: "Los cambios han sido guardados correctamente",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isMobile ? 'w-[95vw] max-w-none p-4' : 'max-w-2xl p-6'}`}>
        <DialogHeader>
          <DialogTitle className="text-xl md:text-2xl">
            Configuración de Préstamos por Rol
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {configs.map((config) => (
              <div 
                key={config.role} 
                className="space-y-3 p-3 md:p-4 border rounded-lg bg-background/50 hover:bg-background/80 transition-colors"
              >
                <h3 className="font-semibold capitalize text-sm md:text-base">
                  {config.role}
                </h3>
                <div className="space-y-2">
                  <Label 
                    htmlFor={`dias-${config.role}`}
                    className="text-xs md:text-sm"
                  >
                    Días de préstamo
                  </Label>
                  <Input
                    id={`dias-${config.role}`}
                    type="number"
                    min="1"
                    value={config.diasPrestamo}
                    onChange={(e) => handleInputChange(config.role, 'diasPrestamo', parseInt(e.target.value) || 0)}
                    className="text-sm md:text-base h-8 md:h-10"
                  />
                </div>
                <div className="space-y-2">
                  <Label 
                    htmlFor={`libros-${config.role}`}
                    className="text-xs md:text-sm"
                  >
                    Máximo de libros
                  </Label>
                  <Input
                    id={`libros-${config.role}`}
                    type="number"
                    min="1"
                    value={config.maxLibros}
                    onChange={(e) => handleInputChange(config.role, 'maxLibros', parseInt(e.target.value) || 0)}
                    className="text-sm md:text-base h-8 md:h-10"
                  />
                </div>
              </div>
            ))}
          </div>
          <DialogFooter className="sm:justify-end gap-2 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              className="w-full sm:w-auto text-sm"
            >
              Cancelar
            </Button>
            <Button 
              type="submit"
              className="w-full sm:w-auto text-sm"
            >
              Guardar cambios
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PrestamoConfigDialog;
