

import React from 'react';
import { CardTitle, CardDescription, CardHeader } from '@/components/ui/card';
import DataImport from '@/components/admin/DataImport';
import DataExport from '@/components/admin/DataExport';
import { NewBookDialog } from '@/components/admin/NewBookDialog';
import { Book, BookCategory } from '@/types';

interface LibrosHeaderProps {
  books: Book[];
  categories: BookCategory[];
  onImport: (data: any[]) => void;
  onAddBook: (book: Omit<Book, 'id'>) => void;
}

const LibrosHeader: React.FC<LibrosHeaderProps> = ({
  books,
  categories,
  onImport,
  onAddBook
}) => {
  return (
    <CardHeader className="pb-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center">
        <div>
          <CardTitle className="text-xl sm:text-2xl">Gestión de Libros</CardTitle>
          <CardDescription>
            Administra el catálogo de libros de la biblioteca
          </CardDescription>
        </div>
        <div className="flex flex-col gap-2 xs:flex-row xs:flex-wrap sm:flex-row items-stretch sm:items-center">
          <div className="flex gap-2 flex-wrap">
            <DataImport onImport={onImport} />
            <DataExport
              data={books}
              filename="libros-biblioteca"
              buttonLabel="Exportar libros"
            />
            <NewBookDialog
              categories={categories}
              onAddBook={onAddBook}
            />
          </div>
        </div>
      </div>
    </CardHeader>
  );
};

export default LibrosHeader;

