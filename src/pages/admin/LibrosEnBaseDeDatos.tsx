
import React from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useBooksData } from "@/components/books/hooks/useBooksData";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ImportMockBooks from "@/utils/importMockBooks";

const LibrosEnBaseDeDatos = () => {
  const { books, isLoading } = useBooksData();
  const navigate = useNavigate();

  return (
    <MainLayout>
      <div className="container mx-auto py-4 sm:py-8 px-2 sm:px-6">
        <div className="flex items-center gap-2 mb-6">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold">Libros en la base de datos real</h1>
          <Button variant="outline" size="sm" className="ml-auto" onClick={() => navigate(-1)}>
            Volver
          </Button>
        </div>
        {isLoading ? (
          <div className="text-center text-gray-500 py-6">Cargando libros...</div>
        ) : books.length === 0 ? (
          <div>
            <div className="text-center text-gray-500 py-6">
              No hay libros registrados en la base de datos real.
            </div>
            <ImportMockBooks />
          </div>
        ) : (
          <div className="bg-white p-2 rounded shadow">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Autor</TableHead>
                  <TableHead>ISBN</TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Disponibles</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {books.map((book) => (
                  <TableRow key={book.id}>
                    <TableCell>{book.titulo}</TableCell>
                    <TableCell>{book.autor}</TableCell>
                    <TableCell>{book.isbn}</TableCell>
                    <TableCell>{book.categoria}</TableCell>
                    <TableCell>{book.disponibles}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default LibrosEnBaseDeDatos;
