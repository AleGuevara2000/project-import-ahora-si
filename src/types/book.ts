import { IBook, IBookCategory } from './interfaces';

export type Book = IBook;
export type BookCategory = IBookCategory;

export const mockCategories: BookCategory[] = [
  {
    id: '1',
    nombre: 'Matemáticas',
    descripcion: 'Libros de matemáticas, cálculo, álgebra y geometría'
  },
  {
    id: '2',
    nombre: 'Física',
    descripcion: 'Libros de física, mecánica y termodinámica'
  },
  {
    id: '3',
    nombre: 'Informática',
    descripcion: 'Libros de programación, redes y sistemas'
  },
  {
    id: '4',
    nombre: 'Química',
    descripcion: 'Libros de química general y orgánica'
  }
];

export const mockBooks: Book[] = [
  {
    id: '1',
    titulo: 'Cálculo de una variable',
    autor: 'James Stewart',
    isbn: '9786075228280',
    categoria: 'Matemáticas',
    editorial: 'Cengage Learning',
    anioPublicacion: 2018,
    copias: 5,
    disponibles: 3,
    ubicacion: 'Estante A-1',
    descripcion: 'Texto clásico para el estudio del cálculo diferencial e integral.',
  },
  {
    id: '2',
    titulo: 'Física para ciencias e ingeniería',
    autor: 'Raymond A. Serway',
    isbn: '9786075228426',
    categoria: 'Física',
    editorial: 'Cengage Learning',
    anioPublicacion: 2019,
    copias: 4,
    disponibles: 2,
    ubicacion: 'Estante B-3',
    descripcion: 'Libro completo sobre física para estudiantes de ingeniería.',
  },
  {
    id: '3',
    titulo: 'Introducción a la Programación con Python',
    autor: 'Arnaldo Pérez Castaño',
    isbn: '9781683922193',
    categoria: 'Informática',
    editorial: 'Alfa Omega',
    anioPublicacion: 2020,
    copias: 8,
    disponibles: 5,
    ubicacion: 'Estante C-2',
    descripcion: 'Guía práctica para aprender a programar en Python desde cero.',
  },
  {
    id: '4',
    titulo: 'Química General',
    autor: 'Petrucci, Herring, Madura',
    isbn: '9788490355336',
    categoria: 'Química',
    editorial: 'Pearson',
    anioPublicacion: 2017,
    copias: 3,
    disponibles: 1,
    ubicacion: 'Estante B-1',
    descripcion: 'Principios esenciales de la química moderna explicados con claridad.',
  },
  {
    id: '5',
    titulo: 'Base de Datos',
    autor: 'Abraham Silberschatz',
    isbn: '9781260084504',
    categoria: 'Informática',
    editorial: 'McGraw-Hill',
    anioPublicacion: 2019,
    copias: 6,
    disponibles: 4,
    ubicacion: 'Estante C-3',
    descripcion: 'Fundamentos de diseño e implementación de bases de datos.',
  },
  {
    id: '6',
    titulo: 'Álgebra Lineal y sus Aplicaciones',
    autor: 'David C. Lay',
    isbn: '9786073221412',
    categoria: 'Matemáticas',
    editorial: 'Pearson',
    anioPublicacion: 2016,
    copias: 7,
    disponibles: 3,
    ubicacion: 'Estante A-2',
    descripcion: 'Estudio completo de algebra lineal con aplicaciones prácticas.',
  },
];
