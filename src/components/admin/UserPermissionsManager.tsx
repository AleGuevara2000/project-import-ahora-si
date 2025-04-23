
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { UserRole } from '@/types/user';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Define module types and access levels
type AccessLevel = 'permitir' | 'restringir' | 'ocultar';

interface ModulePermission {
  id: string;
  name: string;
  description: string;
  defaultAccess: Record<UserRole, AccessLevel>;
}

interface RolePermissionsState {
  [roleId: string]: {
    [moduleId: string]: AccessLevel;
  };
}

const defaultModules: ModulePermission[] = [
  {
    id: 'libros',
    name: 'Gestión de Libros',
    description: 'Administración de libros físicos en la biblioteca',
    defaultAccess: {
      estudiante: 'restringir',
      profesor: 'permitir',
      tecnico: 'permitir',
      administrativo: 'permitir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    }
  },
  {
    id: 'ebooks',
    name: 'Libros Digitales',
    description: 'Gestión de libros electrónicos y recursos digitales',
    defaultAccess: {
      estudiante: 'permitir',
      profesor: 'permitir',
      tecnico: 'permitir',
      administrativo: 'permitir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    }
  },
  {
    id: 'prestamos',
    name: 'Préstamos',
    description: 'Administración de préstamos y devoluciones',
    defaultAccess: {
      estudiante: 'restringir',
      profesor: 'restringir',
      tecnico: 'restringir',
      administrativo: 'restringir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    }
  },
  {
    id: 'usuarios',
    name: 'Gestión de Usuarios',
    description: 'Administración de cuentas de usuario',
    defaultAccess: {
      estudiante: 'ocultar',
      profesor: 'ocultar',
      tecnico: 'ocultar',
      administrativo: 'ocultar',
      operativo: 'ocultar',
      bibliotecario: 'restringir',
      administrador: 'permitir',
    }
  },
  {
    id: 'tesis',
    name: 'Tesis',
    description: 'Administración de tesis académicas',
    defaultAccess: {
      estudiante: 'restringir',
      profesor: 'permitir',
      tecnico: 'restringir',
      administrativo: 'restringir',
      operativo: 'restringir',
      bibliotecario: 'permitir',
      administrador: 'permitir',
    }
  },
  {
    id: 'configuracion',
    name: 'Configuración',
    description: 'Configuración general del sistema',
    defaultAccess: {
      estudiante: 'ocultar',
      profesor: 'ocultar',
      tecnico: 'ocultar',
      administrativo: 'ocultar',
      operativo: 'ocultar',
      bibliotecario: 'ocultar',
      administrador: 'permitir',
    }
  }
];

const roles: UserRole[] = [
  'estudiante', 
  'profesor', 
  'tecnico', 
  'administrativo', 
  'operativo', 
  'bibliotecario', 
  'administrador'
];

export function UserPermissionsManager() {
  const { toast } = useToast();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Initialize permissions state with default values
  const [permissions, setPermissions] = useState<RolePermissionsState>(() => {
    const initialState: RolePermissionsState = {};
    
    roles.forEach(role => {
      initialState[role] = {};
      defaultModules.forEach(module => {
        initialState[role][module.id] = module.defaultAccess[role];
      });
    });
    
    return initialState;
  });

  const handlePermissionChange = (role: UserRole, moduleId: string, value: AccessLevel) => {
    setPermissions(prev => ({
      ...prev,
      [role]: {
        ...prev[role],
        [moduleId]: value
      }
    }));
  };

  const savePermissions = () => {
    // Here you would save the permissions to the backend
    console.log('Saving permissions:', permissions);
    toast({
      title: 'Permisos actualizados',
      description: 'Los permisos de los usuarios han sido actualizados correctamente.',
    });
  };

  const resetToDefaults = () => {
    const defaultState: RolePermissionsState = {};
    
    roles.forEach(role => {
      defaultState[role] = {};
      defaultModules.forEach(module => {
        defaultState[role][module.id] = module.defaultAccess[role];
      });
    });
    
    setPermissions(defaultState);
    toast({
      title: 'Permisos restablecidos',
      description: 'Los permisos han sido restablecidos a los valores predeterminados.',
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Control de Acceso a Módulos</CardTitle>
        <CardDescription>
          Configure qué roles pueden acceder a cada módulo del sistema
        </CardDescription>
        <div className="flex items-center space-x-2 mt-4">
          <Switch id="advanced-mode" checked={showAdvanced} onCheckedChange={setShowAdvanced} />
          <Label htmlFor="advanced-mode">Mostrar opciones avanzadas</Label>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Módulo</TableHead>
                {roles.map(role => (
                  <TableHead key={role} className="min-w-[140px] text-center capitalize">{role}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {defaultModules.map((module) => (
                <TableRow key={module.id}>
                  <TableCell className="font-medium">
                    <div>
                      <div>{module.name}</div>
                      <div className="text-xs text-muted-foreground mt-1">{module.description}</div>
                    </div>
                  </TableCell>
                  {roles.map(role => (
                    <TableCell key={`${module.id}-${role}`} className="text-center">
                      <ToggleGroup 
                        type="single" 
                        value={permissions[role][module.id]} 
                        onValueChange={(value) => {
                          if (value) handlePermissionChange(role, module.id, value as AccessLevel);
                        }}
                        className="justify-center"
                      >
                        <ToggleGroupItem value="permitir" aria-label="Permitir" className="px-2 py-1 text-xs data-[state=on]:bg-green-100 data-[state=on]:text-green-700">
                          Permitir
                        </ToggleGroupItem>
                        <ToggleGroupItem value="restringir" aria-label="Restringir" className="px-2 py-1 text-xs data-[state=on]:bg-yellow-100 data-[state=on]:text-yellow-700">
                          Restringir
                        </ToggleGroupItem>
                        <ToggleGroupItem value="ocultar" aria-label="Ocultar" className="px-2 py-1 text-xs data-[state=on]:bg-red-100 data-[state=on]:text-red-700">
                          Ocultar
                        </ToggleGroupItem>
                      </ToggleGroup>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="outline" onClick={resetToDefaults}>
            Restablecer valores predeterminados
          </Button>
          <Button onClick={savePermissions}>
            Guardar cambios
          </Button>
        </div>
        
        {showAdvanced && (
          <div className="mt-6 border rounded-md p-4">
            <h3 className="text-lg font-medium mb-4">Explicación de niveles de acceso</h3>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-medium">Permitir:</span> 
                <span className="text-sm">El usuario puede ver y utilizar completamente el módulo.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="font-medium">Restringir:</span> 
                <span className="text-sm">El usuario puede ver el módulo, pero con funcionalidad limitada.</span>
              </li>
              <li className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <span className="font-medium">Ocultar:</span> 
                <span className="text-sm">El módulo no será visible para el usuario.</span>
              </li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
