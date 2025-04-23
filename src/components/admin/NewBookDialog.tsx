import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlusCircle } from 'lucide-react';
import { BookCategory, Book } from '@/types';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface NewBookDialogProps {
  categories: BookCategory[];
  onAddBook: (book: Book) => void;
}

export function NewBookDialog({ categories, onAddBook }: NewBookDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  const [formData, setFormData] = React.useState({
    titulo: '',
    autor: '',
    isbn: '',
    categoria: categories[0]?.nombre || '',
    editorial: '',
    anioPublicacion: new Date().getFullYear(),
    copias: 1,
    disponibles: 1,
    ubicacion: '',
    descripcion: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.titulo || !formData.autor || !formData.isbn) {
      toast({
        title: "Error",
        description: "Por favor complete los campos obligatorios",
        variant: "destructive",
      });
      return;
    }

    const newBook: Book = {
      id: Math.random().toString(36).substr(2, 9),
      ...formData
    };

    onAddBook(newBook);
    setOpen(false);
    setFormData({
      titulo: '',
      autor: '',
      isbn: '',
      categoria: categories[0]?.nombre || '',
      editorial: '',
      anioPublicacion: new Date().getFullYear(),
      copias: 1,
      disponibles: 1,
      ubicacion: '',
      descripcion: '',
    });
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title="Agregar nuevo libro"
      trigger={
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo libro
        </Button>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4 mt-4">
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="titulo">Título *</Label>
            <Input
              id="titulo"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="autor">Autor *</Label>
            <Input
              id="autor"
              value={formData.autor}
              onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="isbn">ISBN *</Label>
            <Input
              id="isbn"
              value={formData.isbn}
              onChange={(e) => setFormData({ ...formData, isbn: e.target.value })}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="categoria">Categoría</Label>
            <Select 
              value={formData.categoria}
              onValueChange={(value) => setFormData({ ...formData, categoria: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.nombre}>
                    {category.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="editorial">Editorial</Label>
            <Input
              id="editorial"
              value={formData.editorial}
              onChange={(e) => setFormData({ ...formData, editorial: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="anioPublicacion">Año de publicación</Label>
              <Input
                id="anioPublicacion"
                type="number"
                value={formData.anioPublicacion}
                onChange={(e) => setFormData({ ...formData, anioPublicacion: parseInt(e.target.value) })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="copias">Copias</Label>
              <Input
                id="copias"
                type="number"
                min="1"
                value={formData.copias}
                onChange={(e) => {
                  const copias = parseInt(e.target.value);
                  setFormData({ 
                    ...formData, 
                    copias,
                    disponibles: Math.min(copias, formData.disponibles)
                  });
                }}
              />
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="disponibles">Disponibles</Label>
            <Input
              id="disponibles"
              type="number"
              min="0"
              max={formData.copias}
              value={formData.disponibles}
              onChange={(e) => setFormData({ ...formData, disponibles: parseInt(e.target.value) })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="ubicacion">Ubicación</Label>
            <Input
              id="ubicacion"
              value={formData.ubicacion}
              onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="descripcion">Descripción</Label>
            <Input
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
            />
          </div>
        </div>
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button type="submit">Agregar libro</Button>
        </div>
      </form>
    </ResponsiveDialog>
  );
}
