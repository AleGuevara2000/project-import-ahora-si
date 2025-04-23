
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

export const HeaderLogo = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="flex items-center space-x-2">
      <Link to="/" className="flex items-center">
        <Button 
          variant="ghost" 
          size={isMobile ? "icon" : "default"}
          className="text-primary-foreground hover:bg-primary/20 hover:text-white flex items-center"
        >
          <Home className="h-5 w-5 mr-2" />
          {!isMobile && "Inicio"}
          <span className="sr-only">Inicio</span>
        </Button>
      </Link>

      <Link to="/" className="flex items-center">
        <img alt="Universidad Tecnológica de la Mixteca" className="h-12 mr-3" src="/lovable-uploads/da5d1cb5-c9ee-4a74-8eee-4ca375d69604.jpg" />
        <div className="flex flex-col">
          <span className="text-lg font-bold tracking-tight">Biblioteca</span>
          <span className="text-xs tracking-tight">Universidad Tecnológica de la Mixteca</span>
        </div>
      </Link>
    </div>
  );
};
