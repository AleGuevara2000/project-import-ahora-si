import React, { useCallback } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UserRole } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { FileText, Download, BookOpen, Search, User, Users, Settings, BookMarked, Clock, CalendarCheck, Library, BookCopy } from 'lucide-react';
import PDFViewer from '@/components/shared/PDFViewer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { saveAs } from 'file-saver';
import UserCounter from '@/components/stats/UserCounter';
import ReportMetrics from '@/components/stats/ReportMetrics';

interface HelpSection {
  title: string;
  icon: React.ReactNode;
  content: string[];
}

interface RoleHelp {
  role: UserRole;
  sections: HelpSection[];
}

const helpContent: RoleHelp[] = [
  {
    role: 'estudiante',
    sections: [
      {
        title: 'Búsqueda en el Catálogo',
        icon: <Search className="h-5 w-5" />,
        content: [
          'Utiliza la barra de búsqueda para encontrar libros por título, autor o materia',
          'Aplica filtros por categoría, año de publicación o disponibilidad',
          'Visualiza la información detallada de cada libro incluyendo su ubicación en la biblioteca',
          'Revisa la disponibilidad en tiempo real de los materiales',
          'Guarda tus búsquedas favoritas para consultas futuras'
        ]
      },
      {
        title: 'Gestión de Préstamos',
        icon: <BookOpen className="h-5 w-5" />,
        content: [
          'Puedes solicitar hasta 3 libros simultáneamente',
          'El período de préstamo estándar es de 14 días',
          'Las renovaciones están disponibles hasta 2 veces si no hay reservas pendientes',
          'Recibirás notificaciones antes del vencimiento de tus préstamos',
          'Verifica el estado de tus préstamos activos en la sección "Mis Préstamos"'
        ]
      },
      {
        title: 'Servicios Adicionales',
        icon: <Library className="h-5 w-5" />,
        content: [
          'Acceso a la sala de lectura en horario de biblioteca',
          'Servicio de fotocopiado con límite de páginas según reglamento',
          'Reserva de cubículos de estudio individual o grupal',
          'Acceso a bases de datos académicas desde la red universitaria',
          'Asesoría bibliotecaria presencial y en línea'
        ]
      }
    ]
  },
  {
    role: 'profesor',
    sections: [
      {
        title: 'Préstamos Extendidos',
        icon: <Clock className="h-5 w-5" />,
        content: [
          'Beneficio de préstamo de hasta 5 libros por 30 días',
          'Posibilidad de renovación hasta 3 veces',
          'Prioridad en reservas de material bibliográfico',
          'Solicitud de material para clases con anticipación',
          'Gestión de préstamos especiales para material de investigación'
        ]
      },
      {
        title: 'Recursos Académicos',
        icon: <BookMarked className="h-5 w-5" />,
        content: [
          'Acceso completo a bases de datos especializadas',
          'Solicitud de compra de nuevo material bibliográfico',
          'Gestión de bibliografía para programas académicos',
          'Recursos digitales para apoyo a la docencia',
          'Asesoría en búsqueda de recursos especializados'
        ]
      },
      {
        title: 'Servicios Especializados',
        icon: <BookCopy className="h-5 w-5" />,
        content: [
          'Reserva de material para cursos completos',
          'Digitalización de materiales para uso académico',
          'Préstamo interbibliotecario con otras instituciones',
          'Talleres de capacitación en recursos bibliográficos',
          'Soporte para investigación académica'
        ]
      }
    ]
  },
  {
    role: 'bibliotecario',
    sections: [
      {
        title: 'Gestión de Préstamos',
        icon: <CalendarCheck className="h-5 w-5" />,
        content: [
          'Proceso de registro y devolución de materiales',
          'Gestión de multas y sanciones según reglamento',
          'Control de renovaciones y reservas',
          'Manejo de préstamos especiales',
          'Seguimiento de material no devuelto'
        ]
      },
      {
        title: 'Administración del Catálogo',
        icon: <BookMarked className="h-5 w-5" />,
        content: [
          'Actualización y mantenimiento del catálogo',
          'Proceso de catalogación de nuevos materiales',
          'Gestión de donaciones y adquisiciones',
          'Control de inventario y ubicación de materiales',
          'Mantenimiento de la base de datos bibliográfica'
        ]
      },
      {
        title: 'Atención a Usuarios',
        icon: <Users className="h-5 w-5" />,
        content: [
          'Orientación en búsqueda de materiales',
          'Resolución de conflictos y dudas',
          'Capacitación a usuarios nuevos',
          'Gestión de credenciales y accesos',
          'Apoyo en servicios especializados'
        ]
      }
    ]
  },
  {
    role: 'administrador',
    sections: [
      {
        title: 'Gestión del Sistema',
        icon: <Settings className="h-5 w-5" />,
        content: [
          'Configuración general del sistema',
          'Gestión de roles y permisos',
          'Administración de políticas de préstamo',
          'Configuración de notificaciones automáticas',
          'Mantenimiento de la base de datos'
        ]
      },
      {
        title: 'Administración de Usuarios',
        icon: <User className="h-5 w-5" />,
        content: [
          'Creación y gestión de cuentas de usuario',
          'Asignación de roles y privilegios',
          'Control de acceso y seguridad',
          'Gestión de personal bibliotecario',
          'Supervisión de actividades de usuarios'
        ]
      },
      {
        title: 'Reportes y Estadísticas',
        icon: <FileText className="h-5 w-5" />,
        content: [
          'Generación de informes de uso',
          'Estadísticas de préstamos y devoluciones',
          'Análisis de colecciones más utilizadas',
          'Reportes de inventario y adquisiciones',
          'Métricas de rendimiento del sistema'
        ]
      }
    ]
  }
];

