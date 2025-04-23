
import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ThesisTypeSelectProps {
  value: string;
  onChange: (value: string) => void;
}

const ThesisTypeSelect = ({ value, onChange }: ThesisTypeSelectProps) => (
  <div className="col-span-1">
    <Label htmlFor="tipo">
      Tipo de tesis <span className="text-red-500">*</span>
    </Label>
    <Select 
      value={value}
      onValueChange={onChange}
    >
      <SelectTrigger className="mt-1">
        <SelectValue placeholder="Selecciona el tipo" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Licenciatura">Licenciatura</SelectItem>
        <SelectItem value="Maestría">Maestría</SelectItem>
        <SelectItem value="Doctorado">Doctorado</SelectItem>
      </SelectContent>
    </Select>
  </div>
);

export default ThesisTypeSelect;
