
import { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { UploadDigitalBookFormData } from '@/components/admin/digital-books/schema';

interface UseFileSelectionProps {
  form: UseFormReturn<UploadDigitalBookFormData>;
  setIsFileSelected: (value: boolean) => void;
  setSelectedFileName: (value: string | null) => void;
  setSelectedFileSize: (value: number | undefined) => void;
  setFileError: (value: string | null) => void;
}

export function useFileSelection({
  form,
  setIsFileSelected,
  setSelectedFileName,
  setSelectedFileSize,
  setFileError,
}: UseFileSelectionProps) {
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError(null);
    
    if (file) {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const formatExtMap: Record<string, string[]> = {
        'PDF': ['pdf'],
        'EPUB': ['epub'],
        'MOBI': ['mobi', 'azw', 'azw3'],
        'HTML': ['html', 'htm']
      };
      
      const selectedFormat = form.getValues('formato');
      const validExtensions = formatExtMap[selectedFormat] || [];
      
      if (fileExt && !validExtensions.includes(fileExt)) {
        setFileError(`El formato del archivo (.${fileExt}) no coincide con el formato seleccionado (${selectedFormat})`);
        return;
      }
      
      form.setValue('file', file);
      setIsFileSelected(true);
      setSelectedFileName(file.name);
      setSelectedFileSize(file.size);
    } else {
      form.setValue('file', undefined);
      setIsFileSelected(false);
      setSelectedFileName(null);
      setSelectedFileSize(undefined);
    }
  }, [form, setIsFileSelected, setSelectedFileName, setSelectedFileSize, setFileError]);

  return handleFileSelect;
}
