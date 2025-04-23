import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { BookOpen, BookCheck, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useAuth } from '@/contexts/AuthContext';
import { Prestamo, mockPrestamos, mockBooks } from '@/types';
import { format, parseISO, isAfter } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/components/ui/use-toast';

const MisPrestamos = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [prestamos, setPrestamos] = useState<Prestamo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (user) {
      setLoading(true);
      setTimeout(() => {
        const userPrestamos = mockPrestamos.filter(prestamo => prestamo.userId === user.id);
        setPrestamos(userPrestamos);
        setLoading(false);
      }, 500);
    }
  }, [user]);

  const getBookTitle = (bookId: string) => {
    const book = mockBooks.find(book => book.id === bookId);
    return book ? book.titulo : 'Libro desconocido';
  };

  const handleRenovarPrestamo = (prestamoId: string) => {
    setPrestamos(prevPrestamos => 
      prevPrestamos.map(prestamo => {
        if (prestamo.id === prestamoId) {
          const nuevaFechaDevolucion = new Date(prestamo.fechaDevolucion);
          nuevaFechaDevolucion.setDate(nuevaFechaDevolucion.getDate() + 14);
          
          return {
            ...prestamo,
            fechaDevolucion: nuevaFechaDevolucion,
            estado: 'prestado' as const
          };
        }
        return prestamo;
      })
    );

    toast({
      title: "Préstamo renovado",
      description: "La fecha de devolución ha sido extendida por 14 días.",
    });
  };

  const isVencido = (fechaDevolucion: Date) => {
    return isAfter(new Date(), fechaDevolucion);
  };

  const handleRegularizarPrestamo = (prestamoId: string) => {
    setPrestamos(prevPrestamos => 
      prevPrestamos.map(prestamo => {
        if (prestamo.id === prestamoId) {
          const nuevaFechaDevolucion = new Date(prestamo.fechaDevolucion);
          nuevaFechaDevolucion.setDate(nuevaFechaDevolucion.getDate() + 14);
          
          return {
            ...prestamo,
            fechaDevolucion: nuevaFechaDevolucion,
            estado: 'prestado' as const
          };
        }
        return prestamo;
      })
    );

    toast({
      title: "Préstamo regularizado",
      description: "El préstamo vencido ha sido regularizado y extendido.",
    });
  };

  const prestadosActuales = prestamos.filter(p => p.estado === 'prestado');
  const prestamosVencidos = prestamos.filter(p => p.estado === 'retrasado' || isVencido(p.fechaDevolucion));
  const prestamosDevueltos = prestamos.filter(p => p.estado === 'devuelto');

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <h1 className="text-3xl font-bold mb-6">Mis Préstamos</h1>
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
        <h1 className="text-3xl font-bold mb-6">Mis Préstamos</h1>
        
        {prestamos.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-lg shadow-md">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600">No tienes préstamos registrados</h3>
            <p className="text-gray-500 mt-2 mb-6">Explora nuestro catálogo y solicita tu primer préstamo.</p>
            <Button onClick={() => navigate('/catalogo')}>Ver catálogo</Button>
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="flex items-center mb-4">
                <BookOpen className="h-5 w-5 text-primary mr-2" />
                <h2 className="text-xl font-semibold">Préstamos activos</h2>
              </div>
              
              {prestadosActuales.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Libro</TableHead>
                        <TableHead>Fecha de préstamo</TableHead>
                        <TableHead>Fecha de devolución</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prestadosActuales.map((prestamo) => (
                        <TableRow key={prestamo.id}>
                          <TableCell className="font-medium">
                            {getBookTitle(prestamo.bookId)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(prestamo.fechaPrestamo), 'PPP', { locale: es })}
                          </TableCell>
                          <TableCell>
                            {format(new Date(prestamo.fechaDevolucion), 'PPP', { locale: es })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
                              <span>Prestado</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="outline">
                                  <RefreshCw className="h-4 w-4 mr-1" />
                                  Renovar
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Renovar préstamo</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    ¿Quieres renovar el préstamo por 14 días más?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleRenovarPrestamo(prestamo.id)}>
                                    Renovar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <p className="text-gray-500">No tienes préstamos activos actualmente.</p>
                </div>
              )}
            </div>
            
            {prestamosVencidos.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                  <h2 className="text-xl font-semibold">Préstamos vencidos</h2>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Libro</TableHead>
                        <TableHead>Fecha de préstamo</TableHead>
                        <TableHead>Fecha de devolución</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prestamosVencidos.map((prestamo) => (
                        <TableRow key={prestamo.id} className="bg-red-50">
                          <TableCell className="font-medium">
                            {getBookTitle(prestamo.bookId)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(prestamo.fechaPrestamo), 'PPP', { locale: es })}
                          </TableCell>
                          <TableCell className="text-red-600 font-medium">
                            {format(new Date(prestamo.fechaDevolucion), 'PPP', { locale: es })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-red-500 mr-2"></div>
                              <span className="text-red-600">Vencido</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Button size="sm" variant="secondary" onClick={() => handleRegularizarPrestamo(prestamo.id)}>
                              <Clock className="h-4 w-4 mr-1" />
                              Regularizar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
            
            {prestamosDevueltos.length > 0 && (
              <div>
                <div className="flex items-center mb-4">
                  <BookCheck className="h-5 w-5 text-gray-500 mr-2" />
                  <h2 className="text-xl font-semibold">Historial de préstamos</h2>
                </div>
                
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Libro</TableHead>
                        <TableHead>Fecha de préstamo</TableHead>
                        <TableHead>Fecha de devolución</TableHead>
                        <TableHead>Estado</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {prestamosDevueltos.map((prestamo) => (
                        <TableRow key={prestamo.id}>
                          <TableCell className="font-medium">
                            {getBookTitle(prestamo.bookId)}
                          </TableCell>
                          <TableCell>
                            {format(new Date(prestamo.fechaPrestamo), 'PPP', { locale: es })}
                          </TableCell>
                          <TableCell>
                            {format(new Date(prestamo.fechaDevolucion), 'PPP', { locale: es })}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="h-2 w-2 rounded-full bg-gray-400 mr-2"></div>
                              <span>Devuelto</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default MisPrestamos;
