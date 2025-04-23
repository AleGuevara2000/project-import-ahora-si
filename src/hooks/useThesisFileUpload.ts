
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useThesisUploadHelpers } from './useThesisUploadHelpers';
import { useSaveThesisWithFile } from './useSaveThesisWithFile';

export const useThesisFileUpload = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const { toast } = useToast();

  // Helpers: subir/eliminar archivos
  const { uploadThesisFile, deleteThesisFile } = useThesisUploadHelpers();

  // Guardar tesis + archivo
  const { saveThesisWithFile } = useSaveThesisWithFile(setUploadProgress, setIsUploading);

  // Comprobación de sesión, sólo para efectos de UI
  const [sessionChecked, setSessionChecked] = useState(false);

  useEffect(() => {
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data }) => {
        setSessionChecked(!!data.session);
      });
    });
  }, []);

  return {
    uploadThesisFile: async (file: File) => uploadThesisFile(file, setUploadProgress, setIsUploading),
    deleteThesisFile,
    saveThesisWithFile,
    isUploading,
    uploadProgress,
    sessionChecked
  };
};
