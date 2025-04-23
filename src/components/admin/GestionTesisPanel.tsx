
import React, { useState, useEffect } from "react";
import { GraduationCap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Thesis } from "@/types";
import DataExport from "@/components/admin/DataExport";
import DataImport from "@/components/admin/DataImport";
import ThesisTable from "@/components/thesis/ThesisTable";
import ThesisSearch from "@/components/thesis/ThesisSearch";
import AddThesisDialog from "@/components/thesis/AddThesisDialog";
import EditThesisDialog from "@/components/thesis/EditThesisDialog";
import { useToast } from "@/hooks/use-toast";
import { useThesisFileUpload } from "@/hooks/useThesisFileUpload";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchTheses, deleteThesis } from "@/lib/theses-db";
import { createThesisStorageBucket } from "@/utils/createStorageBucket";
import { useAuth } from "@/contexts/AuthContext";

interface GestionTesisPanelProps {
  isAuthenticated: boolean;
}

const GestionTesisPanel = ({ isAuthenticated }: GestionTesisPanelProps) => {
  const { toast } = useToast();
  const { deleteThesisFile } = useThesisFileUpload();
  const queryClient = useQueryClient();
  const [busqueda, setBusqueda] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingTesis, setEditingTesis] = useState<Thesis | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Create storage bucket if it doesn't exist
  useEffect(() => {
    if (isAuthenticated) {
      createThesisStorageBucket();
    }
  }, [isAuthenticated]);

  // Obtener las tesis de la base de datos
  const { data: tesis = [], isLoading } = useQuery({
    queryKey: ["theses"],
    queryFn: fetchTheses,
    enabled: isAuthenticated,
  });

  const limpiarFiltros = () => {
    setBusqueda('');
    setTipoFiltro('');
  };

  const tesisFiltradas = tesis.filter((tesis) => {
    let cumpleBusqueda = true;
    let cumpleTipo = true;
    if (busqueda) {
      const busquedaLower = busqueda.toLowerCase();
      cumpleBusqueda =
        tesis.titulo.toLowerCase().includes(busquedaLower) ||
        tesis.autor.toLowerCase().includes(busquedaLower) ||
        tesis.director.toLowerCase().includes(busquedaLower);
    }
    if (tipoFiltro && tipoFiltro !== "all") {
      cumpleTipo = tesis.tipo === tipoFiltro;
    }
    return cumpleBusqueda && cumpleTipo;
  });

  const handleThesisAdded = async (newThesis: Thesis) => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["theses"] });
      toast({
        title: "Tesis agregada",
        description: `La tesis "${newThesis.titulo}" ha sido agregada exitosamente.`,
      });
    } catch (error) {
      console.error('Error al agregar tesis:', error);
      toast({
        title: 'Error',
        description: 'No se pudo agregar la tesis. Intente nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const handleThesisUpdated = async (updatedThesis: Thesis) => {
    try {
      await queryClient.invalidateQueries({ queryKey: ["theses"] });
      setEditingTesis(null);
      toast({
        title: "Tesis actualizada",
        description: `La tesis "${updatedThesis.titulo}" ha sido actualizada exitosamente.`,
      });
    } catch (error) {
      console.error('Error al actualizar tesis:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la tesis. Intente nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const handleThesisDelete = async (thesisToDelete: Thesis) => {
    try {
      if (thesisToDelete.archivoPdf) {
        await deleteThesisFile(thesisToDelete.archivoPdf);
      }
      await deleteThesis(thesisToDelete.id);
      await queryClient.invalidateQueries({ queryKey: ["theses"] });
      toast({
        title: "Tesis eliminada",
        description: `La tesis "${thesisToDelete.titulo}" ha sido eliminada exitosamente.`,
      });
    } catch (error) {
      console.error('Error al eliminar tesis:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar la tesis. Intente nuevamente.',
        variant: 'destructive'
      });
    }
  };

  const handleEditTesis = (thesis: Thesis) => {
    setEditingTesis(thesis);
    setEditDialogOpen(true);
  };

  const handleImportTesis = async (importedData: any[]) => {
    let successCount = 0;
    let failCount = 0;
    toast({
      title: "Importación de tesis",
      description: `Tesis importadas: ${successCount}, Fallos: ${failCount}`,
    });

    queryClient.invalidateQueries({ queryKey: ["theses"] });
  };

  return (
    <div className="container mx-auto py-4 px-2 sm:py-10 sm:px-4">
      {/* Cabecera principal, responsiva */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex items-center">
          <GraduationCap className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-2xl sm:text-3xl font-bold">Gestión de Tesis</h1>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
          <DataImport onImport={handleImportTesis} accept=".csv,.json,.xlsx" />
          <DataExport
            data={tesisFiltradas}
            filename="tesis-export"
            buttonLabel="Exportar tesis"
          />
          <Button onClick={() => setAddDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Agregar tesis
          </Button>
        </div>
      </div>
      {/* Filtros y resumen */}
      <div>
        <ThesisSearch
          busqueda={busqueda}
          tipoFiltro={tipoFiltro}
          onBusquedaChange={setBusqueda}
          onTipoFiltroChange={setTipoFiltro}
          onLimpiarFiltros={limpiarFiltros}
        />
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-y-2">
          <p className="text-gray-600 text-sm sm:text-base">
            Mostrando {tesisFiltradas.length} {tesisFiltradas.length === 1 ? 'tesis' : 'tesis'}
            {isLoading && ' (Cargando...)'}
          </p>
        </div>
      </div>
      {/* Tabla de tesis con scroll horizontal en móvil */}
      <div className="overflow-x-auto">
        <ThesisTable
          theses={tesisFiltradas}
          onEdit={handleEditTesis}
          onDelete={handleThesisDelete}
        />
      </div>
      <AddThesisDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        onThesisAdded={handleThesisAdded}
      />
      <EditThesisDialog
        thesis={editingTesis}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onThesisUpdated={handleThesisUpdated}
      />
    </div>
  );
};

export default GestionTesisPanel;
