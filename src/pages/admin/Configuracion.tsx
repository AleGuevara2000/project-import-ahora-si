
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Shield, Settings, Save, AlertCircle, Users, BookOpen, GraduationCap } from 'lucide-react';
import { UserRole, PrestamoConfig, defaultPrestamoConfig } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const Configuracion = () => {
  const navigate = useNavigate();
  const { user, hasRole } = useAuth();
  const { toast } = useToast();
  const [configuraciones, setConfiguraciones] = useState<PrestamoConfig[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!hasRole('administrador')) {
      navigate('/');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setConfiguraciones([...defaultPrestamoConfig]);
      setLoading(false);
    }, 500);
  }, [hasRole, navigate]);

  const handleUpdateDias = (role: string, value: string) => {
    const dias = parseInt(value, 10);
    if (isNaN(dias) || dias < 1) return;

    // Safely cast to UserRole since we know it's coming from our configs
    const userRole = role as UserRole;

    setConfiguraciones(prev => 
      prev.map(config => 
        config.role === userRole 
          ? { ...config, diasPrestamo: dias } 
          : config
      )
    );
  };

  const handleUpdateMaxLibros = (role: string, value: string) => {
    const maxLibros = parseInt(value, 10);
    if (isNaN(maxLibros) || maxLibros < 1) return;

    // Safely cast to UserRole since we know it's coming from our configs
    const userRole = role as UserRole;

    setConfiguraciones(prev => 
      prev.map(config => 
        config.role === userRole 
          ? { ...config, maxLibros: maxLibros } 
          : config
      )
    );
  };

  const handleGuardarCambios = () => {
    toast({
      title: "Configuraciones guardadas",
      description: "Las configuraciones de préstamos han sido actualizadas correctamente.",
    });
  };

  const navigateToSection = (path: string) => {
    navigate(path);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6">Configuración del Sistema</h1>
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-16 w-16 bg-gray-300 rounded-full mb-4"></div>
              <div className="h-6 w-48 bg-gray-300 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-300 rounded"></div>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="flex items-center mb-6">
          <Settings className="h-8 w-8 text-primary mr-3" />
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Préstamos</CardTitle>
                <CardDescription>
                  Define los días de préstamo y la cantidad máxima de libros para cada tipo de usuario.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Rol</TableHead>
                      <TableHead>Días de préstamo</TableHead>
                      <TableHead>Máximo de libros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {configuraciones.map((config) => (
                      <TableRow key={config.role}>
                        <TableCell className="font-medium capitalize">
                          {config.role}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={config.diasPrestamo}
                            onChange={(e) => handleUpdateDias(config.role, e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="1"
                            value={config.maxLibros}
                            onChange={(e) => handleUpdateMaxLibros(config.role, e.target.value)}
                            className="w-24"
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleGuardarCambios}>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar cambios
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Configuración avanzada</CardTitle>
                <CardDescription>
                  Gestiona usuarios, libros y tesis del sistema.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigateToSection('/admin/usuarios')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Gestionar usuarios
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigateToSection('/admin/libros')}
                >
                  <BookOpen className="h-4 w-4 mr-2" />
                  Gestionar libros
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => navigateToSection('/admin/tesis')}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  Gestionar tesis
                </Button>
              </CardContent>
            </Card>
            
            <Alert className="mt-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Nota importante</AlertTitle>
              <AlertDescription>
                Las configuraciones afectarán todos los nuevos préstamos. 
                Los préstamos existentes no se verán afectados.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Configuracion;
