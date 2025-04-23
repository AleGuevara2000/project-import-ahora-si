
import { supabase } from '@/integrations/supabase/client';
import type { Book, BookCategory } from '@/types';
import { mockBooks, mockCategories } from '@/types/book';

// Libros
export async function fetchBooks(): Promise<Book[]> {
  try {
    // TODO: Utilizar Supabase cuando las tablas estén listas
    return Promise.resolve([...mockBooks]);
  } catch (error) {
    console.error('Error fetching books:', error);
    return [];
  }
}

// Categorías
export async function fetchCategories(): Promise<BookCategory[]> {
  try {
    // TODO: Utilizar Supabase cuando las tablas estén listas
    return Promise.resolve([...mockCategories]);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
}
