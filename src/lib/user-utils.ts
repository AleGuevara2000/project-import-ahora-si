
import { User, UserRole } from '@/types';

export const isLibrarian = (user: User | null): boolean => {
  if (!user) return false;
  
  // Check both email and role for flexibility
  return user.email === 'biblioteca@mixteco.utm.mx' || 
         user.email === 'admin@mixteco.utm.mx' || 
         user.role === 'bibliotecario' ||
         user.role === 'administrador';
};

export const canManageDigitalBooks = (user: User | null): boolean => {
  return true; // Allow all users to manage digital books
};

export const canManageBooks = (user: User | null): boolean => {
  return true; // Allow all users to manage books
};

export const canManageTheses = (user: User | null): boolean => {
  if (!user) return false;
  // Allow librarians and administrators to manage theses
  return isLibrarian(user);
};

export const canManageUsers = (user: User | null): boolean => {
  if (!user) return false;
  // Solo administradores y bibliotecarios pueden gestionar usuarios
  return user.role === 'administrador' || user.role === 'bibliotecario';
};

// New function to check module access permissions
export const hasModuleAccess = (user: User | null, moduleId: string): 'permitir' | 'restringir' | 'ocultar' => {
  if (!user) return 'ocultar';
  
  // For now, return default permissions based on role and module
  // Later this could be fetched from a database
  
  // Define default permissions map
  const defaultPermissions: Record<string, Record<UserRole, 'permitir' | 'restringir' | 'ocultar'>> = {
    'libros': {
      estudiante: 'restringir',
      profesor: 'permitir',
      tecnico: 'permitir',
      administrativo: 'permitir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    },
    'ebooks': {
      estudiante: 'permitir',
      profesor: 'permitir',
      tecnico: 'permitir',
      administrativo: 'permitir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    },
    'prestamos': {
      estudiante: 'restringir',
      profesor: 'restringir',
      tecnico: 'restringir',
      administrativo: 'restringir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    },
    'usuarios': {
      estudiante: 'ocultar',
      profesor: 'ocultar',
      tecnico: 'ocultar',
      administrativo: 'ocultar',
      operativo: 'ocultar',
      bibliotecario: 'restringir',
      administrador: 'permitir',
    },
    'tesis': {
      estudiante: 'restringir',
      profesor: 'permitir',
      tecnico: 'restringir',
      administrativo: 'restringir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    },
    'configuracion': {
      estudiante: 'ocultar',
      profesor: 'ocultar',
      tecnico: 'ocultar',
      administrativo: 'ocultar',
      operativo: 'ocultar',
      bibliotecario: 'ocultar',
      administrador: 'permitir',
    },
    'permisos': {
      estudiante: 'ocultar',
      profesor: 'ocultar',
      tecnico: 'ocultar',
      administrativo: 'ocultar',
      operativo: 'ocultar',
      bibliotecario: 'ocultar',
      administrador: 'permitir',
    }
  };
  
  // Admin always has access to everything
  if (user.role === 'administrador') return 'permitir';
  
  // Return the permission for the user's role and requested module
  // Default to 'ocultar' if the module is not found
  return defaultPermissions[moduleId]?.[user.role] || 'ocultar';
};

// Función para determinar si un usuario puede omitir la autenticación para acciones de biblioteca
export const canSkipAuthForLibraryActions = (user: any): boolean => {
  if (!user) return false;
  return user.role === 'administrador' || user.role === 'bibliotecario';
};
