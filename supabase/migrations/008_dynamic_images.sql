-- Update all products to use the local dynamic vector/SVG generator endpoint
UPDATE public.products p
SET image_url = '/api/images/product?name=' || replace(p.name, ' ', '+') || '&category=' || c.slug
FROM public.categories c
WHERE p.category_id = c.id;
