
import React from 'react';
import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const formats = [
  { value: 'PDF', label: 'PDF' },
  { value: 'EPUB', label: 'EPUB' },
  { value: 'MOBI', label: 'MOBI' },
  { value: 'HTML', label: 'HTML' },
] as const;

interface UploadDigitalBookFormatsProps {
  value: string;
  onValueChange: (value: string) => void;
  onFormatChange?: () => void;
}

export function UploadDigitalBookFormats({ value, onValueChange, onFormatChange }: UploadDigitalBookFormatsProps) {
  return (
    <FormItem>
      <FormLabel>Formato</FormLabel>
      <Select 
        value={value} 
        onValueChange={(value) => {
          onValueChange(value);
          onFormatChange?.();
        }}
      >
        <FormControl>
          <SelectTrigger>
            <SelectValue placeholder="Seleccionar formato" />
          </SelectTrigger>
        </FormControl>
        <SelectContent>
          {formats.map(format => (
            <SelectItem key={format.value} value={format.value}>
              {format.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </FormItem>
  );
}
