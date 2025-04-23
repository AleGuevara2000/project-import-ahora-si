
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { mockTheses } from "@/types/thesis";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

/**
 * Componente temporal para importar todas las mockTheses a la tabla de Supabase
 * Verifica por título y autor que no haya duplicados
 * Requiere autenticación debido a las políticas de RLS
 */
export default function ImportMockTheses() {
  const [importing, setImporting] = useState(false);
  const [done, setDone] = useState(false);
  const [result, setResult] = useState("");
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();

  const handleImport = async () => {
    // Verificar que el usuario esté autenticado
    if (!isAuthenticated) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para importar tesis.",
        variant: "destructive"
      });
      return;
    }

    setImporting(true);
    setResult("");
    let successCount = 0;
    let duplicateCount = 0;
    let failCount = 0;

    for (const thesis of mockTheses) {
      // Verifica si la tesis ya existe por título+autor
      const { data: existing, error: findError } = await supabase
        .from("theses")
        .select("id")
        .eq("titulo", thesis.titulo)
        .eq("autor", thesis.autor)
        .maybeSingle();

      if (findError) {
        console.error("Error al verificar duplicados:", findError);
        failCount++;
        continue;
      }
      if (existing) {
        duplicateCount++;
        continue; // Ya existe, saltar
      }

      // Inserta la tesis. Solo los campos que están en la tabla real.
      const { error: insertError } = await supabase.from("theses").insert([
        {
          titulo: thesis.titulo,
          autor: thesis.autor,
          carrera: thesis.carrera,
          anio: thesis.anio,
          director: thesis.director,
          tipo: thesis.tipo,
          disponible: thesis.disponible !== false,
          resumen: thesis.resumen ?? null,
          archivo_pdf: thesis.archivoPdf ?? null,
        },
      ]);
      
      if (insertError) {
        console.error("Error al insertar tesis:", insertError);
        failCount++;
      } else {
        successCount++;
      }
    }

    setResult(
      `Tesis importadas: ${successCount}, Duplicados: ${duplicateCount}, Fallidos: ${failCount}`
    );
    setImporting(false);
    setDone(true);
  };

  return (
    <div className="flex flex-col items-center my-8">
      {!isAuthenticated ? (
        <div className="text-red-500 mb-4">
          Debes iniciar sesión para importar tesis
        </div>
      ) : null}
      
      <Button 
        onClick={handleImport} 
        disabled={importing || done || !isAuthenticated}
      >
        {importing ? "Importando..." : done ? "Finalizado" : "Importar tesis simuladas"}
      </Button>
      
      {result && <div className="mt-3 text-sm">{result}</div>}
      
      {done && (
        <div className="mt-2 text-green-600">
          ¡Proceso completado! Ya puedes eliminar este componente.
        </div>
      )}
    </div>
  );
}
