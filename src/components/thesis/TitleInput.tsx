
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface TitleInputProps {
  value: string;
  onChange: (value: string) => void;
}

const TitleInput = ({ value, onChange }: TitleInputProps) => (
  <div className="col-span-1 md:col-span-2">
    <Label htmlFor="titulo">
      Título <span className="text-red-500">*</span>
    </Label>
    <Input 
      id="titulo"
      name="titulo"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1"
    />
  </div>
);

export default TitleInput;
