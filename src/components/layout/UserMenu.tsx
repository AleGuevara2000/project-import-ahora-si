
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LogOut, User, BookOpen, FileText, GraduationCap, Calendar } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { User as UserType, UserRole } from '@/types';
import { canManageBooks, canManageTheses, canManageDigitalBooks, isLibrarian } from '@/lib/user-utils';

interface UserMenuProps {
  user: UserType | null;
  logout: () => void;
  getUserDisplayName: () => string;
  isMobile: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const UserMenu = ({ user, logout, getUserDisplayName, isMobile, hasRole }: UserMenuProps) => {
  // Pre-calculate permission flags
  const userIsLibrarian = user ? isLibrarian(user) : false;
  const userCanManageBooks = user ? canManageBooks(user) : false;
  const userCanManageTheses = user ? canManageTheses(user) : false;
  const userCanManageDigitalBooks = user ? canManageDigitalBooks(user) : false;
  
  const isAdmin = hasRole('administrador');
  const showAdminSection = userIsLibrarian || userCanManageBooks || userCanManageTheses || userCanManageDigitalBooks || isAdmin;

  return (
    <div className="flex items-center">
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="bg-white text-primary">
              <User className="h-4 w-4 mr-2" />
              {!isMobile && getUserDisplayName()}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="z-50">
            <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="h-4 w-4 mr-2" />
              <span>{getUserDisplayName()}</span>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/mis-prestamos">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Mis préstamos</span>
              </Link>
            </DropdownMenuItem>
            {isMobile && showAdminSection && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Administración</DropdownMenuLabel>
                {userIsLibrarian && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/prestamos">
                      <Calendar className="h-4 w-4 mr-2" />
                      Gestionar préstamos
                    </Link>
                  </DropdownMenuItem>
                )}
                {userCanManageBooks && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/libros">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Gestionar libros
                    </Link>
                  </DropdownMenuItem>
                )}
                {userCanManageTheses && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/tesis">
                      <GraduationCap className="h-4 w-4 mr-2" />
                      Gestionar tesis
                    </Link>
                  </DropdownMenuItem>
                )}
                {userCanManageDigitalBooks && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin/ebooks">
                      <FileText className="h-4 w-4 mr-2" />
                      Gestionar libros digitales
                    </Link>
                  </DropdownMenuItem>
                )}
                {isAdmin && (
                  <>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/usuarios">Gestionar usuarios</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/admin/configuracion">Configuración</Link>
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" />
              <span>Cerrar sesión</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/login">
          <Button variant="outline" size="sm" className="bg-white text-primary">
            Iniciar sesión
          </Button>
        </Link>
      )}
    </div>
  );
};
