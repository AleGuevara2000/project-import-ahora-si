
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface SummaryTextareaProps {
  value: string;
  onChange: (value: string) => void;
}

const SummaryTextarea = ({ value, onChange }: SummaryTextareaProps) => (
  <div className="col-span-1 md:col-span-2">
    <Label htmlFor="resumen">
      Resumen
    </Label>
    <Textarea 
      id="resumen"
      name="resumen"
      value={value}
      onChange={e => onChange(e.target.value)}
      className="mt-1"
      rows={4}
    />
  </div>
);

export default SummaryTextarea;
