
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { canSkipAuthForLibraryActions } from '@/lib/user-utils';
import { createBucketIfNotExists } from '@/utils/supabaseStorage';

export const useThesisUploadHelpers = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const uploadThesisFile = async (
    file: File,
    setUploadProgress: React.Dispatch<React.SetStateAction<number>>,
    setIsUploading: (val: boolean) => void
  ): Promise<string> => {
    setIsUploading(true);
    setUploadProgress(0);

    // Validar tipo PDF
    if (!file.type.includes('pdf')) {
      setIsUploading(false);
      throw new Error('El archivo debe ser un PDF');
    }

    const { data: authData } = await supabase.auth.getSession();

    // Permitir si es admin o bibliotecario, o si se puede omitir autenticación
    const skipAuth = canSkipAuthForLibraryActions(user);
    if (!authData.session && !skipAuth) {
      setIsUploading(false);
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para subir archivos",
        variant: "destructive"
      });
      throw new Error('Debes iniciar sesión para subir archivos');
    }

    // Intentar crear bucket si no existe
    try {
      await createBucketIfNotExists('thesis-files');
    } catch (error) {
      console.warn('Error al verificar bucket:', error);
      // Continuamos incluso si no podemos crear el bucket
    }

    const fileExt = file.name.split('.').pop();
    const fileName = `thesis-${Date.now()}.${fileExt}`;

    // Simular progreso
    const progressInterval = setInterval(() => {
      setUploadProgress((prev: number) => Math.min(prev + 10, 90));
    }, 500);

    try {
      const { data, error } = await supabase.storage
        .from('thesis-files')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: true
        });

      clearInterval(progressInterval);

      if (error) {
        throw new Error(`Error subiendo el archivo: ${error.message}`);
      }

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('thesis-files')
        .getPublicUrl(data?.path || fileName);

      if (!publicUrl) {
        throw new Error('No se pudo obtener la URL pública del archivo');
      }

      setUploadProgress(100);
      return publicUrl;
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'No se pudo subir el archivo',
        variant: 'destructive'
      });
      throw error;
    } finally {
      setIsUploading(false);
      clearInterval(progressInterval);
    }
  };

  const deleteThesisFile = async (fileUrl: string) => {
    const { data: authData } = await supabase.auth.getSession();

    // Permitir si es admin o bibliotecario, o si se puede omitir autenticación
    const skipAuth = canSkipAuthForLibraryActions(user);
    if (!authData.session && !skipAuth) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para eliminar archivos",
        variant: "destructive"
      });
      throw new Error('Debes iniciar sesión para eliminar archivos');
    }

    // Extraer nombre
    const fileName = fileUrl.split('/').pop();
    if (!fileName) {
      throw new Error('No se pudo obtener el nombre del archivo');
    }

    const { error } = await supabase.storage
      .from('thesis-files')
      .remove([fileName]);
    if (error) {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar el archivo',
        variant: 'destructive'
      });
      throw new Error(`Error eliminando el archivo: ${error.message}`);
    }
    // Si no hay error, todo bien
  };

  return {
    uploadThesisFile,
    deleteThesisFile
  };
};
