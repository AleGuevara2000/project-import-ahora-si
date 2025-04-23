
export type UserRole = 'estudiante' | 'profesor' | 'tecnico' | 'administrativo' | 'operativo' | 'bibliotecario' | 'administrador';

export interface User {
  id: string;
  email: string;
  nombre: string;
  apellidos: string;
  role: UserRole;
  avatar?: string;
  createdAt: Date;
  canSkipAuth?: boolean;
}

export function assignRoleBasedOnEmail(email: string): UserRole {
  // Explicitly handle admin emails
  if (email === 'admin@mixteco.utm.mx') {
    return 'administrador';
  }

  // Automatically assign 'estudiante' role to gs.utm.mx domain users
  if (email.endsWith('@gs.utm.mx')) {
    return 'estudiante';
  }

  // For other domains, keep existing logic
  const defaultRoleMap: Record<string, UserRole> = {
    'mixteco.utm.mx': 'profesor',
    'admin.utm.mx': 'administrador',
    // Add more domain-role mappings as needed
  };

  const domain = email.split('@')[1];
  return defaultRoleMap[domain] || 'estudiante'; // Default to estudiante if no match
}

export const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@mixteco.utm.mx',
    nombre: 'Admin',
    apellidos: 'Sistema',
    role: 'administrador',
    createdAt: new Date('2023-01-01'),
    canSkipAuth: true
  },
  {
    id: '2',
    email: 'biblioteca@mixteco.utm.mx',
    nombre: 'Bibliotecario',
    apellidos: 'Principal',
    role: 'bibliotecario',
    createdAt: new Date('2023-01-02'),
    canSkipAuth: true
  },
  {
    id: '3',
    email: 'profesor@mixteco.utm.mx',
    nombre: 'Juan',
    apellidos: 'Pérez López',
    role: 'profesor',
    createdAt: new Date('2023-01-03'),
  },
  {
    id: '5',
    email: 'tecnico@mixteco.utm.mx',
    nombre: 'Roberto',
    apellidos: 'Ramírez Torres',
    role: 'tecnico',
    createdAt: new Date('2023-01-05'),
  },
  {
    id: '6',
    email: 'admin@mixteco.utm.mx',
    nombre: 'Carmen',
    apellidos: 'Rodríguez Jiménez',
    role: 'administrativo',
    createdAt: new Date('2023-01-06'),
  },
  {
    id: '7',
    email: 'estudiante@gs.utm.mx',
    nombre: 'Juan',
    apellidos: 'Méndez López',
    role: 'estudiante',
    createdAt: new Date('2024-04-19'),
  },
];
