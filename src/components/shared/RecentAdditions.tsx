
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, FileText, GraduationCap } from 'lucide-react';
import { mockBooks } from '@/types';
import { mockDigitalBooks } from '@/types/digitalBook';
import { mockTheses } from '@/types';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const RecentAdditions = () => {
  // Get the 3 most recent items of each type
  const recentBooks = [...mockBooks]
    .sort((a, b) => b.anioPublicacion - a.anioPublicacion)
    .slice(0, 3);

  const recentDigitalBooks = [...mockDigitalBooks]
    .sort((a, b) => b.fechaSubida.getTime() - a.fechaSubida.getTime())
    .slice(0, 3);

  const recentTheses = [...mockTheses]
    .sort((a, b) => b.anio - a.anio)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      <h2 className="text-xl md:text-2xl font-semibold mb-4">Novedades en el Sistema</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Recent Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Book className="h-5 w-5" />
              Libros Nuevos
            </CardTitle>
            <CardDescription>Últimas incorporaciones al catálogo</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentBooks.map(book => (
                <li key={book.id} className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">{book.titulo}</p>
                    <p className="text-sm text-muted-foreground">{book.autor}</p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/catalogo" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Ver catálogo completo
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Digital Books */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Libros Digitales
            </CardTitle>
            <CardDescription>Últimos recursos digitales</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentDigitalBooks.map(book => (
                <li key={book.id} className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">Formato: {book.formato}</p>
                    <p className="text-sm text-muted-foreground">
                      Subido: {book.fechaSubida.toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/catalogo" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Ver recursos digitales
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Theses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Tesis Recientes
            </CardTitle>
            <CardDescription>Últimas tesis agregadas</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {recentTheses.map(thesis => (
                <li key={thesis.id} className="flex items-start gap-2">
                  <div className="h-2 w-2 mt-2 rounded-full bg-primary" />
                  <div>
                    <p className="font-medium">{thesis.titulo}</p>
                    <p className="text-sm text-muted-foreground">
                      {thesis.autor} - {thesis.tipo}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
            <Link to="/admin/tesis" className="block mt-4">
              <Button variant="outline" size="sm" className="w-full">
                Ver todas las tesis
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RecentAdditions;
