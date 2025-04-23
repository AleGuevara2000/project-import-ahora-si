import React, { useState } from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PencilIcon } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { DigitalBook } from '@/types/digitalBook';
import { Textarea } from '@/components/ui/textarea';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';
import { useToast } from '@/hooks/use-toast';
import { editDigitalBookSchema, EditDigitalBookFormData } from '@/components/admin/digital-books/schema';
import PDFViewer from '@/components/shared/PDFViewer';

interface EditDigitalBookDialogProps {
  digitalBook: DigitalBook;
  onEdit: (data: Partial<DigitalBook>) => void;
}

export function EditDigitalBookDialog({ digitalBook, onEdit }: EditDigitalBookDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<EditDigitalBookFormData>({
    resolver: zodResolver(editDigitalBookSchema),
    defaultValues: {
      formato: digitalBook.formato,
      resumen: digitalBook.resumen,
      url: digitalBook.url,
    },
  });

  const onSubmit = async (data: EditDigitalBookFormData) => {
    try {
      setIsSubmitting(true);
      
      // Keep existing validation logic for URL extension
      const urlExtension = data.url.split('.').pop()?.toLowerCase();
      const formatoExtensionMap: Record<string, string[]> = {
        'PDF': ['pdf'],
        'EPUB': ['epub'],
        'MOBI': ['mobi', 'azw', 'azw3'],
        'HTML': ['html', 'htm']
      };
      
      const validExtensions = formatoExtensionMap[data.formato] || [];
      
      if (urlExtension && !validExtensions.includes(urlExtension)) {
        toast({
          title: "Advertencia",
          description: `La extensión del archivo (.${urlExtension}) no coincide con el formato seleccionado (${data.formato})`,
          variant: "destructive"
        });
        setIsSubmitting(false);
        return;
      }

      // Llamar a la función de edición
      onEdit(data);
      
      toast({
        title: "Cambios guardados",
        description: "Los cambios al libro digital han sido guardados exitosamente."
      });
      
      setOpen(false);
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios. Intente nuevamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <PencilIcon className="h-4 w-4" />
        <span className="sr-only">Editar</span>
      </Button>

      <ResponsiveDialog
        open={open}
        onOpenChange={(newState) => {
          if (isSubmitting && !newState) return;
          setOpen(newState);
        }}
        title="Editar archivo digital"
        footer={
          <Button 
            type="submit" 
            form="edit-digital-book-form" 
            className="w-full sm:w-auto"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Guardando...' : 'Guardar cambios'}
          </Button>
        }
      >
        <Form {...form}>
          <form id="edit-digital-book-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="formato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Formato</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar formato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="PDF">PDF</SelectItem>
                      <SelectItem value="EPUB">EPUB</SelectItem>
                      <SelectItem value="MOBI">MOBI</SelectItem>
                      <SelectItem value="HTML">HTML</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-4 border rounded-lg bg-muted/10">
              <p className="text-sm font-medium mb-2">Archivo digital actual:</p>
              <PDFViewer 
                url={digitalBook.url} 
                fileName={`Archivo ${digitalBook.formato}`} 
                fileFormat={digitalBook.formato}
              />
            </div>
            
            <FormField
              control={form.control}
              name="resumen"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Resumen</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Ingrese un resumen del archivo digital"
                      className="min-h-[100px]"
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
      </ResponsiveDialog>
    </>
  );
}
