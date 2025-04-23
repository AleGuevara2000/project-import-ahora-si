
import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { BookCategory } from '@/types';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Fix: Make sure the schema matches the BookCategory type requirements
const categoriaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  descripcion: z.string().optional(),
});

type CategoriaFormData = z.infer<typeof categoriaSchema>;

interface CategoriaDialogProps {
  onAddCategoria: (categoria: Omit<BookCategory, 'id'>) => void;
}

export function CategoriaDialog({ onAddCategoria }: CategoriaDialogProps) {
  const [open, setOpen] = React.useState(false);
  
  const form = useForm<CategoriaFormData>({
    resolver: zodResolver(categoriaSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    },
  });

  const onSubmit = (data: CategoriaFormData) => {
    // Fix: Ensure that the data being passed conforms to the expected type
    // Since BookCategory requires nombre to be non-optional, and our form validates that nombre is provided,
    // we can safely cast this to Omit<BookCategory, 'id'>
    onAddCategoria({
      nombre: data.nombre, // This is guaranteed to be non-empty due to validation
      descripcion: data.descripcion || '' // Make sure this is always a string
    });
    form.reset();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nueva categoría
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar nueva categoría</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre de la categoría" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (opcional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Descripción de la categoría"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full">
              Agregar categoría
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
