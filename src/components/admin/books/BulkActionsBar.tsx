
import React from 'react';
import { Button } from '@/components/ui/button';

interface BulkActionsBarProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
  onBulkDelete: () => void;
  onExportSelected: () => void;
  disabled?: boolean;
}

const BulkActionsBar: React.FC<BulkActionsBarProps> = ({
  selectedCount,
  totalCount,
  onSelectAll,
  onBulkDelete,
  onExportSelected,
  disabled
}) => {
  return (
    <div className="flex items-center gap-4 mt-3 bg-muted rounded px-4 py-2 border">
      <input
        type="checkbox"
        checked={selectedCount === totalCount && totalCount > 0}
        onChange={(e) => onSelectAll(e.target.checked)}
        className="accent-primary"
        aria-label="Seleccionar todos"
      />
      <span>
        {selectedCount} seleccionados
      </span>
      <Button
        variant="destructive"
        size="sm"
        onClick={onBulkDelete}
        disabled={disabled}
      >
        Eliminar seleccionados
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={onExportSelected}
        disabled={disabled}
      >
        Exportar seleccionados
      </Button>
    </div>
  );
};

export default BulkActionsBar;
