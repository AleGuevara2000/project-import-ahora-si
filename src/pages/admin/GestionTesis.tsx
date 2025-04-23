
import React from "react";
import { useNavigate } from "react-router-dom";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import GestionTesisPanel from "@/components/admin/GestionTesisPanel";

const GestionTesis = () => {
  const navigate = useNavigate();
  const { hasRole, isAuthenticated, user } = useAuth();

  React.useEffect(() => {
    // Permitir acceso a bibliotecario o administrador
    if (!hasRole(["bibliotecario", "administrador"])) {
      // Si no tiene el rol requerido y no es posible omitir autenticación, redirigir
      if (!user || (user && !user.canSkipAuth)) {
        navigate("/");
      }
    }
  }, [hasRole, navigate, user]);

  return (
    <MainLayout>
      {!isAuthenticated && !(user?.canSkipAuth) ? (
        <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6" role="alert">
          <p className="font-bold">Autenticación requerida</p>
          <p>Debes iniciar sesión para gestionar las tesis.</p>
        </div>
      ) : (
        <GestionTesisPanel isAuthenticated={isAuthenticated || (!!user?.canSkipAuth)} />
      )}
    </MainLayout>
  );
};

export default GestionTesis;
