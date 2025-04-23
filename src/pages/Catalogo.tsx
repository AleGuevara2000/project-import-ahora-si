
import React, { useRef } from "react";
import MainLayout from "@/components/layout/MainLayout";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BookOpen, FileText } from "lucide-react";
import BooksTab from "@/components/catalog/BooksTab";
import ThesesTab from "@/components/catalog/ThesesTab";
import { Button } from "@/components/ui/button";

// La pestaña por defecto será "libros"
const Catalogo = () => {
  // Ref para manipular el tabs desde el botón
  const tabsRef = useRef<HTMLDivElement | null>(null);

  // Handler para "ir a tesis"
  const goToTesis = () => {
    // Cambia manualmente el tab seleccionado a "tesis"
    const tabList = tabsRef.current?.querySelectorAll('[role="tab"]');
    tabList?.forEach((el) => {
      if (el instanceof HTMLElement && el.dataset.state === "active") {
        el.blur();
      }
    });
    const tesisTab = tabsRef.current?.querySelector('[data-value="tesis"]');
    if (tesisTab instanceof HTMLElement) {
      tesisTab.click();
      tesisTab.focus();
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-4 sm:py-8 px-4">
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">Catálogo</h1>
          </div>
          <div ref={tabsRef}>
            <Tabs defaultValue="libros" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="libros" className="flex items-center gap-2" data-value="libros">
                  <BookOpen className="h-4 w-4" />
                  Libros
                </TabsTrigger>
                <TabsTrigger value="tesis" className="flex items-center gap-2" data-value="tesis">
                  <FileText className="h-4 w-4" />
                  Tesis
                </TabsTrigger>
              </TabsList>
              <TabsContent value="libros" className="mt-0">
                <BooksTab />
              </TabsContent>
              <TabsContent value="tesis" className="mt-0">
                <ThesesTab />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Catalogo;

