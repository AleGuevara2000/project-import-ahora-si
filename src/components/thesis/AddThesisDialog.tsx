
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Thesis } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { ThesisForm } from './ThesisForm';
import { useThesisFileUpload } from '@/hooks/useThesisFileUpload';
import { useAuth } from '@/contexts/AuthContext';

interface AddThesisDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onThesisAdded: (thesis: Thesis) => void;
}

const AddThesisDialog = ({ open, onOpenChange, onThesisAdded }: AddThesisDialogProps) => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const { saveThesisWithFile, isUploading, uploadProgress } = useThesisFileUpload();
  const [nuevaTesis, setNuevaTesis] = useState<Partial<Thesis>>({
    titulo: '',
    autor: '',
    carrera: '',
    anio: new Date().getFullYear(),
    director: '',
    tipo: 'Licenciatura',
    disponible: true
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleChange = (field: string, value: any) => {
    setNuevaTesis(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para agregar tesis.",
        variant: "destructive"
      });
      return;
    }

    if (!nuevaTesis.titulo || !nuevaTesis.autor || !nuevaTesis.carrera || !nuevaTesis.director) {
      toast({
        title: "Error",
        description: "Por favor completa los campos obligatorios",
        variant: "destructive"
      });
      return;
    }

    if (!selectedFile) {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo PDF de la tesis",
        variant: "destructive"
      });
      return;
    }

    try {
      // Guardamos la tesis y el archivo en la base de datos
      const savedThesis = await saveThesisWithFile(nuevaTesis, selectedFile);
      
      onThesisAdded(savedThesis);
      onOpenChange(false);
      
      setNuevaTesis({
        titulo: '',
        autor: '',
        carrera: '',
        anio: new Date().getFullYear(),
        director: '',
        tipo: 'Licenciatura',
        disponible: true
      });
      setSelectedFile(null);
      
      toast({
        title: "Tesis agregada",
        description: "La tesis ha sido agregada correctamente al catálogo."
      });
    } catch (error) {
      console.error('Error al subir tesis:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo guardar la tesis.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Agregar nueva tesis</DialogTitle>
          <DialogDescription>
            Ingresa la información de la nueva tesis.
          </DialogDescription>
        </DialogHeader>
        
        <ThesisForm
          thesis={nuevaTesis}
          onFileChange={setSelectedFile}
          onChange={handleChange}
          selectedFile={selectedFile}
          uploadProgress={isUploading ? uploadProgress : 0}
        />
        
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isUploading}
          >
            {isUploading ? 'Subiendo...' : 'Agregar tesis'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddThesisDialog;
