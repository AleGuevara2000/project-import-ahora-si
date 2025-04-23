
import { createBucketIfNotExists } from '@/utils/supabaseStorage';

export const createThesisStorageBucket = async (): Promise<void> => {
  try {
    await createBucketIfNotExists('thesis-files');
    console.log('Bucket de almacenamiento thesis-files verificado/creado');
  } catch (error) {
    console.error('Error al crear bucket de almacenamiento:', error);
  }
};
