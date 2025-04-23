
import { useToast } from '@/hooks/use-toast';
import { useThesisUploadHelpers } from './useThesisUploadHelpers';
import type { Thesis } from '@/types';
import { saveThesis } from '@/lib/theses-db';
import { useAuth } from '@/contexts/AuthContext';
import { canSkipAuthForLibraryActions } from '@/lib/user-utils';

export const useSaveThesisWithFile = (
  setUploadProgress: (val: number) => void,
  setIsUploading: (val: boolean) => void
) => {
  const { toast } = useToast();
  const { uploadThesisFile, deleteThesisFile } = useThesisUploadHelpers();
  const { user } = useAuth();

  const saveThesisWithFile = async (thesis: Partial<Thesis>, file?: File): Promise<Thesis> => {
    const { data: authData } = await import("@/integrations/supabase/client").then(m => m.supabase.auth.getSession());

    // Verificar permisos incluso sin sesión (para demo o casos especiales)
    if (!authData.session && !canSkipAuthForLibraryActions(user)) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para guardar tesis",
        variant: "destructive"
      });
      throw new Error('Debes iniciar sesión para guardar tesis');
    }

    let publicUrl = thesis.archivoPdf || null;
    // Subir nuevo archivo si es necesario
    if (file) {
      try {
        publicUrl = await uploadThesisFile(file, setUploadProgress, setIsUploading);
      } catch (uploadError: any) {
        throw new Error(uploadError?.message || 'Error subiendo archivo');
      }
    }

    // Guardar en base de datos
    const thesisToSave: Thesis = {
      id: thesis.id || '',
      titulo: thesis.titulo || '',
      autor: thesis.autor || '',
      carrera: thesis.carrera || '',
      anio: thesis.anio || new Date().getFullYear(),
      director: thesis.director || '',
      tipo: thesis.tipo as 'Licenciatura' | 'Maestría' | 'Doctorado',
      disponible: thesis.disponible !== false,
      resumen: thesis.resumen,
      archivoPdf: publicUrl
    };

    try {
      const savedThesis = await saveThesis(thesisToSave);
      return savedThesis;
    } catch (dbError: any) {
      if (file && publicUrl) {
        try { await deleteThesisFile(publicUrl); } catch { /* silent */ }
      }
      toast({
        title: 'Error',
        description: dbError instanceof Error ? dbError.message : 'No se pudo guardar la tesis con el archivo',
        variant: 'destructive'
      });
      throw dbError;
    }
  };

  return { saveThesisWithFile };
};
