
import React from 'react';
import { FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FileText } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getFormattedSize } from '@/utils/fileValidation';

interface FileUploadFieldProps {
  selectedFormat: string;
  selectedFileName: string | null;
  selectedFileSize?: number;
  fileError: string | null;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

export function FileUploadField({
  selectedFormat,
  selectedFileName,
  selectedFileSize,
  fileError,
  onFileSelect,
  fileInputRef
}: FileUploadFieldProps) {
  return (
    <div className="space-y-2">
      <FormLabel>Archivo digital</FormLabel>
      <Input 
        type="file" 
        accept={`.${selectedFormat?.toLowerCase()}`}
        onChange={onFileSelect}
        ref={fileInputRef}
        className="cursor-pointer"
      />
      
      {selectedFileName && !fileError && (
        <div className="mt-2 p-3 border rounded-md bg-muted/10">
          <div className="flex items-start gap-2">
            <FileText className="h-5 w-5 mt-0.5 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{selectedFileName}</p>
              <div className="flex gap-2 text-xs text-muted-foreground">
                {selectedFileSize && (
                  <span>Tamaño: {getFormattedSize(selectedFileSize)} MB</span>
                )}
                {selectedFormat && (
                  <span>Formato: {selectedFormat}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      {fileError && (
        <Alert variant="destructive">
          <AlertDescription>{fileError}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
