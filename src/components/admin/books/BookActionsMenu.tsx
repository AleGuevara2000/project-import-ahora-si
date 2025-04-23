import React from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { MoreHorizontal, Edit, Trash, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EditBookDialog } from '@/components/admin/EditBookDialog';
import { DigitalBooksDialog } from '@/components/admin/digital-books/DigitalBooksDialog';

interface BookActionsMenuProps {
  book: Book;
  categories: BookCategory[];
  digitalBooks: DigitalBook[];
  onDeleteBook: (id: string) => void;
  onEditBook: (id: string, data: Partial<Book>) => void;
  onAddDigitalBook?: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
  onDeleteDigitalBook?: (id: string) => void;
  onEditDigitalBook?: (id: string, data: Partial<DigitalBook>) => void;
}

export function BookActionsMenu({
  book,
  categories,
  digitalBooks,
  onDeleteBook,
  onEditBook,
  onAddDigitalBook,
  onDeleteDigitalBook,
  onEditDigitalBook
}: BookActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Acciones</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Acciones</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <EditBookDialog
            book={book}
            categories={categories}
            onEditBook={onEditBook}
          />
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <DigitalBooksDialog 
            book={book} 
            digitalBooks={digitalBooks}
            onAddDigitalBook={onAddDigitalBook}
            onDeleteDigitalBook={onDeleteDigitalBook}
            onEditDigitalBook={onEditDigitalBook}
          />
        </DropdownMenuItem>
        <DropdownMenuItem 
          onClick={() => onDeleteBook(book.id)}
          className="text-red-500 focus:text-red-500"
        >
          <Trash className="mr-2 h-4 w-4" />
          Eliminar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
