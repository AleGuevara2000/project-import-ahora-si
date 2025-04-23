
import React from 'react';
import { Search } from 'lucide-react';
import { mockBooks } from '@/types/book';
import BookCard from './BookCard';  // Changed import to default
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

const BookSearchResultTest = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(mockBooks);
  const [isSearching, setIsSearching] = useState(false);
  
  // Simular búsqueda con los libros de muestra
  const handleSearch = () => {
    setIsSearching(true);
    
    // Simulamos un pequeño retraso como en una búsqueda real
    setTimeout(() => {
      if (searchTerm.trim() === '') {
        setSearchResults(mockBooks);
      } else {
        const term = searchTerm.toLowerCase();
        const filtered = mockBooks.filter(
          book => 
            book.titulo.toLowerCase().includes(term) ||
            book.autor.toLowerCase().includes(term) ||
            book.isbn.includes(term) ||
            book.editorial.toLowerCase().includes(term)
        );
        setSearchResults(filtered);
      }
      setIsSearching(false);
      
      // Registrar en la consola para verificar
      console.log(`Búsqueda completada con término: "${searchTerm}"`);
      console.log(`Resultados encontrados: ${searchResults.length}`);
    }, 300);
  };
  
  // Limpiar búsqueda
  const handleClear = () => {
    setSearchTerm('');
    setSearchResults(mockBooks);
  };
  
  useEffect(() => {
    console.log("Componente de prueba de búsqueda montado");
    console.log(`Total de libros disponibles para búsqueda: ${mockBooks.length}`);
    return () => {
      console.log("Componente de prueba de búsqueda desmontado");
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Prueba de Búsqueda de Libros</h2>
        
        <div className="flex gap-2 mb-4">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-2.5">
              <Search className="h-4 w-4 text-gray-500" />
            </span>
            <Input
              type="text"
              placeholder="Buscar por título, autor o ISBN..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={isSearching}>
            {isSearching ? 'Buscando...' : 'Buscar'}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            Limpiar
          </Button>
        </div>
        
        <div className="text-sm text-gray-600">
          {isSearching ? (
            <p>Buscando libros...</p>
          ) : (
            <p>Mostrando {searchResults.length} {searchResults.length === 1 ? 'resultado' : 'resultados'}</p>
          )}
        </div>
      </div>
      
      {/* Sección de resultados de búsqueda */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Resultados de la búsqueda</h3>
        
        {searchResults.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No se encontraron libros que coincidan con la búsqueda
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((libro) => (
              <BookCard key={libro.id} libro={libro} searchTerm={searchTerm} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookSearchResultTest;

