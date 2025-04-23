
import React from 'react';
import { BookCategory } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { CategoriaDialog } from '@/components/admin/CategoriaDialog';
import { EditCategoriaDialog } from '@/components/admin/EditCategoriaDialog';
import { Trash } from 'lucide-react';

interface CategoriesTabProps {
  categories: BookCategory[];
  onAddCategoria: (categoria: { nombre: string; descripcion?: string }) => void;
  onDeleteCategory: (id: string) => void;
  onEditCategory: (id: string, categoria: Omit<BookCategory, 'id'>) => void;
}

export function CategoriesTab({
  categories,
  onAddCategoria,
  onDeleteCategory,
  onEditCategory
}: CategoriesTabProps) {
  return (
    <>
      <div className="flex justify-end mb-4">
        <CategoriaDialog onAddCategoria={onAddCategoria} />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nombre</TableHead>
              <TableHead>Descripción</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium">{category.nombre}</TableCell>
                <TableCell>{category.descripcion}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <EditCategoriaDialog 
                      categoria={category}
                      onEditCategoria={onEditCategory}
                    />
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => onDeleteCategory(category.id)}
                    >
                      <Trash className="mr-2 h-4 w-4" />
                      Eliminar
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  );
}
