
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Book } from '@/types';
import { UploadDigitalBookForm } from '../UploadDigitalBookForm';
import { UploadProgressIndicator } from '../UploadProgressIndicator';
import { UploadDigitalBookFormData } from '../schema';
import { UseFormReturn } from 'react-hook-form';

interface UploadFormContentProps {
  book: Book;
  form: UseFormReturn<UploadDigitalBookFormData>;
  isUploading: boolean;
  uploadProgress: number;
  uploadError: string | null;
  isFileSelected: boolean;
  fileError: string | null;
  selectedFileName: string | null;
  selectedFileSize?: number;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (data: UploadDigitalBookFormData) => Promise<void>;
  clearFileSelection: () => void;
}

export function UploadFormContent({
  book,
  form,
  isUploading,
  uploadProgress,
  uploadError,
  isFileSelected,
  fileError,
  selectedFileName,
  selectedFileSize,
  fileInputRef,
  onFileSelect,
  onSubmit,
  clearFileSelection
}: UploadFormContentProps) {
  // Create a wrapper function for the retry functionality
  const handleRetry = () => {
    // Get current form values and submit them
    const currentValues = form.getValues();
    onSubmit(currentValues);
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle>Subir versión digital de "{book.titulo}"</DialogTitle>
      </DialogHeader>
      
      <UploadDigitalBookForm
        form={form}
        isUploading={isUploading}
        isFileSelected={isFileSelected}
        fileError={fileError}
        selectedFileName={selectedFileName}
        selectedFileSize={selectedFileSize}
        fileInputRef={fileInputRef}
        onFileSelect={onFileSelect}
        onSubmit={onSubmit}
        clearFileSelection={clearFileSelection}
      />
      
      {(isUploading || uploadError) && (
        <UploadProgressIndicator 
          uploadProgress={uploadProgress} 
          error={uploadError}
          onRetry={handleRetry}
        />
      )}
    </>
  );
}
