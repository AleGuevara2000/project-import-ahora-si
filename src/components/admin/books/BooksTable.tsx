
import React from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { BookActionsMenu } from './BookActionsMenu';
import { Badge } from '@/components/ui/badge';
import { Book as BookIcon, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface BooksTableProps {
  books: Book[];
  categories: BookCategory[];
  digitalBooks: DigitalBook[];
  onDeleteBook: (id: string) => void;
  onEditBook: (id: string, data: Partial<Book>) => void;
  onDeleteDigitalBook?: (id: string) => void;
  onAddDigitalBook?: (bookId: string) => void;
  onEditDigitalBook?: (id: string, data: Partial<DigitalBook>) => void;
  showUploadButton?: boolean;
  selectedBooks?: string[];
  onSelectBook?: (bookId: string, checked: boolean) => void;
}

export function BooksTable({
  books,
  categories,
  digitalBooks,
  onDeleteBook,
  onEditBook,
  onDeleteDigitalBook,
  onAddDigitalBook,
  onEditDigitalBook,
  showUploadButton = true,
  selectedBooks = [],
  onSelectBook
}: BooksTableProps) {
  if (books.length === 0) {
    return (
      <div className="text-center py-10 border rounded-md bg-muted/10">
        <BookIcon className="mx-auto h-10 w-10 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-medium">No hay libros</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          No se encontraron libros que coincidan con los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {onSelectBook && (
                <TableHead className="w-[50px]">
                  <span className="sr-only">Seleccionar</span>
                </TableHead>
              )}
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Disponibles</TableHead>
              <TableHead className="text-center">Digital</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
              <TableHead className="text-center">Borrar</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {books.map((book) => {
              const bookDigitalVersions = digitalBooks.filter(db => db.bookId === book.id);
              const hasDigitalVersion = bookDigitalVersions.length > 0;
              const isSelected = selectedBooks?.includes(book.id) || false;
              
              return (
                <TableRow key={book.id}>
                  {onSelectBook && (
                    <TableCell>
                      <Checkbox 
                        checked={isSelected} 
                        onCheckedChange={(checked) => {
                          onSelectBook(book.id, checked === true);
                        }}
                      />
                    </TableCell>
                  )}
                  <TableCell className="font-medium">{book.titulo}</TableCell>
                  <TableCell>{book.autor}</TableCell>
                  <TableCell>{book.isbn}</TableCell>
                  <TableCell>{book.categoria}</TableCell>
                  <TableCell>{book.disponibles} / {book.copias}</TableCell>
                  <TableCell className="text-center">
                    {hasDigitalVersion ? (
                      <Badge variant="outline" className="bg-primary/10">
                        {bookDigitalVersions.length}
                      </Badge>
                    ) : (
                      <span className="text-muted-foreground text-sm">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <BookActionsMenu
                      book={book}
                      categories={categories}
                      digitalBooks={digitalBooks}
                      onDeleteBook={onDeleteBook}
                      onEditBook={onEditBook}
                      onAddDigitalBook={showUploadButton ? onAddDigitalBook : undefined}
                      onDeleteDigitalBook={onDeleteDigitalBook}
                      onEditDigitalBook={onEditDigitalBook}
                    />
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={() => onDeleteBook(book.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Eliminar libro</span>
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
