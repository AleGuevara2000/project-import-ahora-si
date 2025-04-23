
import React from "react";
import { DigitalBook, mockDigitalBooks } from "@/types/digitalBook";
import PDFViewer from "@/components/shared/PDFViewer";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";

type DigitalFilesButtonGroupProps = {
  bookId: string;
};

const formatosOrden = ["PDF", "EPUB", "MOBI", "HTML"] as const;

const DigitalFilesButtonGroup: React.FC<DigitalFilesButtonGroupProps> = ({ bookId }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return null;

  const archivos = mockDigitalBooks.filter(d => d.bookId === bookId);
  if (!archivos.length) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {formatosOrden.map((formato) => {
        const archivo = archivos.find(a => a.formato === formato);
        if (!archivo) return null;

        // PDF y HTML usan PDFViewer, otros solo botón descarga
        if (formato === "PDF" || formato === "HTML") {
          return (
            <PDFViewer
              key={archivo.id}
              url={archivo.url}
              fileName={`${archivo.formato}: ${archivo.url.split('/').pop()}`}
              fileFormat={archivo.formato}
            />
          );
        }
        return (
          <Button
            key={archivo.id}
            size="sm"
            variant="ghost"
            asChild
          >
            <a
              href={archivo.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2"
              title={`Descargar versión ${archivo.formato}`}
            >
              <FileText className="h-4 w-4" />
              {archivo.formato}
              <Download className="h-4 w-4" />
            </a>
          </Button>
        );
      })}
    </div>
  );
};

export default DigitalFilesButtonGroup;
