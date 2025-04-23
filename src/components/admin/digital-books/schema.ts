
import { z } from 'zod';

export const uploadFormSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  file: z.instanceof(File).refine(
    (file) => file.size <= 50 * 1024 * 1024, 
    `El archivo debe ser menor a 50MB`
  ),
  resumen: z.string().optional(),
});

export type UploadDigitalBookFormData = z.infer<typeof uploadFormSchema>;

// Esquema para edición de libros digitales
export const editDigitalBookSchema = z.object({
  formato: z.enum(['PDF', 'EPUB', 'MOBI', 'HTML'], {
    required_error: 'Debe seleccionar un formato',
  }),
  url: z.string()
    .url('Debe ser una URL válida')
    .refine(url => {
      // Verificar que la URL tiene una extensión de archivo
      const urlParts = url.split('.');
      return urlParts.length > 1 && urlParts[urlParts.length - 1].length > 0;
    }, 'La URL debe incluir la extensión del archivo'),
  resumen: z.string().optional(),
});

export type EditDigitalBookFormData = z.infer<typeof editDigitalBookSchema>;
