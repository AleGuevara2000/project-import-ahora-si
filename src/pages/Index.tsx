import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Search, BookOpen, Clock, BookPlus, FileDown, Users, Mail, Folder } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { mockBooks } from '@/types';
import ChatButton from '@/components/chat/ChatButton';
import { useToast } from '@/hooks/use-toast';
import RecentAdditions from '@/components/shared/RecentAdditions';

const Index = () => {
  const { user, hasRole } = useAuth();
  const { toast } = useToast();

  // Seleccionar algunos libros destacados para mostrar
  const librosDestacados = mockBooks.slice(0, 3);

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Prepare email parameters
    const subject = encodeURIComponent('Consulta Biblioteca UTM');
    const body = encodeURIComponent('Hola, quisiera realizar una consulta sobre...');
    const mailtoLink = `mailto:biblioteca@mixteco.utm.mx?subject=${subject}&body=${body}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Show confirmation toast
    toast({
      title: "Contacto iniciado",
      description: "Se está abriendo tu cliente de correo electrónico para contactar a la biblioteca.",
    });

    // For librarians, show additional notification
    if (hasRole('bibliotecario')) {
      toast({
        title: "Notificación de correo",
        description: "Se ha iniciado una nueva consulta a través del sistema de biblioteca.",
      });
    }
  };

  return <MainLayout>
      {/* Hero Section */}
      <section className="bg-primary py-16 text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4">Sistema de Gestión Bibliotecaria</h1>
              <p className="text-xl mb-6">
                Bienvenido al sistema de gestión de libros de la Biblioteca de la Universidad Tecnológica de la Mixteca.
              </p>
              {user ? <div className="flex flex-wrap gap-4">
                  <Link to="/catalogo">
                    <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                      <Search className="mr-2 h-5 w-5" />
                      Buscar libros
                    </Button>
                  </Link>
                  <Link to="/mis-prestamos">
                    <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-blue-950">
                      <BookOpen className="mr-2 h-5 w-5" />
                      Mis préstamos
                    </Button>
                  </Link>
                  {hasRole('administrador') && (
                    <Link to="/admin/usuarios">
                      <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-blue-950">
                        <Users className="mr-2 h-5 w-5" />
                        Gestionar usuarios
                      </Button>
                    </Link>
                  )}
                </div> : <div className="flex flex-wrap gap-4">
                  <Link to="/login">
                    <Button size="lg" className="bg-white text-primary hover:bg-gray-100">
                      Iniciar sesión
                    </Button>
                  </Link>
                  <Link to="/catalogo">
                    <Button size="lg" variant="outline" className="border-white hover:bg-primary-foreground/10 text-blue-950">
                      <Search className="mr-2 h-5 w-5" />
                      Explorar catálogo
                    </Button>
                  </Link>
                </div>}
            </div>
            <div className="md:w-1/2 flex justify-center">
              <img alt="Biblioteca UTM" className="rounded-lg shadow-lg max-h-96 object-cover" src="/lovable-uploads/f46b4744-0ea0-4e43-9ce3-2a800df2cc80.png" />
            </div>
          </div>
        </div>
      </section>

      {/* Recent Additions Section */}
      <section className="py-16 bg-accent/30">
        <div className="container mx-auto px-4">
          <RecentAdditions />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Servicios de la Biblioteca</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Search className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Búsqueda de Libros</h3>
              <p className="text-gray-600 mb-4">
                Accede a nuestro amplio catálogo de libros académicos y encuentra el material que necesitas para tus estudios o investigaciones.
              </p>
              <Link to="/catalogo" className="mt-auto">
                <Button variant="outline" className="w-full">Explorar catálogo</Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <BookOpen className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Préstamos</h3>
              <p className="text-gray-600 mb-4">
                Solicita préstamos de libros según tu rol dentro de la universidad, con diferentes períodos de tiempo disponibles.
              </p>
              <Link to={user ? "/mis-prestamos" : "/login"} className="mt-auto">
                <Button variant="outline" className="w-full">
                  {user ? "Mis préstamos" : "Iniciar sesión"}
                </Button>
              </Link>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Clock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Horarios</h3>
              <p className="text-gray-600 mb-4">
                Consulta los horarios de atención de la biblioteca y planifica tu visita.
              </p>
              <div className="mt-auto">
                <div className="text-sm text-gray-700 font-medium">
                  Lunes a Viernes: 8:00 - 20:00 hrs<br />
                  Sábados: 9:00 - 14:00 hrs
                </div>
              </div>
            </div>
          </div>
          {hasRole('administrador') && (
            <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <FileDown className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Exportación de Datos</h3>
              <p className="text-gray-600 mb-4">
                Como administrador, puedes exportar datos de libros y usuarios en varios formatos: CSV, JSON y Excel.
              </p>
              <div className="mt-auto flex gap-2">
                <Link to="/admin/libros">
                  <Button variant="outline" size="sm">Libros</Button>
                </Link>
                <Link to="/admin/usuarios">
                  <Button variant="outline" size="sm">Usuarios</Button>
                </Link>
              </div>
            </div>
          )}
          {hasRole('bibliotecario') && (
            <div className="mt-8 bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Folder className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Gestión de Recursos</h3>
              <p className="text-gray-600 mb-4">
                Administra libros, libros digitales y tesis del sistema bibliotecario.
              </p>
              <div className="mt-auto flex gap-2">
                <Link to="/admin/libros">
                  <Button variant="outline" size="sm">Libros</Button>
                </Link>
                <Link to="/admin/ebooks">
                  <Button variant="outline" size="sm">Libros Digitales</Button>
                </Link>
                <Link to="/admin/tesis">
                  <Button variant="outline" size="sm">Tesis</Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="py-16 bg-accent/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Libros destacados</h2>
            <Link to="/catalogo/consultados">
              <Button variant="link" className="text-primary">
                Ver catálogo completo
              </Button>
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {librosDestacados.map(libro => <div key={libro.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="h-40 bg-gray-200 flex items-center justify-center">
                  {libro.imagen ? <img src={libro.imagen} alt={libro.titulo} className="h-full w-full object-cover" /> : <BookPlus className="h-16 w-16 text-gray-400" />}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2 line-clamp-1">{libro.titulo}</h3>
                  <p className="text-gray-600 mb-2">{libro.autor}</p>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm bg-accent/80 px-2 py-1 rounded">
                      {libro.categoria}
                    </span>
                    <span className="text-sm text-gray-500">
                      {libro.disponibles} disponibles
                    </span>
                  </div>
                  <Link to={`/libro/${libro.id}`}>
                    <Button variant="outline" className="w-full">Ver detalles</Button>
                  </Link>
                </div>
              </div>)}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-secondary text-secondary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Necesitas ayuda?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Si necesitas asistencia para encontrar un libro o realizar un préstamo, nuestro personal bibliotecario está disponible para ayudarte.
          </p>
          <Button 
            size="lg" 
            className="bg-white text-secondary hover:bg-gray-100"
            onClick={handleContactClick}
            asChild
          >
            <a href="#">
              <Mail className="mr-2 h-5 w-5" />
              Contactar a la biblioteca
            </a>
          </Button>
        </div>
      </section>
    
    {/* Add ChatButton at the end */}
    <ChatButton />
  </MainLayout>;
};

export default Index;
