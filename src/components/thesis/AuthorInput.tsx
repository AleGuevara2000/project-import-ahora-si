
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface AuthorInputProps {
  value: string;
  onChange: (value: string) => void;
}

const AuthorInput = ({ value, onChange }: AuthorInputProps) => (
  <div className="col-span-1">
    <Label htmlFor="autor">
      Autor <span className="text-red-500">*</span>
    </Label>
    <Input 
      id="autor"
      name="autor"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1"
    />
  </div>
);

export default AuthorInput;
