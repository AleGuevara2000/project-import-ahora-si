
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface YearInputProps {
  value: number;
  onChange: (value: number) => void;
}

const YearInput = ({ value, onChange }: YearInputProps) => (
  <div className="col-span-1">
    <Label htmlFor="anio">
      Año
    </Label>
    <Input 
      id="anio"
      name="anio"
      type="number"
      value={value}
      onChange={e => onChange(parseInt(e.target.value))}
      className="mt-1"
    />
  </div>
);

export default YearInput;
