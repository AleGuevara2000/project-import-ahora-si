
import React, { useState } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface BarcodeScannerProps {
  onScan: (isbn: string) => void;
}

const BarcodeScanner = ({ onScan }: BarcodeScannerProps) => {
  const [error, setError] = useState<string>("");

  const handleUpdate = (err: any, result: any) => {
    if (result) {
      onScan(result.text);
    }
    if (err) {
      if (err.name === "NotAllowedError") {
        setError("Por favor permite el acceso a la cámara para escanear códigos de barras.");
      } else if (err.name === "NotFoundError") {
        setError("No se encontró ninguna cámara en tu dispositivo.");
      } else {
        setError("Error al intentar escanear: " + err.message);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Camera className="mr-2 h-4 w-4" />
          Escanear ISBN
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Escanear código de barras</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center space-y-4">
          <div className="w-full max-w-sm aspect-square relative">
            <BarcodeScannerComponent
              width="100%"
              height="100%"
              onUpdate={handleUpdate}
            />
          </div>
          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Coloca el código de barras del libro frente a la cámara
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BarcodeScanner;
