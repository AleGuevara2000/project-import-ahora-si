import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Páginas públicas
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Catalogo from "./pages/Catalogo";
import DetalleLibro from "./pages/DetalleLibro";
import Ayuda from "./pages/Ayuda";
import MostConsultedBooks from "./pages/MostConsultedBooks";

// Páginas protegidas
import MisPrestamos from "./pages/MisPrestamos";

// Páginas de administración
import Configuracion from "./pages/admin/Configuracion";
import GestionPrestamos from "./pages/admin/GestionPrestamos";
import GestionLibros from "./pages/admin/GestionLibros";
import GestionTesis from "./pages/admin/GestionTesis";
import GestionUsuarios from "./pages/admin/GestionUsuarios";
import GestionPermisos from "./pages/admin/GestionPermisos";
import LibrosEnBaseDeDatos from "@/pages/admin/LibrosEnBaseDeDatos";

const queryClient = new QueryClient();

// Proteger rutas para usuarios autenticados
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Proteger rutas solo para administradores y bibliotecarios
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { hasRole, user } = useAuth();
  const isStaff = hasRole(['administrador', 'bibliotecario']);
  
  if (!isStaff) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

// Proteger rutas solo para administradores
const AdminOnlyRoute = ({ children }: { children: React.ReactNode }) => {
  const { hasRole } = useAuth();
  
  if (!hasRole('administrador')) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              {/* Rutas públicas */}
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/libro/:id" element={<DetalleLibro />} />
              <Route path="/ayuda" element={<Ayuda />} />
              <Route path="/catalogo/consultados" element={<MostConsultedBooks />} />
              
              {/* Rutas protegidas para usuarios autenticados */}
              <Route path="/mis-prestamos" element={
                <ProtectedRoute>
                  <MisPrestamos />
                </ProtectedRoute>
              } />
              
              {/* Rutas de administración */}
              <Route path="/admin/prestamos" element={
                <AdminRoute>
                  <GestionPrestamos />
                </AdminRoute>
              } />
              <Route path="/admin/libros" element={
                <AdminRoute>
                  <GestionLibros />
                </AdminRoute>
              } />
              <Route path="/admin/usuarios" element={
                <AdminRoute>
                  <GestionUsuarios />
                </AdminRoute>
              } />
              <Route path="/admin/tesis" element={
                <AdminRoute>
                  <GestionTesis />
                </AdminRoute>
              } />
              <Route path="/admin/ebooks" element={
                <AdminRoute>
                  <GestionLibros defaultTab="digital" />
                </AdminRoute>
              } />
              <Route path="/admin/configuracion" element={
                <AdminOnlyRoute>
                  <Configuracion />
                </AdminOnlyRoute>
              } />
              <Route path="/admin/permisos" element={
                <AdminOnlyRoute>
                  <GestionPermisos />
                </AdminOnlyRoute>
              } />
              <Route path="/admin/libros-en-base" element={<LibrosEnBaseDeDatos />} />
              
              {/* Ruta de 404 */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
