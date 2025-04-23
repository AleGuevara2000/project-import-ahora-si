
import { supabase } from '@/integrations/supabase/client';
import type { Thesis } from '@/types';
import { mockTheses } from '@/types/thesis';

export async function fetchTheses(): Promise<Thesis[]> {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const { data, error } = await supabase
      .from('theses')
      .select('*');

    if (error) {
      console.error('Error from Supabase:', error);
      throw new Error(`Error al obtener las tesis: ${error.message}`);
    }

    if (!data || data.length === 0) {
      console.log('No se encontraron tesis en la base de datos, usando datos de ejemplo');
      return [...mockTheses];
    }

    return data.map((thesis: any) => ({
      id: thesis.id || '',
      titulo: thesis.titulo || '',
      autor: thesis.autor || '',
      carrera: thesis.carrera || '',
      anio: thesis.anio || 0,
      director: thesis.director || '',
      tipo: (thesis.tipo as 'Licenciatura' | 'Maestría' | 'Doctorado') || 'Licenciatura',
      disponible: thesis.disponible !== false,
      resumen: thesis.resumen,
      archivoPdf: thesis.archivo_pdf
    }));
  } catch (error) {
    console.error('Error fetching theses:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    console.warn(`Usando datos de ejemplo debido a error: ${errorMessage}`);
    return [...mockTheses];
  }
}
