-- Clear broken Unsplash image URLs from any previously seeded products
UPDATE public.products
SET image_url = NULL
WHERE image_url LIKE '%unsplash.com%';
