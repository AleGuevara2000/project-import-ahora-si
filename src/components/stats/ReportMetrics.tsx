
import React from 'react';
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockUsers } from '@/types';

interface ReportMetricsProps {
  type: 'usage' | 'loans' | 'collections' | 'inventory' | 'performance';
}

const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

const ReportMetrics: React.FC<ReportMetricsProps> = ({ type }) => {
  const getUsersByRole = () => {
    const roles = mockUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(roles).map(([role, count]) => ({
      name: role,
      value: count
    }));
  };

  const getLoansByMonth = () => {
    return [
      { month: 'Ene', prestamos: 45 },
      { month: 'Feb', prestamos: 52 },
      { month: 'Mar', prestamos: 38 },
      { month: 'Abr', prestamos: 63 },
      { month: 'May', prestamos: 48 },
      { month: 'Jun', prestamos: 51 },
    ];
  };

  const getCollectionsByCategory = () => {
    return [
      { category: 'Ciencias', cantidad: 250 },
      { category: 'Literatura', cantidad: 320 },
      { category: 'Historia', cantidad: 180 },
      { category: 'Tecnología', cantidad: 290 },
      { category: 'Arte', cantidad: 150 },
    ];
  };

  const renderMetricsByType = () => {
    switch (type) {
      case 'usage':
        return (
          <>
            <CardHeader>
              <CardTitle>Uso del Sistema por Rol</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={getUsersByRole()}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      label={(entry) => entry.name}
                    >
                      {getUsersByRole().map((entry, index) => (
                        <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <Table className="mt-4">
                <TableHeader>
                  <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Email</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.nombre} {user.apellidos}</TableCell>
                      <TableCell className="capitalize">{user.role}</TableCell>
                      <TableCell>{user.email}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </>
        );

      case 'loans':
        return (
          <>
            <CardHeader>
              <CardTitle>Préstamos por Mes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getLoansByMonth()}>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="prestamos" fill="#4f46e5" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </>
        );

      case 'collections':
        return (
          <>
            <CardHeader>
              <CardTitle>Distribución de Colecciones</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getCollectionsByCategory()}>
                    <XAxis dataKey="category" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="cantidad" fill="#10b981" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </>
        );

      case 'inventory':
        return (
          <>
            <CardHeader>
              <CardTitle>Estado del Inventario</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Total Libros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">1,245</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Disponibles</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">987</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">En Préstamo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-blue-600">258</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </>
        );

      case 'performance':
        return (
          <>
            <CardHeader>
              <CardTitle>Rendimiento del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tiempo de Respuesta</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">0.8s</p>
                    <p className="text-sm text-muted-foreground">Promedio últimas 24h</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Solicitudes/Hora</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">342</p>
                    <p className="text-sm text-muted-foreground">Promedio diario</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </>
        );
    }
  };

  return (
    <Card className="mt-4">
      {renderMetricsByType()}
    </Card>
  );
};

export default ReportMetrics;
