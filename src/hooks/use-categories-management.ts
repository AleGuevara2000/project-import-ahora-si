
import { useState, useCallback } from 'react';
import { BookCategory } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { mockCategories } from '@/types';

export function useCategoriesManagement() {
  const [categories, setCategories] = useState(mockCategories);
  const { toast } = useToast();

  const handleAddCategoria = useCallback((categoria: { nombre: string; descripcion?: string }) => {
    const newCategoria = {
      id: Math.random().toString(36).substr(2, 9),
      ...categoria
    };
    setCategories(prev => [...prev, newCategoria]);
    toast({
      title: "Categoría agregada",
      description: `La categoría "${categoria.nombre}" ha sido agregada exitosamente.`
    });
  }, [toast]);

  const handleDeleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    toast({
      title: "Categoría eliminada",
      description: "La categoría ha sido eliminada exitosamente."
    });
  }, [toast]);

  const handleEditCategory = useCallback((id: string, categoria: Omit<BookCategory, 'id'>) => {
    setCategories(prev => prev.map(cat => 
      cat.id === id ? { ...cat, ...categoria } : cat
    ));
    toast({
      title: "Categoría actualizada",
      description: `La categoría "${categoria.nombre}" ha sido actualizada exitosamente.`
    });
  }, [toast]);

  return {
    categories,
    handleAddCategoria,
    handleDeleteCategory,
    handleEditCategory,
  };
}
