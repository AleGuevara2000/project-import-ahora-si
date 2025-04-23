
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DirectorInputProps {
  value: string;
  onChange: (value: string) => void;
}

const DirectorInput = ({ value, onChange }: DirectorInputProps) => (
  <div className="col-span-1">
    <Label htmlFor="director">
      Director de tesis <span className="text-red-500">*</span>
    </Label>
    <Input 
      id="director"
      name="director"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1"
    />
  </div>
);

export default DirectorInput;
