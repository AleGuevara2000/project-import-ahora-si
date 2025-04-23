
import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import ThesisTable from "@/components/thesis/ThesisTable";
import ThesisSearch from "@/components/thesis/ThesisSearch";
import { fetchTheses } from "@/lib/theses-db";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import PDFViewer from "@/components/shared/PDFViewer";
import { Thesis } from "@/types";

const ThesesTab: React.FC = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [thesisSearchTerm, setThesisSearchTerm] = useState("");
  const [thesisTipoFiltro, setThesisTipoFiltro] = useState("");

  const {
    data: theses = [],
    isLoading: thesesLoading,
    error: thesesError,
  } = useQuery({
    queryKey: ["theses"],
    queryFn: fetchTheses,
  });

  const filteredTheses = useMemo(() => {
    return theses.filter((thesis) => {
      const matchesSearch =
        thesisSearchTerm.trim() === "" ||
        thesis.titulo.toLowerCase().includes(thesisSearchTerm.toLowerCase()) ||
        thesis.autor.toLowerCase().includes(thesisSearchTerm.toLowerCase()) ||
        thesis.director.toLowerCase().includes(thesisSearchTerm.toLowerCase());

      const matchesTipo =
        !thesisTipoFiltro ||
        thesisTipoFiltro === "all" ||
        thesis.tipo === thesisTipoFiltro;

      return matchesSearch && matchesTipo;
    });
  }, [theses, thesisSearchTerm, thesisTipoFiltro]);

  const handleLoanRequest = (thesis: Thesis) => {
    if (!isAuthenticated) {
      toast({
        title: "Inicio de sesión requerido",
        description: "Debes iniciar sesión para solicitar préstamos de tesis.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Solicitud de préstamo enviada",
      description: `Tu solicitud para "${thesis.titulo}" ha sido registrada. El personal de biblioteca te notificará cuando esté disponible.`,
    });
  };

  const renderThesisActions = (thesis: Thesis) => {
    return (
      <div className="flex space-x-2">
        {thesis.archivoPdf && (
          <PDFViewer
            url={thesis.archivoPdf}
            fileName={`${thesis.titulo} - ${thesis.autor}`}
          />
        )}
        <button
          onClick={() => handleLoanRequest(thesis)}
          className="text-primary hover:text-primary/80 text-sm"
        >
          Solicitar préstamo
        </button>
      </div>
    );
  };

  return (
    <div>
      <ThesisSearch
        busqueda={thesisSearchTerm}
        tipoFiltro={thesisTipoFiltro}
        onBusquedaChange={setThesisSearchTerm}
        onTipoFiltroChange={setThesisTipoFiltro}
        onLimpiarFiltros={() => {
          setThesisSearchTerm("");
          setThesisTipoFiltro("");
        }}
      />
      <div className="mb-4">
        <p className="text-gray-600 text-sm sm:text-base">
          Mostrando {filteredTheses.length} tesis
        </p>
      </div>
      {thesesLoading ? (
        <div className="p-4 text-center text-muted-foreground">
          Cargando tesis...
        </div>
      ) : thesesError ? (
        <div className="p-4 text-red-500 text-sm">
          Error obteniendo tesis: {(thesesError as Error).message}
        </div>
      ) : (
        <ThesisTable 
          theses={filteredTheses} 
          onEdit={() => {}} 
          renderActions={renderThesisActions}
        />
      )}
    </div>
  );
};

export default ThesesTab;
