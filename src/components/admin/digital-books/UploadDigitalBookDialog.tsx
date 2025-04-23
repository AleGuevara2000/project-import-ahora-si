
import React, { useRef } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Book } from '@/types';
import { useDigitalBookUpload } from '@/hooks/use-digital-book-upload';
import { uploadFormSchema, UploadDigitalBookFormData } from './schema';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { UploadDigitalBookTrigger } from './UploadDigitalBookTrigger';
import { useUploadDialogState } from '@/hooks/use-upload-dialog-state';
import { useFileSelection } from '@/hooks/use-file-selection';
import { UploadFormContent } from './dialog/UploadFormContent';

interface UploadDigitalBookDialogProps {
  book: Book;
  onUploadComplete: (data: {
    formato: string;
    url: string;
    tamanioMb: number;
    resumen?: string;
    storage_path?: string;
  }) => void;
}

export function UploadDigitalBookDialog({ book, onUploadComplete }: UploadDigitalBookDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dialogState = useUploadDialogState();
  
  const { isUploading, uploadProgress, uploadError, handleUpload } = useDigitalBookUpload(book, (data) => {
    onUploadComplete(data);
    setTimeout(() => dialogState.setOpen(false), 1500);
  });

  const form = useForm<UploadDigitalBookFormData>({
    resolver: zodResolver(uploadFormSchema),
    defaultValues: {
      formato: 'PDF',
    },
  });

  const handleFileSelect = useFileSelection({
    form,
    setIsFileSelected: dialogState.setIsFileSelected,
    setSelectedFileName: dialogState.setSelectedFileName,
    setSelectedFileSize: dialogState.setSelectedFileSize,
    setFileError: dialogState.setFileError
  });

  const handleSubmit = async (data: UploadDigitalBookFormData) => {
    try {
      if (data.file) {
        await handleUpload(data.file, data.formato, data.resumen);
      }
    } catch (error) {
      console.error('Error handling submission:', error);
    }
  };

  return (
    <Dialog 
      open={dialogState.open} 
      onOpenChange={(newOpen) => {
        if (isUploading && !newOpen) return;
        dialogState.setOpen(newOpen);
        if (newOpen) {
          dialogState.clearFileSelection();
          form.reset({
            formato: 'PDF',
            resumen: '',
          });
        }
      }}
    >
      <DialogTrigger asChild>
        <UploadDigitalBookTrigger />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <UploadFormContent
          book={book}
          form={form}
          isUploading={isUploading}
          uploadProgress={uploadProgress}
          uploadError={uploadError}
          isFileSelected={dialogState.isFileSelected}
          fileError={dialogState.fileError}
          selectedFileName={dialogState.selectedFileName}
          selectedFileSize={dialogState.selectedFileSize}
          fileInputRef={fileInputRef}
          onFileSelect={handleFileSelect}
          onSubmit={handleSubmit}
          clearFileSelection={dialogState.clearFileSelection}
        />
      </DialogContent>
    </Dialog>
  );
}
