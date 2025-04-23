import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  BookPlus, 
  Calendar, 
  MapPin, 
  Info, 
  User, 
  Building,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Book, mockBooks } from '@/types';
import { 
  Card, 
  CardContent,
  CardDescription
} from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
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
import { ReservationButton } from '@/components/books/ReservationButton';

const DetalleLibro = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [libro, setLibro] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const foundBook = mockBooks.find(book => book.id === id);
      setLibro(foundBook || null);
      setLoading(false);
    }, 500);
  }, [id]);

  const handleSolicitar = () => {
    toast({
      title: "Préstamo solicitado",
      description: `Has solicitado el libro "${libro?.titulo}". Pasa por la biblioteca para recogerlo.`,
    });
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
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

  if (!libro) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <div className="text-center py-10">
            <AlertTriangle className="h-16 w-16 text-secondary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-4">Libro no encontrado</h1>
            <p className="text-gray-600 mb-6">No se encontró el libro que estás buscando.</p>
            <Button onClick={() => navigate('/catalogo')}>
              Volver al catálogo
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-10 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
              <div className="h-80 bg-gray-200 flex items-center justify-center">
                {libro.imagen ? (
                  <img 
                    src={libro.imagen} 
                    alt={libro.titulo} 
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <BookPlus className="h-32 w-32 text-gray-400" />
                )}
              </div>
              <div className="p-6">
                <div className={`text-center mb-4 text-lg font-medium ${libro.disponibles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {libro.disponibles > 0 
                    ? `${libro.disponibles} ${libro.disponibles === 1 ? 'ejemplar disponible' : 'ejemplares disponibles'}` 
                    : 'No disponible actualmente'
                  }
                </div>
                
                {isAuthenticated ? (
                  <div className="space-y-2">
                    <ReservationButton 
                      bookId={libro.id}
                      bookTitle={libro.titulo}
                      isAvailable={libro.disponibles > 0}
                    />
                    
                    {libro.disponibles > 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button className="w-full">
                            <BookOpen className="mr-2 h-4 w-4" />
                            Solicitar préstamo
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar solicitud de préstamo</AlertDialogTitle>
                            <AlertDialogDescription>
                              ¿Estás seguro que deseas solicitar el préstamo de "{libro.titulo}"?
                              <br /><br />
                              Recuerda que deberás pasar a la biblioteca para confirmar el préstamo.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={handleSolicitar}>
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>
                ) : (
                  <Button 
                    className="w-full" 
                    variant="outline" 
                    onClick={() => navigate('/login')}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Inicia sesión para solicitar
                  </Button>
                )}
              </div>
            </div>
            
            <Card>
              <CardContent className="pt-6">
                <CardDescription className="mb-4 font-medium">Ubicación en biblioteca</CardDescription>
                <div className="flex items-start mb-4">
                  <MapPin className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span>{libro.ubicacion}</span>
                </div>
                <CardDescription className="mb-4 font-medium">Información de referencia</CardDescription>
                <div className="flex items-start mb-3">
                  <Info className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span className="text-sm">ISBN: {libro.isbn}</span>
                </div>
                <div className="flex items-start mb-3">
                  <Building className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span className="text-sm">Editorial: {libro.editorial}</span>
                </div>
                <div className="flex items-start">
                  <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                  <span className="text-sm">Año de publicación: {libro.anioPublicacion}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <div className="mb-2">
              <a 
                href="/catalogo" 
                className="text-primary hover:underline text-sm mb-2 inline-block"
              >
                ← Volver al catálogo
              </a>
            </div>
            
            <h1 className="text-3xl font-bold mb-2">{libro.titulo}</h1>
            <h2 className="text-xl text-gray-600 mb-6">{libro.autor}</h2>
            
            <div className="flex items-center mb-6">
              <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">
                {libro.categoria}
              </span>
            </div>
            
            <div className="border-t border-b py-6 mb-6">
              <h3 className="text-xl font-semibold mb-4">Descripción</h3>
              <p className="text-gray-700 leading-relaxed">
                {libro.descripcion || 'No hay descripción disponible para este libro.'}
              </p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">Detalles</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Autor</span>
                  <span className="font-medium">{libro.autor}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Editorial</span>
                  <span className="font-medium">{libro.editorial}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Año de publicación</span>
                  <span className="font-medium">{libro.anioPublicacion}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">ISBN</span>
                  <span className="font-medium">{libro.isbn}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Categoría</span>
                  <span className="font-medium">{libro.categoria}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Copias totales</span>
                  <span className="font-medium">{libro.copias}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Ubicación</span>
                  <span className="font-medium">{libro.ubicacion}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500">Disponibilidad</span>
                  <span className={`font-medium ${libro.disponibles > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {libro.disponibles > 0 
                      ? `${libro.disponibles} de ${libro.copias} disponibles` 
                      : 'No disponible actualmente'
                    }
                  </span>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-4">¿Necesitas ayuda?</h3>
              <p className="text-gray-700 mb-4">
                Si necesitas ayuda para encontrar este libro en la biblioteca o tienes alguna pregunta, 
                no dudes en contactar al personal bibliotecario.
              </p>
              <Button variant="outline">
                Contactar a la biblioteca
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default DetalleLibro;
