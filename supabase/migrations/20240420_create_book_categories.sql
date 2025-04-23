
-- Create book_categories table (For future implementation)
CREATE TABLE IF NOT EXISTS public.book_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre TEXT NOT NULL,
  descripcion TEXT
);

-- Add a foreign key to books table (For future implementation - commented out until ready to migrate)
-- ALTER TABLE public.books ADD CONSTRAINT fk_book_category FOREIGN KEY (categoria) REFERENCES public.book_categories(nombre);
