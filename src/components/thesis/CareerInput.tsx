
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface CareerInputProps {
  value: string;
  onChange: (value: string) => void;
}

const CareerInput = ({ value, onChange }: CareerInputProps) => (
  <div className="col-span-1">
    <Label htmlFor="carrera">
      Carrera <span className="text-red-500">*</span>
    </Label>
    <Input 
      id="carrera"
      name="carrera"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1"
    />
  </div>
);

export default CareerInput;
