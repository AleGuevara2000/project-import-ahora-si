
import { supabase } from '@/integrations/supabase/client';
import { createBucketIfNotExists, uploadFile, getPublicUrl } from '@/utils/supabaseStorage';

export async function uploadDigitalBookFile(
  bucketName: string, 
  fileName: string, 
  file: File
): Promise<{ publicUrl: string | null; error: Error | null }> {
  try {
    // Asegurar que el bucket existe
    const bucketExists = await createBucketIfNotExists(bucketName);
    
    if (!bucketExists) {
      return { 
        publicUrl: null, 
        error: new Error(`No se pudo acceder al bucket "${bucketName}"`) 
      };
    }
    
    // Realizar la carga del archivo al Storage
    const { data, error } = await uploadFile(bucketName, fileName, file);
    
    if (error) {
      console.error('Error uploading file to Supabase Storage:', error);
      return { publicUrl: null, error };
    }
    
    // Obtener la URL pública del archivo
    const publicUrl = getPublicUrl(bucketName, fileName);
    
    if (!publicUrl) {
      return { 
        publicUrl: null, 
        error: new Error('No se pudo obtener la URL pública del archivo') 
      };
    }
    
    return { publicUrl, error: null };
  } catch (error) {
    console.error('Unexpected error in uploadDigitalBookFile:', error);
    return { 
      publicUrl: null, 
      error: error instanceof Error ? error : new Error('Error desconocido durante la carga') 
    };
  }
}
