
import { supabase } from '@/integrations/supabase/client';
import type { Thesis } from '@/types';
import { canSkipAuthForLibraryActions } from '@/lib/user-utils';

// Auxiliary function to check UUID format
function isValidUUID(id: string): boolean {
  const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidPattern.test(id);
}

export async function saveThesis(thesis: Thesis): Promise<Thesis> {
  try {
    const { data: authData, error: authError } = await supabase.auth.getSession();

    if (authError) {
      console.error('Error checking authentication:', authError);
      throw new Error(`Error de autenticación: ${authError.message}`);
    }

    // Si no hay sesión, verificar si se puede omitir autenticación para acciones de biblioteca
    const skipAuth = await import('@/contexts/AuthContext').then(
      async m => {
        const { useAuth } = m;
        const { user } = useAuth();
        return canSkipAuthForLibraryActions(user);
      }
    ).catch(() => false);

    if (!authData.session && !skipAuth) {
      console.error('No session found and cannot skip auth');
      throw new Error('Debes iniciar sesión para guardar tesis');
    }

    const thesisData = {
      titulo: thesis.titulo,
      autor: thesis.autor,
      carrera: thesis.carrera,
      anio: thesis.anio,
      director: thesis.director,
      tipo: thesis.tipo,
      disponible: thesis.disponible,
      resumen: thesis.resumen,
      archivo_pdf: thesis.archivoPdf,
      updated_at: new Date().toISOString()
    };

    let result;

    if (thesis.id && thesis.id.length > 0 && thesis.id !== 'new') {
      if (!isValidUUID(thesis.id)) {
        // Insert new thesis
        const dataToInsert = { ...thesisData, created_at: new Date().toISOString() };
        const { data, error } = await supabase
          .from('theses')
          .insert([dataToInsert])
          .select()
          .single();
        if (error) throw new Error(`Error creando tesis: ${error.message}`);
        if (!data) throw new Error('No se pudo crear la tesis, respuesta vacía del servidor');
        result = data;
      } else {
        // Update existing thesis
        const { data, error } = await supabase
          .from('theses')
          .update(thesisData)
          .eq('id', thesis.id)
          .select()
          .single();
        if (error) throw new Error(`Error actualizando tesis: ${error.message}`);
        if (!data) throw new Error(`No se encontró la tesis con ID: ${thesis.id}`);
        result = data;
      }
    } else {
      // Insert new thesis
      const dataToInsert = { ...thesisData, created_at: new Date().toISOString() };
      const { data, error } = await supabase
        .from('theses')
        .insert([dataToInsert])
        .select()
        .single();
      if (error) throw new Error(`Error creando tesis: ${error.message}`);
      if (!data) throw new Error('No se pudo crear la tesis, respuesta vacía del servidor');
      result = data;
    }

    return {
      id: result.id,
      titulo: result.titulo,
      autor: result.autor,
      carrera: result.carrera,
      anio: result.anio,
      director: result.director,
      tipo: result.tipo as 'Licenciatura' | 'Maestría' | 'Doctorado',
      disponible: result.disponible,
      resumen: result.resumen,
      archivoPdf: result.archivo_pdf
    };
  } catch (error) {
    console.error('Error saving thesis:', error);
    const message = error instanceof Error ? error.message : JSON.stringify(error);
    throw new Error(`Error al guardar la tesis: ${message}`);
  }
}
