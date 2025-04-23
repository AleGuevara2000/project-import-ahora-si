
import { supabase } from '@/integrations/supabase/client';
import type { DigitalBook } from '@/types/digitalBook';
import { mockDigitalBooks } from '@/types/digitalBook';

// Obtener libros digitales
export async function fetchDigitalBooks(): Promise<DigitalBook[]> {
  try {
    const { data, error } = await supabase
      .from('digital_books')
      .select('*');
    if (error) {
      throw error;
    }
    if (!data || data.length === 0) {
      return [...mockDigitalBooks];
    }
    return data.map((digitalBook) => ({
      id: digitalBook.id || '',
      bookId: digitalBook.book_id || '',
      formato: (digitalBook.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML') || 'PDF',
      url: digitalBook.url || '',
      tamanioMb: Number(digitalBook.tamanio_mb) || 0,
      fechaSubida: new Date(digitalBook.fecha_subida),
      resumen: digitalBook.resumen,
      storage_path: digitalBook.storage_path
    }));
  } catch (error) {
    console.error('Error fetching digital books:', error);
    return [...mockDigitalBooks];
  }
}

// Guardar (insert/update) libro digital
export async function saveDigitalBook(digitalBook: Partial<DigitalBook>): Promise<DigitalBook> {
  try {
    const digitalBookData = {
      book_id: digitalBook.bookId,
      formato: digitalBook.formato,
      url: digitalBook.url,
      tamanio_mb: digitalBook.tamanioMb,
      fecha_subida: digitalBook.fechaSubida ? digitalBook.fechaSubida.toISOString() : new Date().toISOString(),
      resumen: digitalBook.resumen,
      storage_path: digitalBook.storage_path
    };
    let result;
    if (digitalBook.id) {
      const { data, error } = await supabase
        .from('digital_books')
        .update(digitalBookData)
        .eq('id', digitalBook.id)
        .select()
        .single();
      if (error) throw error;
      result = data;
    } else {
      const { data, error } = await supabase
        .from('digital_books')
        .insert([digitalBookData])
        .select()
        .single();
      if (error) throw error;
      result = data;
    }
    return {
      id: result.id,
      bookId: result.book_id,
      formato: result.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML',
      url: result.url,
      tamanioMb: Number(result.tamanio_mb),
      fechaSubida: new Date(result.fecha_subida),
      resumen: result.resumen,
      storage_path: result.storage_path
    };
  } catch (error) {
    console.error('Error saving digital book:', error);
    throw error;
  }
}

export async function deleteDigitalBook(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('digital_books')
      .delete()
      .eq('id', id);
    if (error) throw error;
  } catch (error) {
    console.error('Error deleting digital book:', error);
    throw error;
  }
}
