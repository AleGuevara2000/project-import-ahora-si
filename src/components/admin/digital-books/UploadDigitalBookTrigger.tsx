
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

interface UploadDigitalBookTriggerProps {
  onClick?: () => void;
}

export function UploadDigitalBookTrigger({ onClick }: UploadDigitalBookTriggerProps) {
  return (
    <Button size="sm" onClick={onClick}>
      <Save className="mr-2 h-4 w-4" />
      Subir versión digital
    </Button>
  );
}
