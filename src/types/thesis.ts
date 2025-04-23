import { IThesis } from './interfaces';

// Use the interface instead of the database type
export type Thesis = IThesis;

export const mockTheses: Thesis[] = [
  {
    id: "1",
    titulo: "Desarrollo de un Sistema de Reconocimiento de Patrones para Análisis de Imágenes Médicas",
    autor: "Juan Pérez Martínez",
    carrera: "Ingeniería en Computación",
    anio: 2023,
    director: "Dr. María Rodríguez López",
    tipo: "Maestría",
    disponible: true,
    resumen: "Investigación sobre la implementación de algoritmos de deep learning para la detección temprana de patologías en imágenes médicas.",
    archivoPdf: "/tesis/ejemplo1.pdf"
  },
  {
    id: "2",
    titulo: "Optimización de Procesos Industriales mediante Algoritmos Genéticos",
    autor: "Ana García Ramírez",
    carrera: "Ingeniería Industrial",
    anio: 2022,
    director: "Dr. Carlos Sánchez Díaz",
    tipo: "Doctorado",
    disponible: true,
    resumen: "Estudio sobre la aplicación de algoritmos genéticos en la optimización de procesos de manufactura."
  },
  {
    id: "3",
    titulo: "Diseño e Implementación de un Sistema de Energía Solar para Comunidades Rurales",
    autor: "Luis Torres Hernández",
    carrera: "Ingeniería en Electrónica",
    anio: 2023,
    director: "Dra. Patricia López Mendoza",
    tipo: "Licenciatura",
    disponible: true,
    resumen: "Proyecto de implementación de sistemas fotovoltaicos en comunidades rurales de la Mixteca."
  }
];
