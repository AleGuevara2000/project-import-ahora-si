
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Library, FileText, BookOpen, GraduationCap, Calendar, Users } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { User } from '@/types';
import { canManageBooks, canManageTheses, canManageDigitalBooks, isLibrarian, canManageUsers } from '@/lib/user-utils';

interface DesktopNavProps {
  user: User | null;
}

export const DesktopNav = ({ user }: DesktopNavProps) => {
  // Usamos useMemo para calcular los permisos solo cuando el usuario cambia
  const userPermissions = useMemo(() => {
    return {
      isLibrarian: user ? isLibrarian(user) : false,
      canManageBooks: user ? canManageBooks(user) : false,
      canManageTheses: user ? canManageTheses(user) : false,
      canManageDigitalBooks: user ? canManageDigitalBooks(user) : false,
      canManageUsers: user ? canManageUsers(user) : false
    };
  }, [user]);
  
  // Solo mostrar menú de admin si el usuario tiene al menos un permiso de gestión
  const showAdminMenu = useMemo(() => {
    const { isLibrarian, canManageBooks, canManageTheses, canManageDigitalBooks, canManageUsers } = userPermissions;
    return isLibrarian || canManageBooks || canManageTheses || canManageDigitalBooks || canManageUsers;
  }, [userPermissions]);
  
  return (
    <nav className="hidden md:flex items-center space-x-4">
      <Link to="/" className="text-primary-foreground hover:text-white transition-colors text-sm lg:text-base">
        Inicio
      </Link>
      <Link to="/catalogo" className="text-primary-foreground hover:text-white transition-colors text-sm lg:text-base">
        Catálogo
      </Link>
      <Link to="/ayuda" className="text-primary-foreground hover:text-white transition-colors text-sm lg:text-base">
        Ayuda
      </Link>
      {user && (
        <Link to="/mis-prestamos" className="text-primary-foreground hover:text-white transition-colors text-sm lg:text-base">
          Mis préstamos
        </Link>
      )}
      {user && showAdminMenu && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-primary-foreground hover:bg-primary/20 hover:text-white text-sm lg:text-base transition-all duration-200 ease-in-out"
            >
              <Library className="h-4 w-4 mr-2" />
              Gestionar recursos
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            className="bg-white z-50 w-56 lg:w-64 p-2"
            align="end"
            sideOffset={5}
          >
            {userPermissions.isLibrarian && (
              <>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/admin/prestamos" 
                    className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Calendar className="h-4 w-4" />
                    Gestionar préstamos
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link 
                    to="/admin/usuarios" 
                    className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <Users className="h-4 w-4" />
                    Gestionar usuarios
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
              </>
            )}
            {userPermissions.canManageBooks && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/libros" 
                  className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <BookOpen className="h-4 w-4" />
                  Gestionar libros
                </Link>
              </DropdownMenuItem>
            )}
            {userPermissions.canManageTheses && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/tesis" 
                  className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <GraduationCap className="h-4 w-4" />
                  Gestionar tesis
                </Link>
              </DropdownMenuItem>
            )}
            {userPermissions.canManageDigitalBooks && (
              <DropdownMenuItem asChild>
                <Link 
                  to="/admin/ebooks" 
                  className="flex w-full items-center gap-2 text-sm lg:text-base p-2 rounded-md hover:bg-gray-100 transition-colors"
                >
                  <FileText className="h-4 w-4" />
                  Gestionar libros digitales
                </Link>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </nav>
  );
};
