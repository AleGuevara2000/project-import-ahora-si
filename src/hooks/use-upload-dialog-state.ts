
import { useState } from 'react';

export function useUploadDialogState() {
  const [open, setOpen] = useState(false);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedFileSize, setSelectedFileSize] = useState<number>();
  const [fileError, setFileError] = useState<string | null>(null);

  const clearFileSelection = () => {
    setIsFileSelected(false);
    setSelectedFileName(null);
    setSelectedFileSize(undefined);
  };

  return {
    open,
    setOpen,
    isFileSelected,
    setIsFileSelected,
    selectedFileName,
    setSelectedFileName,
    selectedFileSize,
    setSelectedFileSize,
    fileError,
    setFileError,
    clearFileSelection
  };
}