const Ayuda = () => {
  const { user, hasRole } = useAuth();
  const currentRole = user?.role || 'estudiante';

  const downloadPDF = useCallback((role: UserRole) => {
    const blob = new Blob(['Manual detallado para ' + role], { type: 'application/pdf' });
    saveAs(blob, `manual_${role}.pdf`);
  }, []);

  const getMetricType = (sectionTitle: string): 'usage' | 'loans' | 'collections' | 'inventory' | 'performance' | null => {
    switch (sectionTitle) {
      case 'Generación de informes de uso':
        return 'usage';
      case 'Estadísticas de préstamos y devoluciones':
        return 'loans';
      case 'Análisis de colecciones más utilizadas':
        return 'collections';
      case 'Reportes de inventario y adquisiciones':
        return 'inventory';
      case 'Métricas de rendimiento del sistema':
        return 'performance';
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto py-4 md:py-10 px-4">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold">Centro de Ayuda</h1>
          <div className="mt-4 md:mt-0">
            <UserCounter />
          </div>
        </div>
        
        <Tabs defaultValue={currentRole} className="w-full">
          <TabsList className="mb-4 flex flex-wrap gap-2">
            {helpContent.map(({ role }) => (
              hasRole([role, 'administrador']) && (
                <TabsTrigger 
                  key={role} 
                  value={role} 
                  className="capitalize text-sm md:text-base"
                >
                  {role}
                </TabsTrigger>
              )
            ))}
          </TabsList>

          {helpContent.map(({ role, sections }) => (
            hasRole([role, 'administrador']) && (
              <TabsContent key={role} value={role}>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                  <h2 className="text-xl md:text-2xl font-semibold capitalize">Manual de {role}</h2>
                  <div className="flex flex-wrap gap-2">
                    <PDFViewer 
                      url={`/manuales/${role}.pdf`} 
                      fileName={`Manual de ${role}`}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadPDF(role)}
                      className="w-full sm:w-auto"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Descargar PDF
                    </Button>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-2">
                  {sections.map((section, index) => (
                    <AccordionItem key={index} value={`section-${index}`} className="border rounded-lg">
                      <AccordionTrigger className="px-4 py-2 hover:no-underline">
                        <div className="flex items-center gap-2">
                          {section.icon}
                          <span className="text-sm md:text-base">{section.title}</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4">
                        <ul className="list-disc pl-6 space-y-2">
                          {section.content.map((item, itemIndex) => (
                            <li key={itemIndex} className="text-sm md:text-base text-muted-foreground">
                              {item}
                            </li>
                          ))}
                        </ul>
                        {role === 'administrador' && getMetricType(section.title) && (
                          <div className="mt-6">
                            <ReportMetrics type={getMetricType(section.title)!} />
                          </div>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </TabsContent>
            )
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default Ayuda;
