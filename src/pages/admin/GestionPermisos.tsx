
import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserPermissionsManager } from '@/components/admin/UserPermissionsManager';

const GestionPermisos = () => {
  const { hasRole } = useAuth();
  
  return (
    <MainLayout>
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle>Gestión de Permisos</CardTitle>
            <CardDescription>
              Administre los permisos de acceso a módulos para cada rol de usuario
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserPermissionsManager />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default GestionPermisos;
