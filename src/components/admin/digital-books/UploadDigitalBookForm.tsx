
import React from 'react';
import { Form, FormField } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';
import { FileUploadField } from './FileUploadField';
import { UploadDigitalBookFormats } from './UploadDigitalBookFormats';
import { FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { UseFormReturn } from 'react-hook-form';
import { UploadDigitalBookFormData } from './schema';

interface UploadDigitalBookFormProps {
  form: UseFormReturn<UploadDigitalBookFormData>;
  isUploading: boolean;
  isFileSelected: boolean;
  fileError: string | null;
  selectedFileName: string | null;
  selectedFileSize?: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: UploadDigitalBookFormData) => Promise<void>;
  clearFileSelection: () => void;
}

export function UploadDigitalBookForm({
  form,
  isUploading,
  isFileSelected,
  fileError,
  selectedFileName,
  selectedFileSize,
  fileInputRef,
  onFileSelect,
  onSubmit,
  clearFileSelection
}: UploadDigitalBookFormProps) {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="formato"
          render={({ field }) => (
            <UploadDigitalBookFormats
              value={field.value}
              onValueChange={field.onChange}
              onFormatChange={clearFileSelection}
            />
          )}
        />
        
        <FileUploadField
          selectedFormat={form.getValues('formato')}
          selectedFileName={selectedFileName}
          selectedFileSize={selectedFileSize}
          fileError={fileError}
          onFileSelect={onFileSelect}
          fileInputRef={fileInputRef}
        />
        
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
                  className="min-h-[80px]"
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full"
          disabled={!isFileSelected || isUploading || !!fileError}
        >
          {isUploading ? (
            <>Subiendo archivo ({Math.round(0)}%)...</>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Guardar archivo
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
