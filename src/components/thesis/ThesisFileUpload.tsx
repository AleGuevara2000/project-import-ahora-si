
import React from 'react';
import { Upload, FileX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ThesisFileUploadProps {
  archivoPdf: string | null | undefined;
  selectedFile: File | null;
  onFileChange: (file: File | null) => void;
  onDeleteFile: () => void;
  uploadProgress?: number;
}

const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB

const ThesisFileUpload = ({
  archivoPdf,
  selectedFile,
  onFileChange,
  onDeleteFile,
  uploadProgress = 0
}: ThesisFileUploadProps) => {
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes('pdf')) {
      toast({
        title: "Error",
        description: "Por favor seleccione un archivo PDF válido",
        variant: "destructive"
      });
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      toast({
        title: "Error",
        description: "El archivo no debe exceder 100MB",
        variant: "destructive"
      });
      return;
    }
    onFileChange(file);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileNameFromUrl = (url: string): string => {
    try {
      const urlParts = url.split('/');
      return urlParts[urlParts.length - 1];
    } catch (error) {
      return 'archivo.pdf';
    }
  };

  return (
    <div className="col-span-1 md:col-span-2">
      <Label htmlFor="archivoPdf">
        Archivo PDF de la tesis <span className="text-red-500">*</span>
      </Label>
      <div className="mt-1 space-y-2">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            id="archivoPdf"
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="flex-1"
          />
        </div>
        {selectedFile && (
          <div className="space-y-2">
            <div className="flex items-center justify-between p-2 bg-muted rounded-md">
              <div className="flex items-center gap-2 text-sm overflow-hidden">
                <Upload className="h-4 w-4 text-green-600 flex-shrink-0" />
                <span className="truncate">{selectedFile.name}</span>
                <span className="text-muted-foreground whitespace-nowrap">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onFileChange(null)}
                className="text-destructive hover:text-destructive ml-2 flex-shrink-0"
              >
                <FileX className="h-4 w-4" />
                <span className="sr-only">Eliminar archivo</span>
              </Button>
            </div>
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div className="space-y-1">
                <Progress value={uploadProgress} />
                <p className="text-sm text-muted-foreground">
                  Subiendo... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        )}
        {!selectedFile && archivoPdf && (
          <div className="flex items-center justify-between p-2 bg-muted rounded-md">
            <div className="flex items-center gap-2 text-sm overflow-hidden">
              <Upload className="h-4 w-4 text-blue-600 flex-shrink-0" />
              <span className="truncate">{getFileNameFromUrl(archivoPdf)}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDeleteFile}
              className="text-destructive hover:text-destructive ml-2 flex-shrink-0"
            >
              <FileX className="h-4 w-4" />
              <span className="sr-only">Eliminar archivo</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ThesisFileUpload;
