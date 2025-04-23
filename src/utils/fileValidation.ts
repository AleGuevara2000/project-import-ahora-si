
const MAX_FILE_SIZE_MB = 50;

export const formatExtensionMap: Record<string, string[]> = {
  'PDF': ['pdf'],
  'EPUB': ['epub'],
  'MOBI': ['mobi', 'azw', 'azw3'],
  'HTML': ['html', 'htm']
};

export const validateFileFormat = (file: File, formato: string): string | null => {
  const fileExt = file.name.split('.').pop()?.toLowerCase();
  const validExtensions = formatExtensionMap[formato] || [];
  
  if (!fileExt || !validExtensions.includes(fileExt)) {
    return `El formato del archivo (.${fileExt}) no coincide con el formato seleccionado (${formato})`;
  }
  return null;
};

export const validateFileSize = (file: File): string | null => {
  const fileSizeMB = file.size / (1024 * 1024);
  if (fileSizeMB > MAX_FILE_SIZE_MB) {
    return `El archivo excede el límite de ${MAX_FILE_SIZE_MB}MB permitido`;
  }
  return null;
};

export const getFormattedSize = (bytes: number): number => {
  return Number((bytes / (1024 * 1024)).toFixed(2));
};
