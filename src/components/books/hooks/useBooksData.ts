
import { useState, useEffect } from "react";
import { Book, mockBooks } from "@/types/book";
import { mockDigitalBooks } from "@/types/digitalBook";
import { supabase } from "@/integrations/supabase/client";

/**
 * Handles fetching data for books and digitalBooks from Supabase.  
 * Falls back to mocks on error.
 */
export function useBooksData() {
  const [books, setBooks] = useState<Book[]>([]);
  const [digitalBooks, setDigitalBooks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      setIsLoading(true);
      try {
        const { data: booksData, error: booksError } = await supabase
          .from("books")
          .select("*");
        if (booksError) throw booksError;
        if (isMounted) {
          setBooks(
            (booksData ?? []).map((item: any) => ({
              id: item.id,
              titulo: item.titulo,
              autor: item.autor,
              isbn: item.isbn,
              categoria: item.categoria,
              editorial: item.editorial,
              anioPublicacion: item.anio_publicacion,
              copias: item.copias,
              disponibles: item.disponibles,
              imagen: item.imagen ?? undefined,
              ubicacion: item.ubicacion,
              descripcion: item.descripcion ?? undefined,
              archivo: item.archivo ?? null,
            }))
          );
        }

        const { data: digitalBooksData, error: digitalError } = await supabase
          .from("digital_books")
          .select("book_id");
        if (digitalError) throw digitalError;
        if (isMounted) {
          setDigitalBooks(
            (digitalBooksData ?? []).map((item: any) => item.book_id)
          );
        }
      } catch (error) {
        setBooks([...mockBooks]);
        setDigitalBooks(mockDigitalBooks.map((db) => db.bookId));
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  return { books, setBooks, digitalBooks, setDigitalBooks, isLoading, setIsLoading };
}
