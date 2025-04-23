
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Edit } from 'lucide-react';
import { Book, BookCategory } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';

const bookSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido'),
  autor: z.string().min(1, 'El autor es requerido'),
  isbn: z.string().min(1, 'El ISBN es requerido'),
  categoria: z.string().min(1, 'La categoría es requerida'),
  disponibles: z.coerce.number().min(0, 'El número debe ser positivo'),
  copias: z.coerce.number().min(0, 'El número debe ser positivo'),
});

type BookFormData = z.infer<typeof bookSchema>;

interface EditBookDialogProps {
  book: Book;
  categories: BookCategory[];
  onEditBook: (id: string, bookData: Partial<Book>) => void;
}

export function EditBookDialog({ book, categories, onEditBook }: EditBookDialogProps) {
  const [open, setOpen] = React.useState(false);
  const { toast } = useToast();
  
  const form = useForm<BookFormData>({
    resolver: zodResolver(bookSchema),
    defaultValues: {
      titulo: book.titulo,
      autor: book.autor,
      isbn: book.isbn,
      categoria: book.categoria,
      disponibles: book.disponibles,
      copias: book.copias,
    },
  });

  const onSubmit = async (data: BookFormData) => {
    try {
      onEditBook(book.id, {
        titulo: data.titulo,
        autor: data.autor,
        isbn: data.isbn,
        categoria: data.categoria,
        disponibles: data.disponibles,
        copias: data.copias,
      });

      setOpen(false);
      toast({
        title: "Libro actualizado",
        description: "Los cambios han sido guardados exitosamente."
      });
    } catch (error) {
      console.error('Error al actualizar el libro:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el libro.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" className="flex w-full items-center justify-start">
          <Edit className="mr-2 h-4 w-4" />
          Editar
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar libro</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="autor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Autor</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isbn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ISBN</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.nombre}>
                          {category.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="disponibles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ejemplares disponibles</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="copias"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total de copias</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Guardar cambios
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

