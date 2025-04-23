
import { supabase } from '@/integrations/supabase/client';
import type { Prestamo } from '@/types';
import { mockPrestamos } from '@/types/prestamo';

export async function fetchLoans(): Promise<Prestamo[]> {
  try {
    // TODO: Utilizar Supabase cuando la tabla esté lista
    return Promise.resolve([...mockPrestamos]);
  } catch (error) {
    console.error('Error fetching loans:', error);
    return [];
  }
}
