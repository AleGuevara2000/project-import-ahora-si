
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockBooks } from "@/types/book";
import { supabase } from "@/integrations/supabase/client";

// Usa esto SOLO de manera temporal para migrar los libros simulados a la base real
export default function ImportMockBooks() {
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState("");

  const handleImport = async () => {
    setImporting(true);
    setResult("");
    let successCount = 0;
    let failCount = 0;
    for (const book of mockBooks) {
      // Verifica si el libro ya existe mediante ISBN
      const { data: existing, error: findError } = await supabase
        .from("books")
        .select("id")
        .eq("isbn", book.isbn)
        .maybeSingle();

      if (findError) {
        failCount++;
        continue;
      }
      if (existing) continue; // Ya existe, saltar

      // Ajusta el modelo según tu tabla real
      const { error: insertError } = await supabase.from("books").insert([
        {
          titulo: book.titulo,
          autor: book.autor,
          isbn: book.isbn,
          categoria: book.categoria,
          editorial: book.editorial,
          anio_publicacion: book.anioPublicacion,
          copias: book.copias ?? 1,
          disponibles: book.disponibles ?? 1,
          imagen: book.imagen ?? null,
          ubicacion: book.ubicacion,
          descripcion: book.descripcion ?? "",
        },
      ]);
      if (insertError) {
        failCount++;
      } else {
        successCount++;
      }
    }
    setResult(`Importados: ${successCount}, Fallidos o ya existentes: ${failCount}`);
    setImporting(false);
    setDone(true);
  };

  return (
    <div className="flex flex-col items-center my-8">
      <Button onClick={handleImport} disabled={importing || done}>
        {importing ? "Importando..." : done ? "Finalizado" : "Importar libros simulados"}
      </Button>
      {result && <div className="mt-3 text-sm">{result}</div>}
      {done && <div className="mt-2 text-green-600">¡Proceso completado! Ahora puedes eliminar este componente.</div>}
    </div>
  );
}
