
import { useCallback } from "react";
import { BookCategory } from "@/types";
import { useToast } from "../use-toast";
import { mockCategories } from "@/types/book";

export function useCategoryActions(toast: ReturnType<typeof useToast>["toast"], setCategories: React.Dispatch<React.SetStateAction<BookCategory[]>>) {
  const handleAddCategoria = useCallback(async (newCategory: Omit<BookCategory, 'id'>) => {
    try {
      setCategories((prevCategories) => [
        ...prevCategories,
        { ...newCategory, id: (prevCategories.length + 1).toString() }
      ]);
      toast({
        title: "Categoría agregada",
        description: `La categoría "${newCategory.nombre}" ha sido agregada exitosamente.`,
      });
    } catch {
      toast({
        title: "Error al agregar categoría",
        description: "No se pudo agregar la categoría. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast, setCategories]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    try {
      setCategories((prevCategories) =>
        prevCategories.filter((category) => category.id !== categoryId)
      );
      toast({
        title: "Categoría eliminada",
        description: "La categoría ha sido eliminada exitosamente.",
      });
    } catch {
      toast({
        title: "Error al eliminar categoría",
        description: "No se pudo eliminar la categoría. Intente nuevamente.",
        variant: "destructive",
      });
    }
  }, [toast, setCategories]);

  const handleEditCategory = useCallback(
    async (categoryId: string, updatedCategory: Partial<BookCategory>) => {
      try {
        setCategories((prevCategories) =>
          prevCategories.map((category) =>
            category.id === categoryId
              ? { ...category, ...updatedCategory }
              : category
          )
        );
        toast({
          title: "Categoría editada",
          description: "La categoría ha sido editada exitosamente.",
        });
      } catch {
        toast({
          title: "Error al editar categoría",
          description: "No se pudo editar la categoría. Intente nuevamente.",
          variant: "destructive",
        });
      }
    },
    [toast, setCategories]
  );

  return {
    handleAddCategoria,
    handleDeleteCategory,
    handleEditCategory,
  };
}
