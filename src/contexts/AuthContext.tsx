
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, mockUsers, UserRole, assignRoleBasedOnEmail } from '@/types';

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('utmBibliotecaUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
      } catch (e) {
        console.error('Error parsing user data', e);
        localStorage.removeItem('utmBibliotecaUser');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Special handling for admin accounts - don't validate domain
    const isAdminEmail = email === 'admin@mixteco.utm.mx';
    
    // For non-admin users, validate domain
    const isValidDomain = isAdminEmail || email.endsWith('@gs.utm.mx') || email.endsWith('@mixteco.utm.mx');
    
    if (!isValidDomain) {
      setIsLoading(false);
      return false;
    }
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
      
      let foundUser = mockUsers.find(u => u.email === email);
      
      // Handle admin accounts
      if (!foundUser && email === 'admin@mixteco.utm.mx') {
        foundUser = {
          id: 'admin-1',
          email: email,
          nombre: 'Administrador',
          apellidos: 'Sistema',
          role: 'administrador',
          createdAt: new Date(),
          canSkipAuth: true // Set canSkipAuth for admin users
        };
      }
      
      if (foundUser) {
        const userWithAssignedRole: User = {
          ...foundUser,
          role: isAdminEmail ? 'administrador' : assignRoleBasedOnEmail(email),
          canSkipAuth: isAdminEmail || foundUser.email === 'biblioteca@mixteco.utm.mx' // Set canSkipAuth for admin and bibliotecario
        };
        
        setUser(userWithAssignedRole);
        localStorage.setItem('utmBibliotecaUser', JSON.stringify(userWithAssignedRole));
        setIsLoading(false);
        return true;
      }
      
      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('utmBibliotecaUser');
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    
    if (Array.isArray(roles)) {
      return roles.includes(user.role);
    }
    
    return user.role === roles;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      login, 
      logout, 
      isAuthenticated: !!user,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
