
import { useAuth } from '@/contexts/AuthContext';
import { canSkipAuthForLibraryActions } from '@/lib/user-utils';
import { toast } from '@/hooks/use-toast';

export function useUploadAuthCheck() {
  const { user } = useAuth();

  const checkUploadAuth = async () => {
    const { data: authData } = await import('@/integrations/supabase/client').then(m => m.supabase.auth.getSession());
    if (!authData.session && !canSkipAuthForLibraryActions(user)) {
      toast({
        title: "Error de autenticación",
        description: "Debes iniciar sesión para subir archivos digitales",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };

  return { checkUploadAuth };
}
