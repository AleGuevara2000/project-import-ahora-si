import { useCallback, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { Book, BookCategory } from '@/types';
import { mockBooks, mockCategories } from '@/types/book';
import { DigitalBook } from '@/types/digitalBook';
import { mockDigitalBooks } from '@/types/digitalBook';
import { useBooksData } from '@/components/books/hooks/useBooksData';
import { useBooksRealtime } from '@/components/books/hooks/useBooksRealtime';
import { useBookActions } from './books/useBookActions';
import { useCategoryActions } from './books/useCategoryActions';
import { useDigitalBookActions } from './books/useDigitalBookActions';

export const useBooksManagement = () => {
  const { toast } = useToast();
  const { books: initialBooks, digitalBooks: initialDigitalBooks, setBooks, setDigitalBooks } = useBooksData();
  const [books, setLocalBooks] = useState<Book[]>([]);
  const [digitalBooks, setLocalDigitalBooks] = useState<DigitalBook[]>([]);
  const [categories, setCategories] = useState<BookCategory[]>([]);
  useBooksRealtime(setBooks, setDigitalBooks);

  useEffect(() => {
    if (initialBooks.length > 0) setLocalBooks(initialBooks);

    const fetchDigitalBooks = async () => {
      try {
        const { data, error } = await supabase.from('digital_books').select('*');
        if (error) throw error;

        if (data && data.length > 0) {
          const mappedDigitalBooks = data.map(item => ({
            id: item.id,
            bookId: item.book_id,
            formato: item.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML',
            url: item.url,
            tamanioMb: item.tamanio_mb,
            fechaSubida: new Date(item.fecha_subida),
            resumen: item.resumen || undefined,
            storage_path: item.storage_path || undefined
          }));
          setLocalDigitalBooks(mappedDigitalBooks);
        } else {
          setLocalDigitalBooks(mockDigitalBooks);
        }
      } catch (error) {
        setLocalDigitalBooks(mockDigitalBooks);
      }
    };

    const fetchCategories = async () => {
      try {
        const uniqueCategories = [...new Set(initialBooks.map(book => book.categoria))];
        const mappedCategories = uniqueCategories.map((category, index) => ({
          id: index.toString(),
          nombre: category,
          descripcion: `Categoría para libros de ${category}`
        }));

        setCategories(mappedCategories.length > 0 ? mappedCategories : mockCategories);
      } catch {
        setCategories(mockCategories);
      }
    };

    fetchDigitalBooks();
    fetchCategories();
  }, [initialBooks, initialDigitalBooks]);

  const bookActions = useBookActions(toast, setLocalBooks);
  const categoryActions = useCategoryActions(toast, setCategories);
  const digitalBookActions = useDigitalBookActions(toast, setLocalDigitalBooks);

  return {
    books,
    categories,
    digitalBooks,
    ...categoryActions,
    ...bookActions,
    ...digitalBookActions,
  };
};
