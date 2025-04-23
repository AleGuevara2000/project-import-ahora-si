
import { useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DigitalBook } from "@/types/digitalBook";
import { useToast } from "../use-toast";

export function useDigitalBookActions(toast: ReturnType<typeof useToast>["toast"], setDigitalBooks: React.Dispatch<React.SetStateAction<DigitalBook[]>>) {
  const handleAddDigitalBook = useCallback(
    async (bookId: string, newDigitalBook: Omit<DigitalBook, "id" | "bookId" | "fechaSubida">) => {
      try {
        const dbNewDigitalBook = {
          book_id: bookId,
          formato: newDigitalBook.formato,
          url: newDigitalBook.url,
          tamanio_mb: newDigitalBook.tamanioMb,
          fecha_subida: new Date().toISOString(),
          resumen: newDigitalBook.resumen,
          storage_path: newDigitalBook.storage_path,
        };

        const { data, error } = await supabase
          .from("digital_books")
          .insert([dbNewDigitalBook])
          .select();

        if (error) {
          toast({
            title: "Error al agregar libro digital",
            description: "No se pudo agregar el libro digital. Intente nuevamente.",
            variant: "destructive",
          });
          return;
        }

        const insertedDigitalBook = data ? data[0] : null;

        if (insertedDigitalBook) {
          const newDigitalBookWithId: DigitalBook = {
            id: insertedDigitalBook.id,
            bookId: bookId,
            formato: insertedDigitalBook.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML',
            url: insertedDigitalBook.url,
            tamanioMb: insertedDigitalBook.tamanio_mb,
            fechaSubida: new Date(insertedDigitalBook.fecha_subida),
            resumen: insertedDigitalBook.resumen || undefined,
            storage_path: insertedDigitalBook.storage_path || undefined
          };
          setDigitalBooks((prev) => [...prev, newDigitalBookWithId]);
          toast({
            title: "Libro digital agregado",
            description: `El libro digital para el libro con ID "${bookId}" ha sido agregado exitosamente.`,
          });
        } else {
          toast({
            title: "Error al agregar libro digital",
            description: "No se pudo agregar el libro digital. Intente nuevamente.",
            variant: "destructive",
          });
        }
      } catch {
        toast({
          title: "Error al agregar libro digital",
          description: "No se pudo agregar el libro digital. Intente nuevamente.",
          variant: "destructive",
        });
      }
    },
    [toast, setDigitalBooks]
  );

  const handleDeleteDigitalBook = useCallback(async (digitalBookId: string) => {
    try {
      const { error } = await supabase
        .from("digital_books")
        .delete()
        .eq("id", digitalBookId);

      if (error) {
        toast({
          title: "Error al eliminar libro digital",
          description: "No se pudo eliminar el libro digital. Intente nuevamente.",
          variant: "destructive",
        });
        return;
      }

      setDigitalBooks((prev) =>
        prev.filter((digitalBook) => digitalBook.id !== digitalBookId)
      );
      toast({
        title: "Libro digital eliminado",
        description: "El libro digital ha sido eliminado exitosamente.",
      });
    } catch {
      toast({
        title: "Error al eliminar libro digital",
        description: "No se pudo eliminar el libro digital. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast, setDigitalBooks]);

  const handleEditDigitalBook = useCallback(
    async (digitalBookId: string, updatedDigitalBook: Partial<DigitalBook>) => {
      try {
        const dbUpdatedDigitalBook: Record<string, any> = {};
        if ("tamanioMb" in updatedDigitalBook)
          dbUpdatedDigitalBook.tamanio_mb = updatedDigitalBook.tamanioMb;
        if (
          "fechaSubida" in updatedDigitalBook &&
          updatedDigitalBook.fechaSubida instanceof Date
        )
          dbUpdatedDigitalBook.fecha_subida =
            updatedDigitalBook.fechaSubida.toISOString();
        if ("bookId" in updatedDigitalBook)
          dbUpdatedDigitalBook.book_id = updatedDigitalBook.bookId;
        if ("formato" in updatedDigitalBook)
          dbUpdatedDigitalBook.formato = updatedDigitalBook.formato;
        if ("url" in updatedDigitalBook)
          dbUpdatedDigitalBook.url = updatedDigitalBook.url;
        if ("resumen" in updatedDigitalBook)
          dbUpdatedDigitalBook.resumen = updatedDigitalBook.resumen;
        if ("storage_path" in updatedDigitalBook)
          dbUpdatedDigitalBook.storage_path = updatedDigitalBook.storage_path;

        const { error } = await supabase
          .from("digital_books")
          .update(dbUpdatedDigitalBook)
          .eq("id", digitalBookId);

        if (error) {
          toast({
            title: "Error al editar libro digital",
            description: "No se pudo editar el libro digital. Intente nuevamente.",
            variant: "destructive",
          });
          return;
        }

        setDigitalBooks((prev) =>
          prev.map((digitalBook) =>
            digitalBook.id === digitalBookId
              ? { ...digitalBook, ...updatedDigitalBook }
              : digitalBook
          )
        );
        toast({
          title: "Libro digital editado",
          description: "El libro digital ha sido editado exitosamente.",
        });
      } catch {
        toast({
          title: "Error al editar libro digital",
          description: "No se pudo editar el libro digital. Intente nuevamente.",
          variant: "destructive",
        });
      }
    },
    [toast, setDigitalBooks]
  );

  return {
    handleAddDigitalBook,
    handleDeleteDigitalBook,
    handleEditDigitalBook,
  };
}
