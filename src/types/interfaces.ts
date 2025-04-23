
// Common interfaces for database models

// Book related interfaces
export interface IBook {
  id: string;
  titulo: string;
  autor: string;
  isbn: string;
  categoria: string;
  editorial: string;
  anioPublicacion: number;
  copias: number;
  disponibles: number;
  imagen?: string;
  ubicacion: string;
  descripcion?: string;
  archivo?: string | null;
}

export interface IBookCategory {
  id: string;
  nombre: string;
  descripcion?: string;
}

// Thesis related interfaces
export interface IThesis {
  id: string;
  titulo: string;
  autor: string;
  carrera: string;
  anio: number;
  director: string;
  tipo: 'Licenciatura' | 'Maestría' | 'Doctorado';
  disponible: boolean;
  resumen?: string;
  archivoPdf?: string;
}

// Digital Book related interfaces
export interface IDigitalBook {
  id: string;
  bookId: string;
  formato: 'PDF' | 'EPUB' | 'MOBI' | 'HTML';
  url: string;
  tamanioMb: number;
  fechaSubida: Date;
  resumen?: string;
  storage_path?: string; // Added this property to fix the type error
}

// Loan related interfaces
export interface ILoan {
  id: string;
  userId: string;
  bookId: string;
  fechaPrestamo: Date;
  fechaDevolucion: Date;
  estado: 'prestado' | 'devuelto' | 'retrasado';
  observaciones?: string;
  penalizacion?: {
    dias: number;
    razon: string;
    fechaAplicacion: Date;
  };
}

export interface IPrestamoConfig {
  role: string; // Using string instead of UserRole to avoid circular dependencies
  diasPrestamo: number;
  maxLibros: number;
}
