
import React from 'react';
import TitleInput from './TitleInput';
import AuthorInput from './AuthorInput';
import CareerInput from './CareerInput';
import DirectorInput from './DirectorInput';
import ThesisTypeSelect from './ThesisTypeSelect';
import YearInput from './YearInput';
import SummaryTextarea from './SummaryTextarea';
import ThesisFileUpload from './ThesisFileUpload';

import { Thesis } from '@/types';

interface ThesisFormProps {
  thesis?: Partial<Thesis>;
  onFileChange: (file: File | null) => void;
  onChange: (field: string, value: any) => void;
  selectedFile: File | null;
  uploadProgress?: number;
}

export const ThesisForm = ({
  thesis,
  onFileChange,
  onChange,
  selectedFile,
  uploadProgress = 0
}: ThesisFormProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <TitleInput
        value={thesis?.titulo || ''}
        onChange={value => onChange('titulo', value)}
      />
      <AuthorInput
        value={thesis?.autor || ''}
        onChange={value => onChange('autor', value)}
      />
      <CareerInput
        value={thesis?.carrera || ''}
        onChange={value => onChange('carrera', value)}
      />
      <DirectorInput
        value={thesis?.director || ''}
        onChange={value => onChange('director', value)}
      />
      <ThesisTypeSelect
        value={thesis?.tipo || 'Licenciatura'}
        onChange={value => onChange('tipo', value)}
      />
      <YearInput
        value={thesis?.anio || new Date().getFullYear()}
        onChange={value => onChange('anio', value)}
      />
      <SummaryTextarea
        value={thesis?.resumen || ''}
        onChange={value => onChange('resumen', value)}
      />
      <ThesisFileUpload
        archivoPdf={thesis?.archivoPdf}
        selectedFile={selectedFile}
        onFileChange={onFileChange}
        onDeleteFile={() => {
          onFileChange(null);
          onChange('archivoPdf', null);
        }}
        uploadProgress={uploadProgress}
      />
    </div>
  );
};
