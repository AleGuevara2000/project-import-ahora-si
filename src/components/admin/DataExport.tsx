import React from 'react';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, BookOpen } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DataExportProps {
  data: any[];
  filename: string;
  buttonLabel?: string;
  variant?: 'default' | 'outline' | 'secondary' | 'ghost' | 'link' | 'destructive';
}

const DataExport: React.FC<DataExportProps> = ({ 
  data, 
  filename, 
  buttonLabel = 'Exportar datos', 
  variant = 'outline' 
}) => {
  if (!data || data.length === 0) {
    return null;
  }

  const exportToJSON = () => {
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    saveAs(blob, `${filename}.json`);
  };

  const exportToCSV = () => {
    // Convert data to CSV format
    const replacer = (key: string, value: any) => value === null ? '' : value;
    const header = Object.keys(data[0]);
    let csv = data.map(row => header.map(fieldName => 
      JSON.stringify(row[fieldName], replacer)).join(','));
    csv.unshift(header.join(','));
    const csvString = csv.join('\r\n');
    
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}.csv`);
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Data');
    XLSX.writeFile(workbook, `${filename}.xlsx`);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Add header
    doc.setFillColor(52, 131, 235);
    doc.rect(0, 0, doc.internal.pageSize.width, 40, 'F');
    
    // Add library icon
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.text('📚', 20, 20);
    
    // Add system name
    doc.setFont("helvetica", "bold");
    doc.text('Biblioteca Digital Universitaria', 40, 20);
    
    // Add export info
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Reporte: ${filename}`, 40, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 40, 35);

    // Add table with data
    const header = Object.keys(data[0]);
    const rows = data.map(obj => Object.values(obj));

    autoTable(doc, {
      head: [header],
      body: rows,
      startY: 50,
      theme: 'grid',
      styles: { 
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [52, 131, 235],
        textColor: [255, 255, 255],
        fontStyle: 'bold'
      }
    });

    doc.save(`${filename}.pdf`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={variant} size="sm">
          <Download className="mr-2 h-4 w-4" />
          {buttonLabel}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={exportToCSV}>
          Exportar como CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON}>
          Exportar como JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel}>
          Exportar como Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF}>
          Exportar como PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default DataExport;
