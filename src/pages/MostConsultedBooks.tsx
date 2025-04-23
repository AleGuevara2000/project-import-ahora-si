
import React, { useState } from 'react';
import { mockBooks } from '@/types/book';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import BookCard from '@/components/books/BookCard';
import MainLayout from '@/components/layout/MainLayout';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Suponemos que cada libro de mockBooks tiene un campo 'consultas' que representa popularidad.
// Si no existe, creamos un valor ficticio
const booksWithConsultas = mockBooks.map((book, idx) => ({
  ...book,
  consultas: (book as any).consultas ?? (10 - idx), // Simular más popularidad en los primeros
}));

// Ordenar por 'consultas' y tomar los primeros 5
const top5Books = booksWithConsultas
  .sort((a, b) => b.consultas - a.consultas)
  .slice(0, 5);

const MostConsultedBooks = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [books, setBooks] = useState(top5Books);
  const [searching, setSearching] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    setSearching(true);
    setTimeout(() => {
      if (!searchTerm.trim()) {
        setBooks(top5Books);
      } else {
        const term = searchTerm.toLowerCase();
        setBooks(
          top5Books.filter(
            (book) =>
              book.titulo.toLowerCase().includes(term) ||
              book.autor.toLowerCase().includes(term) ||
              book.isbn.includes(term) ||
              book.editorial.toLowerCase().includes(term)
          )
        );
      }
      setSearching(false);
    }, 200);
  };

  const handleReset = () => {
    setSearchTerm('');
    setBooks(top5Books);
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4 space-y-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">
          Libros más consultados
        </h1>
        <div className="max-w-xl mx-auto">
          <div className="flex gap-2 mb-6">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-2.5">
                <Search className="h-4 w-4 text-gray-500" />
              </span>
              <Input
                placeholder="Buscar por título, autor, ISBN o editorial..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
            </div>
            <Button onClick={handleSearch} disabled={searching}>
              {searching ? 'Buscando...' : 'Buscar'}
            </Button>
            <Button variant="outline" onClick={handleReset}>
              Limpiar
            </Button>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Resultados</h2>
          {searching ? (
            <div className="py-8 text-center text-gray-500">Buscando libros...</div>
          ) : books.length === 0 ? (
            <div className="py-8 text-center text-gray-500">
              No se encontraron libros que coincidan con la búsqueda
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {books.map((book) => (
                <BookCard key={book.id} libro={book} searchTerm={searchTerm} />
              ))}
            </div>
          )}
        </div>
        <div>
          <Button variant="link" onClick={() => navigate('/catalogo')}>
            Ir al catálogo completo
          </Button>
        </div>
      </div>
    </MainLayout>
  );
};

export default MostConsultedBooks;
