import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { Book } from '@/types';
import { validateUploadableFile, generateDigitalBookFileName } from './use-digital-book-upload/file-validation';
import { uploadDigitalBookFile } from './use-digital-book-upload/storage-upload';
import { getFormattedSize } from '@/utils/fileValidation';
import { saveDigitalBook } from '@/lib/db';
import { useUploadAuthCheck } from './use-digital-book-upload/useUploadAuthCheck';
import { useUploadProgressSimulation } from './use-digital-book-upload/useUploadProgressSimulation';

export * from './use-digital-book-upload/file-validation';

export function useDigitalBookUpload(
  book: Book, 
  onUploadComplete: (data: {
    formato: string;
    url: string;
    tamanioMb: number;
    resumen?: string;
    storage_path?: string;
  }) => void
) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [currentFile, setCurrentFile] = useState<File | null>(null);
  const [currentFormat, setCurrentFormat] = useState<string | null>(null);
  const [currentResumen, setCurrentResumen] = useState<string | undefined>(undefined);

  const { checkUploadAuth } = useUploadAuthCheck();
  const simulateProgress = useUploadProgressSimulation(setUploadProgress);

  const handleRetry = useCallback(() => {
    if (currentFile && currentFormat) {
      handleUpload(currentFile, currentFormat, currentResumen);
    } else {
      setUploadError("No hay archivo para reintentar la carga");
      toast({
        title: "Error",
        description: "No hay archivo para reintentar la carga",
        variant: "destructive"
      });
    }
  }, [currentFile, currentFormat, currentResumen]);

  const handleUpload = async (file: File, formato: string, resumen?: string) => {
    try {
      const hasAuth = await checkUploadAuth();
      if (!hasAuth) {
        setUploadError("Debes iniciar sesión para subir archivos");
        return false;
      }

      setCurrentFile(file);
      setCurrentFormat(formato);
      setCurrentResumen(resumen);

      setUploadError(null);
      console.log('Starting upload process for:', file.name);

      const validationResult = validateUploadableFile(file, formato, book);
      if (!validationResult.isValid) {
        console.error('Validation failed:', validationResult.error);
        setUploadError(validationResult.error || "El archivo no cumple con los requisitos");
        toast({
          title: "Error de validación",
          description: validationResult.error || "El archivo no cumple con los requisitos",
          variant: "destructive"
        });
        return false;
      }

      setIsUploading(true);
      setUploadProgress(10);

      const fileName = generateDigitalBookFileName(book, file);

      const stopProgressSimulation = simulateProgress();

      try {
        const { publicUrl, error } = await uploadDigitalBookFile('digital-books', fileName, file);

        stopProgressSimulation();

        if (error && !publicUrl) {
          setUploadError(error instanceof Error ? error.message : String(error));
          setUploadProgress(0);
          toast({
            title: "Error",
            description: "No se pudo guardar el archivo digital: " + (error instanceof Error ? error.message : String(error)),
            variant: "destructive"
          });
          return false;
        }

        if (!publicUrl) {
          setUploadError("No se pudo obtener la URL del archivo subido");
          setUploadProgress(0);
          toast({
            title: "Error",
            description: "No se pudo obtener la URL del archivo subido.",
            variant: "destructive"
          });
          return false;
        }

        setUploadProgress(100);

        try {
          const digitalBookData = {
            bookId: book.id,
            formato: formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML',
            url: publicUrl,
            tamanioMb: getFormattedSize(file.size),
            fechaSubida: new Date(),
            resumen: resumen,
            storage_path: fileName
          };

          const savedDigitalBook = await saveDigitalBook(digitalBookData);

          onUploadComplete({
            formato,
            url: publicUrl,
            tamanioMb: getFormattedSize(file.size),
            resumen,
            storage_path: fileName
          });

          toast({
            title: "Archivo digital guardado",
            description: "Se ha guardado el archivo digital correctamente."
          });
        } catch (dbError) {
          setUploadError(dbError instanceof Error ? dbError.message : 'Error guardando en la base de datos');
          toast({
            title: "Error",
            description: "Se subió el archivo pero hubo un error al guardar en la base de datos: " +
              (dbError instanceof Error ? dbError.message : 'Error desconocido'),
            variant: "destructive"
          });
          return false;
        }

        setTimeout(() => {
          setUploadError(null);
          setUploadProgress(0);
          setCurrentFile(null);
          setCurrentFormat(null);
          setCurrentResumen(undefined);
        }, 3000);

        return true;
      } catch (uploadError) {
        stopProgressSimulation();
        throw new Error(`Error en la carga: ${uploadError instanceof Error ? uploadError.message : 'Error desconocido'}`);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Error inesperado durante la carga");
      setUploadProgress(0);
      toast({
        title: "Error",
        description: "No se pudo guardar el archivo digital: " +
          (error instanceof Error ? error.message : "Error inesperado"),
        variant: "destructive"
      });

      return false;
    } finally {
      setIsUploading(false);
    }
  };

  return {
    isUploading,
    uploadProgress,
    uploadError,
    handleUpload,
    handleRetry
  };
}
