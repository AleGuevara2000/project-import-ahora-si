
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Book } from "@/types/book";

/**
 * Subscribes to realtime changes on books and digital_books tables.
 */
export function useBooksRealtime(setBooks: React.Dispatch<React.SetStateAction<Book[]>>, setDigitalBooks: React.Dispatch<React.SetStateAction<string[]>>) {
  useEffect(() => {
    const booksChannel = supabase
      .channel("public:books")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "books" },
        (payload) => {
          setBooks((currentBooks) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...currentBooks, payload.new as Book];
              case "UPDATE":
                return currentBooks.map((book) =>
                  book.id === payload.new.id ? (payload.new as Book) : book
                );
              case "DELETE":
                return currentBooks.filter(
                  (book) => book.id !== payload.old.id
                );
              default:
                return currentBooks;
            }
          });
        }
      )
      .subscribe();

    const digitalBooksChannel = supabase
      .channel("public:digital_books")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "digital_books" },
        (payload) => {
          setDigitalBooks((currentDigitalBooks) => {
            switch (payload.eventType) {
              case "INSERT":
                return [...currentDigitalBooks, (payload.new as any).book_id];
              case "UPDATE":
                return currentDigitalBooks.map((id) =>
                  id === (payload.old as any).book_id
                    ? (payload.new as any).book_id
                    : id
                );
              case "DELETE":
                return currentDigitalBooks.filter(
                  (id) => id !== (payload.old as any).book_id
                );
              default:
                return currentDigitalBooks;
            }
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(booksChannel);
      supabase.removeChannel(digitalBooksChannel);
    };
  }, [setBooks, setDigitalBooks]);
}
