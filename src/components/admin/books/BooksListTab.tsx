
import React from 'react';
import { Book, BookCategory } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { BookSearch } from './BookSearch';
import { BooksTable } from './BooksTable';
import { Button } from '@/components/ui/button';
import { UploadDigitalBookDialog } from '@/components/admin/digital-books/UploadDigitalBookDialog';

interface BooksListTabProps {
  books: Book[];
  categories: BookCategory[];
  digitalBooks: DigitalBook[];
  onDeleteBook: (id: string) => void;
  onEditBook: (id: string, data: Partial<Book>) => void;
  onDeleteDigitalBook?: (id: string) => void;
  onAddDigitalBook?: (bookId: string, data: Omit<DigitalBook, 'id' | 'bookId' | 'fechaSubida'>) => void;
  onEditDigitalBook?: (id: string, data: Partial<DigitalBook>) => void;
  showDigitalOnly?: boolean;
  // Add the new props for bulk actions
  selectedBooks?: string[];
  onSelectBook?: (bookId: string, checked: boolean) => void;
}

export function BooksListTab({ 
  books, 
  categories, 
  digitalBooks,
  onDeleteBook,
  onEditBook,
  onDeleteDigitalBook,
  onAddDigitalBook,
  onEditDigitalBook,
  showDigitalOnly = false,
  selectedBooks = [],
  onSelectBook
}: BooksListTabProps) {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedBookId, setSelectedBookId] = React.useState<string | null>(null);

  const filteredBooks = React.useMemo(() => {
    let filteredList = books.filter(book => 
      book.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.includes(searchTerm)
    );

    if (showDigitalOnly) {
      filteredList = filteredList.filter(book => 
        digitalBooks.some(db => db.bookId === book.id)
      );
    }

    return filteredList;
  }, [books, searchTerm, digitalBooks, showDigitalOnly]);

  const selectedBook = selectedBookId 
    ? books.find(book => book.id === selectedBookId) 
    : null;

  return (
    <>
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <div className="flex-1 min-w-[250px]">
          <BookSearch 
            value={searchTerm}
            onChange={setSearchTerm}
          />
        </div>

        {selectedBook && onAddDigitalBook && (
          <UploadDigitalBookDialog 
            book={selectedBook}
            onUploadComplete={(data) => {
              if (onAddDigitalBook) {
                // Cast the formato to the correct type since we validate it in the form
                onAddDigitalBook(selectedBook.id, {
                  ...data,
                  formato: data.formato as "PDF" | "EPUB" | "MOBI" | "HTML"
                });
              }
              setSelectedBookId(null);
            }}
          />
        )}
      </div>
      
      <BooksTable 
        books={filteredBooks}
        categories={categories}
        digitalBooks={digitalBooks}
        onDeleteBook={onDeleteBook}
        onEditBook={onEditBook}
        onDeleteDigitalBook={onDeleteDigitalBook}
        onAddDigitalBook={(bookId) => {
          setSelectedBookId(bookId);
        }}
        onEditDigitalBook={onEditDigitalBook}
        showUploadButton={!!onAddDigitalBook}
        selectedBooks={selectedBooks || []}
        onSelectBook={onSelectBook}
      />
    </>
  );
}
