import React, { useState, useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataExport from '@/components/admin/DataExport';
import DataImport from '@/components/admin/DataImport';
import { NewBookDialog } from '@/components/admin/NewBookDialog';
import { BooksListTab } from '@/components/admin/books/BooksListTab';
import { CategoriesTab } from '@/components/admin/books/CategoriesTab';
import { useBooksManagement } from '@/hooks/use-books-management';
import { useToast } from '@/hooks/use-toast';
import { Suspense } from 'react';
import { supabase } from "@/integrations/supabase/client";
import BulkActionsBar from '@/components/admin/books/BulkActionsBar';
import LibrosHeader from '@/components/admin/libros/LibrosHeader';
import LibrosTabs from '@/components/admin/libros/LibrosTabs';

interface GestionLibrosProps {
  defaultTab?: 'libros' | 'categorias' | 'digital';
}

const GestionLibros = ({ defaultTab = 'libros' }: GestionLibrosProps) => {
  const { hasRole } = useAuth();
  const isStaff = hasRole(['administrador', 'bibliotecario']);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  const {
    books,
    categories,
    digitalBooks,
    handleAddCategoria,
    handleDeleteCategory,
    handleEditCategory,
    handleDeleteBook,
    handleEditBook,
    handleAddBook,
    handleAddDigitalBook,
    handleDeleteDigitalBook,
    handleEditDigitalBook
  } = useBooksManagement();

  const [selectedBooks, setSelectedBooks] = useState<string[]>([]);

  const handleSelectBook = useCallback((bookId: string, checked: boolean) => {
    setSelectedBooks(prev =>
      checked ? [...prev, bookId] : prev.filter(id => id !== bookId)
    );
  }, []);

  const handleSelectAll = useCallback((checked: boolean) => {
    if (checked) {
      setSelectedBooks(books.map(book => book.id));
    } else {
      setSelectedBooks([]);
    }
  }, [books]);

  const handleBulkDelete = async () => {
    if (selectedBooks.length === 0) return;
    try {
      const { error } = await supabase.from('books').delete().in('id', selectedBooks);
      if (error) throw error;
      selectedBooks.forEach(id => handleDeleteBook(id));
      setSelectedBooks([]);
      toast({
        title: "Libros eliminados",
        description: `${selectedBooks.length} libro(s) eliminados exitosamente.`
      });
    } catch (error: any) {
      toast({
        title: "Error al eliminar",
        description: "No se pudieron eliminar algunos libros.",
        variant: "destructive"
      });
    }
  };

  const handleExportSelected = () => {
    const selectedBooksData = books.filter(book => selectedBooks.includes(book.id));
    if (selectedBooksData.length === 0) {
      toast({
        title: "Ningún libro seleccionado",
        description: "Selecciona uno o más libros para exportar.",
        variant: "destructive"
      });
      return;
    }
    DataExport({
      data: selectedBooksData,
      filename: "libros-seleccionados",
      buttonLabel: "Exportar selección"
    });
  };

  const handleImportData = useCallback(async (data: any[]) => {
    let successCount = 0;
    let failCount = 0;
    for (const rawBook of data) {
      try {
        const { titulo, autor, isbn, categoria, editorial, anioPublicacion, copias, disponibles, ubicacion, descripcion, consultas } = rawBook;
        const { data: existingBook } = await supabase.from("books").select("id").eq("isbn", isbn).maybeSingle();
        if (existingBook) continue;
        await supabase.from("books").insert([{
          titulo,
          autor,
          isbn,
          categoria,
          editorial,
          anio_publicacion: anioPublicacion,
          copias: copias ?? 1,
          disponibles: disponibles ?? 1,
          ubicacion,
          descripcion,
          consultas: consultas ?? 0,
        }]);
        successCount++;
      } catch (e) {
        failCount++;
      }
    }
    toast({
      title: "Importación finalizada",
      description: `Éxitos: ${successCount}, Fallos: ${failCount}`
    });
  }, [toast]);

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value);
    setSelectedBooks([]);
  }, []);

  return (
    <MainLayout>
      <div className="container mx-auto py-4 px-2 md:py-8 md:px-0">
        <Card>
          <LibrosHeader
            books={books}
            categories={categories}
            onImport={handleImportData}
            onAddBook={handleAddBook}
          />

          <CardContent className="p-2 sm:p-6 pt-0">
            <LibrosTabs
              books={books}
              categories={categories}
              digitalBooks={digitalBooks}
              selectedBooks={selectedBooks}
              activeTab={activeTab}
              onTabChange={handleTabChange}
              onSelectBook={handleSelectBook}
              onSelectAll={handleSelectAll}
              onBulkDelete={handleBulkDelete}
              onExportSelected={handleExportSelected}
              onDeleteBook={handleDeleteBook}
              onEditBook={handleEditBook}
              onDeleteDigitalBook={isStaff ? handleDeleteDigitalBook : undefined}
              onAddDigitalBook={isStaff ? handleAddDigitalBook : undefined}
              onEditDigitalBook={isStaff ? handleEditDigitalBook : undefined}
              onAddCategoria={handleAddCategoria}
              onDeleteCategory={handleDeleteCategory}
              onEditCategory={handleEditCategory}
              isStaff={isStaff}
            />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GestionLibros;
