

import React, { Suspense } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BulkActionsBar from "@/components/admin/books/BulkActionsBar";
import { BooksListTab } from "@/components/admin/books/BooksListTab";
import { CategoriesTab } from "@/components/admin/books/CategoriesTab";
import { Book, BookCategory } from "@/types";
import { DigitalBook } from "@/types/digitalBook";

interface LibrosTabsProps {
  books: Book[];
  categories: BookCategory[];
  digitalBooks: DigitalBook[];
  selectedBooks: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
  onSelectBook: (bookId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
  onExportSelected: () => void;
  onDeleteBook: (id: string) => void;
  onEditBook: (id: string, data: Partial<Book>) => void;
  onDeleteDigitalBook?: (id: string) => void;
  onAddDigitalBook?: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
  onEditDigitalBook?: (id: string, data: Partial<DigitalBook>) => void;
  onAddCategoria: (newCategory: Omit<BookCategory, "id">) => void;
  onDeleteCategory: (categoryId: string) => void;
  onEditCategory: (categoryId: string, updatedCategory: Partial<BookCategory>) => void;
  isStaff: boolean;
}

const LibrosTabs: React.FC<LibrosTabsProps> = ({
  books,
  categories,
  digitalBooks,
  selectedBooks,
  activeTab,
  onTabChange,
  onSelectBook,
  onSelectAll,
  onBulkDelete,
  onExportSelected,
  onDeleteBook,
  onEditBook,
  onDeleteDigitalBook,
  onAddDigitalBook,
  onEditDigitalBook,
  onAddCategoria,
  onDeleteCategory,
  onEditCategory,
  isStaff,
}) => (
  <div>
    {activeTab === 'libros' && (
      <div className="mb-4 sm:mb-4">
        <BulkActionsBar
          selectedCount={selectedBooks.length}
          totalCount={books.length}
          onSelectAll={onSelectAll}
          onBulkDelete={onBulkDelete}
          onExportSelected={onExportSelected}
          disabled={selectedBooks.length === 0}
        />
      </div>
    )}
    <Tabs value={activeTab} onValueChange={onTabChange} defaultValue="libros">
      <TabsList className="mb-4 w-full sm:w-auto flex overflow-x-auto gap-1">
        <TabsTrigger value="libros" className="flex-1 sm:flex-none min-w-[100px]">
          Libros
        </TabsTrigger>
        <TabsTrigger value="categorias" className="flex-1 sm:flex-none min-w-[100px]">
          Categorías
        </TabsTrigger>
        <TabsTrigger value="digital" className="flex-1 sm:flex-none min-w-[140px]">
          Libros digitales
        </TabsTrigger>
      </TabsList>
      <Suspense fallback={<div className="py-4 text-center">Cargando...</div>}>
        <TabsContent value="libros">
          <BooksListTab
            books={books}
            categories={categories}
            digitalBooks={digitalBooks}
            onDeleteBook={onDeleteBook}
            onEditBook={onEditBook}
            onDeleteDigitalBook={isStaff ? onDeleteDigitalBook : undefined}
            onAddDigitalBook={isStaff ? onAddDigitalBook : undefined}
            onEditDigitalBook={isStaff ? onEditDigitalBook : undefined}
            selectedBooks={selectedBooks}
            onSelectBook={onSelectBook}
          />
        </TabsContent>
        <TabsContent value="categorias">
          <CategoriesTab
            categories={categories}
            onAddCategoria={onAddCategoria}
            onDeleteCategory={onDeleteCategory}
            onEditCategory={onEditCategory}
          />
        </TabsContent>
        <TabsContent value="digital">
          <BooksListTab
            books={books}
            categories={categories}
            digitalBooks={digitalBooks}
            onDeleteBook={onDeleteBook}
            onEditBook={onEditBook}
            onDeleteDigitalBook={isStaff ? onDeleteDigitalBook : undefined}
            onAddDigitalBook={isStaff ? onAddDigitalBook : undefined}
            onEditDigitalBook={isStaff ? onEditDigitalBook : undefined}
            showDigitalOnly={true}
            selectedBooks={selectedBooks}
            onSelectBook={onSelectBook}
          />
        </TabsContent>
      </Suspense>
    </Tabs>
  </div>
);

export default LibrosTabs;

