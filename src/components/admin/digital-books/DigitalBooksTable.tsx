import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Book } from '@/types';
import { DigitalBook } from '@/types/digitalBook';
import { FileText, File, BookOpen, FileBox, Trash } from 'lucide-react';
import PDFViewer from '@/components/shared/PDFViewer';
import { useAuth } from '@/contexts/AuthContext';
import { DigitalBooksActionsMenu } from './DigitalBooksActionsMenu';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface DigitalBooksTableProps {
  book: Book;
  digitalBooks: DigitalBook[];
  onDeleteDigitalBook?: (id: string) => void;
  onEditDigitalBook?: (id: string, data: Partial<DigitalBook>) => void;
}

export function DigitalBooksTable({ 
  book, 
  digitalBooks,
  onDeleteDigitalBook,
  onEditDigitalBook 
}: DigitalBooksTableProps) {
  const { hasRole } = useAuth();
  const isStaff = true; // Allow all users to act as staff
  const bookDigitalVersions = digitalBooks.filter(db => db.bookId === book.id);

  const getFormatIcon = (formato: string) => {
    switch (formato) {
      case 'PDF': return <FileText className="h-4 w-4 text-red-500" />;
      case 'EPUB': return <BookOpen className="h-4 w-4 text-blue-500" />;
      case 'MOBI': return <BookOpen className="h-4 w-4 text-green-500" />;
      case 'HTML': return <FileBox className="h-4 w-4 text-purple-500" />;
      default: return <File className="h-4 w-4" />;
    }
  };

  const formatFileSize = (size: number) => {
    if (size < 1) {
      return `${(size * 1024).toFixed(2)} KB`;
    }
    return `${size.toFixed(2)} MB`;
  };

  if (bookDigitalVersions.length === 0) {
    return (
      <div className="py-6 text-center text-muted-foreground">
        No hay archivos digitales disponibles para este libro.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Formato</TableHead>
            <TableHead className="hidden sm:table-cell">Archivo</TableHead>
            <TableHead className="hidden md:table-cell">Tamaño</TableHead>
            <TableHead className="hidden md:table-cell">Fecha subida</TableHead>
            <TableHead className="hidden lg:table-cell">Resumen</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
            <TableHead className="text-center">Borrar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {bookDigitalVersions.map((digitalBook) => (
            <TableRow key={digitalBook.id}>
              <TableCell>
                <div className="flex items-center">
                  {getFormatIcon(digitalBook.formato)}
                  <Badge variant="outline" className="ml-2">
                    {digitalBook.formato}
                  </Badge>
                </div>
              </TableCell>
              <TableCell className="hidden sm:table-cell max-w-[120px] lg:max-w-[200px]">
                <div className="truncate" title={digitalBook.url}>
                  {digitalBook.storage_path ? digitalBook.storage_path.split('/').pop() : 'Sin nombre'}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {formatFileSize(digitalBook.tamanioMb)}
              </TableCell>
              <TableCell className="hidden md:table-cell">
                {new Date(digitalBook.fechaSubida).toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </TableCell>
              <TableCell className="hidden lg:table-cell max-w-[200px]">
                <div className="truncate" title={digitalBook.resumen}>
                  {digitalBook.resumen || 'Sin resumen'}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex justify-end gap-2">
                  <PDFViewer 
                    url={digitalBook.url} 
                    fileName={`${book.titulo} - ${digitalBook.formato}`} 
                    fileFormat={digitalBook.formato as 'PDF' | 'EPUB' | 'MOBI' | 'HTML'}
                  />
                  <DigitalBooksActionsMenu
                    isStaff={isStaff}
                    digitalBook={digitalBook}
                    onDelete={onDeleteDigitalBook}
                    onEdit={onEditDigitalBook}
                  />
                </div>
              </TableCell>
              <TableCell className="text-center">
                {onDeleteDigitalBook && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700 hover:bg-red-100"
                    onClick={() => onDeleteDigitalBook(digitalBook.id)}
                  >
                    <Trash className="h-4 w-4" />
                    <span className="sr-only">Eliminar archivo digital</span>
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
