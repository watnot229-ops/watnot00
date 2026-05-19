-- Categories
INSERT INTO public.categories (name, slug, display_order) VALUES
  ('Fruits & Veggies', 'fruits-veggies', 1),
  ('Dairy & Eggs', 'dairy-eggs', 2),
  ('Meat & Seafood', 'meat-seafood', 3),
  ('Snacks', 'snacks', 4),
  ('Beverages', 'beverages', 5),
  ('Bakery', 'bakery', 6),
  ('Staples & Grains', 'staples-grains', 7),
  ('Breakfast', 'breakfast', 8),
  ('Frozen Foods', 'frozen-foods', 9),
  ('Cleaning', 'cleaning', 10),
  ('Personal Care', 'personal-care', 11),
  ('Pet Care', 'pet-care', 12),
  ('Baby Care', 'baby-care', 13),
  ('Condiments & Sauces', 'condiments', 14),
  ('Instant Food', 'instant-food', 15)
ON CONFLICT (slug) DO NOTHING;

-- Helper: products for Fruits & Veggies
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty,image_url) SELECT p.* FROM (VALUES
  ('Fresh Tomatoes','Farm fresh red tomatoes',29,39,'500g',TRUE,100,NULL),
  ('Red Onion','Locally sourced red onions',25,30,'500g',FALSE,150,NULL),
  ('Baby Spinach','Tender baby spinach leaves',35,42,'200g',TRUE,80,NULL),
  ('Banana','Ripe yellow bananas',35,45,'1 dozen',FALSE,120,NULL),
  ('Kashmiri Apple','Crisp red apples',120,149,'4 pcs',FALSE,60,NULL),
  ('Cucumber','Fresh green cucumbers',18,22,'2 pcs',FALSE,100,NULL),
  ('Carrot','Farm fresh carrots',30,36,'500g',FALSE,90,NULL),
  ('Bell Pepper Mix','Red, yellow and green peppers',55,65,'3 pcs',TRUE,70,NULL),
  ('Green Peas','Fresh shelled green peas',40,48,'250g',FALSE,60,NULL),
  ('Cauliflower','White fresh cauliflower',45,55,'1 head',FALSE,50,NULL),
  ('Broccoli','Fresh green broccoli',60,72,'1 head',FALSE,50,NULL),
  ('Sweet Corn','Fresh yellow corn cobs',20,24,'2 pcs',FALSE,80,NULL),
  ('Ginger','Fresh ginger root',15,18,'100g',FALSE,100,NULL),
  ('Garlic','Fresh garlic bulbs',25,30,'100g',FALSE,100,NULL),
  ('Lemon','Juicy yellow lemons',20,25,'4 pcs',FALSE,90,NULL),
  ('Watermelon','Sweet seedless watermelon',89,109,'1 kg (cut)',TRUE,30,NULL),
  ('Mango','Alphonso mango',149,180,'500g',TRUE,40,NULL),
  ('Grapes (Green)','Seedless green grapes',79,95,'500g',FALSE,50,NULL),
  ('Pomegranate','Fresh pomegranate',60,75,'1 pc',FALSE,45,NULL),
  ('Avocado','Ripe Hass avocado',89,110,'2 pcs',TRUE,35,NULL)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty,image_url)
JOIN public.categories c ON c.slug='fruits-veggies';
