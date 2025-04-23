
import { supabase } from '@/integrations/supabase/client';

export const createBucketIfNotExists = async (bucketName: string): Promise<boolean> => {
  try {
    // Primero intentamos obtener el bucket para ver si existe
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    
    if (listError) {
      console.error('Error al listar buckets:', listError);
      throw new Error(`Error al listar buckets: ${listError.message}`);
    }
    
    // Verificar si el bucket ya existe en la lista
    const bucketExists = buckets?.some(bucket => bucket.name === bucketName);
    
    if (bucketExists) {
      console.log(`Bucket "${bucketName}" ya existe`);
      return true;
    }
    
    console.log(`Bucket "${bucketName}" no encontrado en la lista, pero asumiremos que existe en el servidor`);
    return true;
  } catch (err) {
    console.error('Error al verificar/crear bucket:', err);
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    throw new Error(`Error al verificar bucket: ${message}`);
  }
};

export const uploadFile = async (bucketName: string, fileName: string, file: File) => {
  try {
    console.log(`Iniciando carga de archivo "${fileName}" al bucket "${bucketName}"`);
    
    // Primero verificamos que el bucket exista
    const bucketExists = await createBucketIfNotExists(bucketName);
    
    if (!bucketExists) {
      console.error(`Error: El bucket "${bucketName}" no pudo ser verificado`);
      throw new Error(`No se pudo acceder al bucket "${bucketName}"`);
    }
    
    // Realizar la carga del archivo
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error(`Error al cargar archivo "${fileName}":`, error);
      throw new Error(`Error al cargar archivo: ${error.message}`);
    }
    
    if (!data || !data.path) {
      throw new Error(`No se pudo cargar el archivo "${fileName}": respuesta vacía del servidor`);
    }
    
    console.log(`Archivo "${fileName}" cargado exitosamente:`, data);
    return { data, error: null };
  } catch (err) {
    console.error('Error en uploadFile:', err);
    return { 
      data: null, 
      error: err instanceof Error 
        ? err 
        : new Error(typeof err === 'object' && err !== null ? JSON.stringify(err) : 'Error desconocido al subir archivo') 
    };
  }
};

export const getPublicUrl = (bucketName: string, fileName: string): string => {
  try {
    if (!bucketName) {
      throw new Error('Nombre de bucket no proporcionado');
    }
    
    if (!fileName) {
      throw new Error('Nombre de archivo no proporcionado');
    }
    
    const { data } = supabase.storage.from(bucketName).getPublicUrl(fileName);
    
    if (!data || !data.publicUrl) {
      console.error(`No se pudo obtener URL pública para ${bucketName}/${fileName}`);
      throw new Error(`No se pudo obtener URL pública para ${fileName}`);
    }
    
    console.log(`URL pública obtenida: ${data.publicUrl}`);
    return data.publicUrl;
  } catch (error) {
    console.error('Error al obtener URL pública:', error);
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Error al obtener URL pública: ${message}`);
  }
};

export const deleteFile = async (bucketName: string, fileName: string) => {
  try {
    console.log(`Eliminando archivo "${fileName}" del bucket "${bucketName}"`);
    
    if (!bucketName) {
      throw new Error('Nombre de bucket no proporcionado');
    }
    
    if (!fileName) {
      throw new Error('Nombre de archivo no proporcionado');
    }
    
    const result = await supabase.storage.from(bucketName).remove([fileName]);
    
    if (result.error) {
      console.error(`Error al eliminar archivo "${fileName}":`, result.error);
      throw new Error(`Error al eliminar archivo: ${result.error.message}`);
    } else {
      console.log(`Archivo "${fileName}" eliminado exitosamente`);
    }
    
    return result;
  } catch (error) {
    console.error('Error en deleteFile:', error);
    return { 
      data: null, 
      error: error instanceof Error 
        ? error 
        : new Error(typeof error === 'object' && error !== null ? JSON.stringify(error) : 'Error desconocido al eliminar archivo')
    };
  }
};
