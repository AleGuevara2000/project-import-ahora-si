import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { mockUsers } from '@/types';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataExport from '@/components/admin/DataExport';
import DataImport from '@/components/admin/DataImport';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { NewUserDialog } from '@/components/admin/NewUserDialog';
import { EditUserDialog } from '@/components/admin/EditUserDialog';

const GestionUsuarios = () => {
  const { hasRole } = useAuth();
  const [searchTerm, setSearchTerm] = React.useState('');
  const { toast } = useToast();
  
  const filteredUsers = React.useMemo(() => {
    return mockUsers.filter(user => 
      user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.apellidos.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleImportData = (data: any[]) => {
    toast({
      title: "Datos importados",
      description: `Se importaron ${data.length} usuarios correctamente.`
    });
  };

  const handleUserUpdated = () => {
    toast({
      title: "Lista actualizada",
      description: "La lista de usuarios ha sido actualizada."
    });
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Gestión de Usuarios</CardTitle>
                <CardDescription>
                  Administra los usuarios del sistema de biblioteca
                </CardDescription>
              </div>
              <div className="flex gap-2 items-center">
                <DataImport onImport={handleImportData} />
                <DataExport 
                  data={mockUsers} 
                  filename="usuarios-biblioteca" 
                  buttonLabel="Exportar usuarios"
                />
                <NewUserDialog />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center mb-4">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Buscar por nombre, apellidos o email..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Apellidos</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.nombre}</TableCell>
                      <TableCell>{user.apellidos}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <EditUserDialog user={user} onUserUpdated={handleUserUpdated} />
                          <Button variant="outline" size="sm" className="text-red-500 hover:text-red-700">
                            Eliminar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GestionUsuarios;
