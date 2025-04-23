
import React from 'react';
import BookCard from './BookCard';
import { Book } from '@/types/book';

interface BookListProps {
  libros: Book[];
  searchTerm?: string;
}

const BookList: React.FC<BookListProps> = ({ libros, searchTerm = '' }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {libros.map((libro) => (
        <BookCard key={libro.id} libro={libro} searchTerm={searchTerm} />
      ))}
    </div>
  );
};

export default BookList;

