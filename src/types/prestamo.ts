
import { ILoan, IPrestamoConfig } from './interfaces';
import { UserRole } from './user';

// Create a type that extends IPrestamoConfig but uses UserRole
export interface PrestamoConfig extends Omit<IPrestamoConfig, 'role'> {
  role: UserRole;
}

export type Prestamo = ILoan;

export const mockPrestamos: Prestamo[] = [
  {
    id: '1',
    userId: '4',
    bookId: '1',
    fechaPrestamo: new Date('2023-05-10'),
    fechaDevolucion: new Date('2023-05-24'),
    estado: 'prestado',
  },
  {
    id: '2',
    userId: '3',
    bookId: '2',
    fechaPrestamo: new Date('2023-05-05'),
    fechaDevolucion: new Date('2023-06-05'),
    estado: 'prestado',
  },
  {
    id: '3',
    userId: '5',
    bookId: '3',
    fechaPrestamo: new Date('2023-04-20'),
    fechaDevolucion: new Date('2023-05-04'),
    estado: 'retrasado',
    penalizacion: {
      dias: 15,
      razon: 'Devolución con retraso significativo',
      fechaAplicacion: new Date('2023-05-04'),
    },
  },
  {
    id: '4',
    userId: '4',
    bookId: '6',
    fechaPrestamo: new Date('2023-04-15'),
    fechaDevolucion: new Date('2023-04-29'),
    estado: 'devuelto',
  },
];

export const defaultPrestamoConfig: PrestamoConfig[] = [
  { role: 'estudiante', diasPrestamo: 14, maxLibros: 3 },
  { role: 'profesor', diasPrestamo: 30, maxLibros: 5 },
  { role: 'tecnico', diasPrestamo: 21, maxLibros: 3 },
  { role: 'administrativo', diasPrestamo: 14, maxLibros: 2 },
  { role: 'operativo', diasPrestamo: 7, maxLibros: 1 },
  { role: 'bibliotecario', diasPrestamo: 30, maxLibros: 5 },
  { role: 'administrador', diasPrestamo: 30, maxLibros: 5 },
];
