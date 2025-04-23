
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';
import { User } from '@/types';

interface MobileMenuProps {
  isMobile: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  user: User | null;
}

export const MobileMenu = ({ isMobile, mobileMenuOpen, setMobileMenuOpen, user }: MobileMenuProps) => {
  if (!isMobile) return null;

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="md:hidden text-primary-foreground hover:bg-primary/20 hover:text-white"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
      >
        <Menu className="h-6 w-6" />
        <span className="sr-only">Menú</span>
      </Button>

      {mobileMenuOpen && (
        <div className="md:hidden bg-primary border-t border-primary-foreground/20 mt-2 py-2">
          <nav className="flex flex-col space-y-2 px-4">
            <Link 
              to="/catalogo" 
              className="text-primary-foreground hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link 
              to="/ayuda" 
              className="text-primary-foreground hover:text-white transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Ayuda
            </Link>
            {user && (
              <Link 
                to="/mis-prestamos" 
                className="text-primary-foreground hover:text-white transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Mis préstamos
              </Link>
            )}
          </nav>
        </div>
      )}
    </>
  );
};
