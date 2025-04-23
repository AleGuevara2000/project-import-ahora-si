
import React, { useCallback } from 'react';
import * as XLSX from 'xlsx';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp } from 'lucide-react';

interface DataImportProps {
  onImport: (data: any[]) => void;
  accept?: string;
}

const DataImport: React.FC<DataImportProps> = ({ 
  onImport,
  accept = ".csv,.json,.xlsx"
}) => {
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    reader.onload = (e) => {
      try {
        let data: any[] = [];
        
        if (fileExtension === 'json') {
          data = JSON.parse(e.target?.result as string);
        } else if (fileExtension === 'csv') {
          const text = e.target?.result as string;
          const rows = text.split('\n');
          const headers = rows[0].split(',');
          
          data = rows.slice(1).map(row => {
            const values = row.split(',');
            const obj: any = {};
            headers.forEach((header, index) => {
              obj[header.trim()] = values[index]?.trim();
            });
            return obj;
          });
        } else if (fileExtension === 'xlsx') {
          const workbook = XLSX.read(e.target?.result, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          data = XLSX.utils.sheet_to_json(worksheet);
        }

        onImport(data);
      } catch (error) {
        console.error('Error importing file:', error);
      }
    };

    if (fileExtension === 'json' || fileExtension === 'csv') {
      reader.readAsText(file);
    } else if (fileExtension === 'xlsx') {
      reader.readAsBinaryString(file);
    }
  }, [onImport]);

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <FileUp className="h-4 w-4" />
          <span>Importar datos</span>
        </div>
        <Input
          id="file-upload"
          type="file"
          className="hidden"
          accept={accept}
          onChange={handleFileChange}
        />
      </Label>
    </div>
  );
};

export default DataImport;
