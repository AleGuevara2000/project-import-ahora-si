
import { IDigitalBook } from './interfaces';

export type DigitalBook = IDigitalBook;

export const mockDigitalBooks: DigitalBook[] = [
  {
    id: '1',
    bookId: '1',
    formato: 'PDF',
    url: 'https://ejemplo.com/libros/calculo-stewart.pdf',
    tamanioMb: 15.4,
    fechaSubida: new Date('2023-03-15'),
    resumen: 'Libro fundamental de cálculo que cubre derivadas, integrales y aplicaciones. Incluye ejemplos prácticos y ejercicios graduados.'
  },
  {
    id: '2',
    bookId: '2',
    formato: 'EPUB',
    url: 'https://ejemplo.com/libros/fisica-serway.epub',
    tamanioMb: 8.2,
    fechaSubida: new Date('2023-04-10'),
    resumen: 'Texto comprensivo de física que abarca mecánica, termodinámica y electromagnetismo con enfoque en ingeniería.'
  },
  {
    id: '3',
    bookId: '3',
    formato: 'PDF',
    url: 'https://ejemplo.com/libros/python-intro.pdf',
    tamanioMb: 12.7,
    fechaSubida: new Date('2023-02-28'),
    resumen: 'Guía introductoria a Python que cubre fundamentos de programación, estructuras de datos y algoritmos básicos.'
  },
  {
    id: '4',
    bookId: '4',
    formato: 'MOBI',
    url: 'https://ejemplo.com/libros/algoritmos-estructuras.mobi',
    tamanioMb: 6.8,
    fechaSubida: new Date('2024-01-15'),
    resumen: 'Manual completo sobre estructuras de datos y algoritmos. Incluye análisis de complejidad y patrones de diseño.'
  },
  {
    id: '5',
    bookId: '5',
    formato: 'HTML',
    url: 'https://ejemplo.com/libros/web-development-guide.html',
    tamanioMb: 3.2,
    fechaSubida: new Date('2024-02-20'),
    resumen: 'Guía práctica de desarrollo web que cubre HTML, CSS y JavaScript con ejemplos modernos.'
  },
  {
    id: '6',
    bookId: '1',
    formato: 'EPUB',
    url: 'https://ejemplo.com/libros/calculo-stewart.epub',
    tamanioMb: 10.1,
    fechaSubida: new Date('2024-03-01'),
    resumen: 'Versión digital del texto clásico de cálculo con contenido interactivo y ejemplos multimedia.'
  },
  {
    id: '7',
    bookId: '2',
    formato: 'MOBI',
    url: 'https://ejemplo.com/libros/fisica-serway.mobi',
    tamanioMb: 7.5,
    fechaSubida: new Date('2024-03-10'),
    resumen: 'Edición optimizada para lectura en dispositivos móviles del texto de física de Serway.'
  }
];
