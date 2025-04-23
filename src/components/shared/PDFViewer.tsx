
import React, { useState } from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ResponsiveDialog } from '@/components/ui/responsive-dialog';

interface PDFViewerProps {
  url: string;
  fileName?: string;
  fileFormat?: 'PDF' | 'EPUB' | 'MOBI' | 'HTML';
}

const PDFViewer = ({ url, fileName, fileFormat = 'PDF' }: PDFViewerProps) => {
  const { isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const handleOpenFile = () => {
    // For non-PDF and non-HTML formats, open in a new tab directly
    if (fileFormat !== 'PDF' && fileFormat !== 'HTML') {
      window.open(url, '_blank');
      return;
    }
    
    setOpen(true);
    setLoadError(false);
  };

  const handleIframeError = () => {
    console.log('Error loading document:', url);
    setLoadError(true);
  };

  // Para visualización en desarrollo usamos un PDF de ejemplo
  const fallbackUrl = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
  
  const getDialogTitle = () => {
    if (fileName) return fileName;
    return `Visualización de documento ${fileFormat || ''}`;
  };

  return (
    <ResponsiveDialog
      open={open}
      onOpenChange={setOpen}
      title={getDialogTitle()}
      className="max-w-4xl h-[80vh]"
      trigger={
        <Button 
          variant="ghost" 
          size="sm" 
          className="flex items-center gap-2 text-primary hover:text-primary/80"
          onClick={handleOpenFile}
        >
          <FileText className="h-4 w-4" />
          <span className="sr-only sm:not-sr-only sm:ml-1">
            {fileName ? 'Ver' : 'Ver documento'}
          </span>
        </Button>
      }
    >
      {loadError ? (
        <div className="flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">
            No se pudo cargar el documento. 
          </p>
          <p className="text-sm text-muted-foreground mb-4">
            Posibles razones:
            <ul className="list-disc pl-6 mt-2">
              <li>El enlace al documento no es accesible</li>
              <li>El formato del documento no es compatible con la visualización directa</li>
              <li>Restricciones de seguridad del navegador</li>
            </ul>
          </p>
          <div className="flex gap-2 mt-4">
            <Button 
              onClick={() => window.open(url, '_blank')}
              className="flex items-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Abrir en nueva pestaña
            </Button>
            <Button 
              variant="outline"
              onClick={() => {
                const link = document.createElement('a');
                link.href = url;
                link.download = fileName || `documento.${fileFormat?.toLowerCase() || 'pdf'}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Descargar
            </Button>
          </div>
        </div>
      ) : (
        <ScrollArea className="h-full w-full rounded-md">
          <iframe
            src={url.startsWith('http') ? url : fallbackUrl}
            className="w-full h-[calc(80vh-80px)]"
            title="Document Viewer"
            onError={handleIframeError}
            onLoad={() => console.log('Document loaded successfully')}
          />
        </ScrollArea>
      )}
    </ResponsiveDialog>
  );
};

export default PDFViewer;
