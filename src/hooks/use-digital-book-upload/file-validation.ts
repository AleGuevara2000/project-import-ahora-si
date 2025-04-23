
import { useState, useCallback } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { validateFileFormat, validateFileSize, getFormattedSize } from '@/utils/fileValidation';
import { toast } from '@/hooks/use-toast';
import { Book } from '@/types';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const ALLOWED_FILE_TYPES = ['application/pdf', 'application/epub+zip', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

// Esta función ahora recibe user (o roles), o bien podemos obtener el user dentro del hook usando useAuth.
export function useFileValidation() {
  const { user } = useAuth();

  function validateFile(file: File): string | null {
    // Si el usuario es admin o bibliotecario, no validamos nada.
    if (user?.role === "administrador" || user?.role === "bibliotecario") {
      return null; // Sin restricción
    }

    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return "Tipo de archivo no permitido. Solo se permiten archivos PDF, EPUB, TXT y DOC/DOCX.";
    }

    if (file.size > MAX_FILE_SIZE) {
      return "El archivo es demasiado grande. El tamaño máximo permitido es de 50MB.";
    }

    return null;
  }

  return {
    validateFile,
  };
}

// Función para validar archivos que serán subidos
export const validateUploadableFile = (
  file: File, 
  formato: string, 
  book: { id: string }
): { isValid: boolean; error?: string } => {
  const formatError = validateFileFormat(file, formato);
  if (formatError) {
    toast({
      title: "Formato incorrecto",
      description: formatError,
      variant: "destructive"
    });
    return { isValid: false, error: formatError };
  }

  const sizeError = validateFileSize(file);
  if (sizeError) {
    toast({
      title: "Error de tamaño",
      description: sizeError,
      variant: "destructive"
    });
    return { isValid: false, error: sizeError };
  }

  return { isValid: true };
};

// Función para generar un nombre de archivo único
export const generateDigitalBookFileName = (book: { id: string }, file: File) => {
  return `book-${book.id}-${Date.now()}.${file.name.split('.').pop()}`;
};
