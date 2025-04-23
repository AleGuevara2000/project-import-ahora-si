
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/types";
import { useToast } from "../use-toast";

export function useBookActions(toast: ReturnType<typeof useToast>["toast"], setBooks: React.Dispatch<React.SetStateAction<Book[]>>) {
  const handleDeleteBook = useCallback(async (bookId: string) => {
    try {
      const { error } = await supabase
        .from('books')
        .delete()
        .eq('id', bookId);

      if (error) {
        toast({
          title: "Error al eliminar libro",
          description: "No se pudo eliminar el libro. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      setBooks((prevBooks) => prevBooks.filter((book) => book.id !== bookId));
      toast({
        title: "Libro eliminado",
        description: "El libro ha sido eliminado exitosamente.",
      });
    } catch {
      toast({
        title: "Error al eliminar libro",
        description: "No se pudo eliminar el libro. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast, setBooks]);

  const handleEditBook = useCallback(async (bookId: string, updatedBook: Partial<Book>) => {
    try {
      const dbUpdatedBook: Record<string, any> = {};
      if ("anioPublicacion" in updatedBook) {
        dbUpdatedBook.anio_publicacion = updatedBook.anioPublicacion;
        delete updatedBook.anioPublicacion;
      }
      Object.entries(updatedBook).forEach(([key, value]) => {
        dbUpdatedBook[key] = value;
      });

      const { error } = await supabase
        .from('books')
        .update(dbUpdatedBook)
        .eq('id', bookId);

      if (error) {
        toast({
          title: "Error al editar libro",
          description: "No se pudo editar el libro. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      setBooks((prevBooks) =>
        prevBooks.map((book) =>
          book.id === bookId ? { ...book, ...updatedBook } : book
        )
      );
      toast({
        title: "Libro editado",
        description: "El libro ha sido editado exitosamente.",
      });
    } catch {
      toast({
        title: "Error al editar libro",
        description: "No se pudo editar el libro. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast, setBooks]);

  const handleAddBook = useCallback(async (newBook: Omit<Book, 'id'>) => {
    try {
      const dbNewBook: any = {
        titulo: newBook.titulo,
        autor: newBook.autor,
        isbn: newBook.isbn,
        categoria: newBook.categoria,
        editorial: newBook.editorial,
        anio_publicacion: newBook.anioPublicacion,
        copias: newBook.copias,
        disponibles: newBook.disponibles,
        ubicacion: newBook.ubicacion,
      };
      if (newBook.descripcion) dbNewBook.descripcion = newBook.descripcion;
      if (newBook.imagen) dbNewBook.imagen = newBook.imagen;

      const { data, error } = await supabase
        .from('books')
        .insert([dbNewBook])
        .select();

      if (error) {
        toast({
          title: "Error al agregar libro",
          description: "No se pudo agregar el libro. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      if (data && data.length > 0) {
        const addedBook: Book = {
          id: data[0].id,
          titulo: data[0].titulo,
          autor: data[0].autor,
          isbn: data[0].isbn,
          categoria: data[0].categoria,
          editorial: data[0].editorial,
          anioPublicacion: data[0].anio_publicacion,
          copias: data[0].copias,
          disponibles: data[0].disponibles,
          ubicacion: data[0].ubicacion,
          descripcion: data[0].descripcion || undefined,
          imagen: data[0].imagen || undefined,
        };
        setBooks((prevBooks) => [...prevBooks, addedBook]);
        toast({
          title: "Libro agregado",
          description: `El libro "${newBook.titulo}" ha sido agregado exitosamente.`,
        });
      }
    } catch {
      toast({
        title: "Error al agregar libro",
        description: "No se pudo agregar el libro. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast, setBooks]);

  return { handleDeleteBook, handleEditBook, handleAddBook };
}
