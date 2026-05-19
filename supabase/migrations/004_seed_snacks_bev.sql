-- Snacks
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty,image_url)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty,p.image_url
FROM (VALUES
  ('Lays Classic Salted','Crispy potato chips',20,20,'52g',true,200,NULL),
  ('Lays Magic Masala','Spicy masala chips',20,20,'52g',false,180,NULL),
  ('Doritos Nacho Cheese','Cheesy nacho chips',40,45,'50g',true,150,NULL),
  ('Bingo Mad Angles','Masala-flavored triangles',20,20,'90g',false,150,NULL),
  ('Kurkure Masala Munch','Crunchy corn puffs',20,20,'90g',false,180,NULL),
  ('Maggi 2-Min Noodles','Classic masala noodles',14,14,'70g',true,250,NULL),
  ('Top Ramen Noodles','Chicken flavour noodles',14,14,'70g',false,200,NULL),
  ('Parle-G Biscuits','Glucose biscuits',10,10,'100g',false,300,NULL),
  ('Oreo Original','Classic cream biscuits',30,35,'120g',true,200,NULL),
  ('Dark Fantasy Chocofills','Chocolate filled cookies',30,35,'75g',false,150,NULL),
  ('Bourbon Biscuits','Chocolate cream biscuits',20,22,'100g',false,160,NULL),
  ('Digestive Marie','Whole wheat digestive',45,52,'250g',false,120,NULL),
  ('Popcorn (Butter)','Microwave butter popcorn',89,100,'3 bags',false,100,NULL),
  ('Haldirams Namkeen','Assorted snack mix',60,70,'200g',true,130,NULL),
  ('Cashews (Roasted)','Salted roasted cashews',199,230,'200g',true,80,NULL),
  ('Almonds (Raw)','Premium California almonds',249,285,'200g',false,70,NULL),
  ('Mixed Nuts','Cashew almond walnut mix',299,350,'200g',true,60,NULL),
  ('Trail Mix','Nuts and dried fruits',175,199,'200g',false,65,NULL),
  ('Granola Bar','Oat and honey bar',40,48,'40g',false,120,NULL),
  ('Pringles Original','Stackable potato crisps',99,115,'110g',true,100,NULL)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty,image_url)
JOIN public.categories c ON c.slug='snacks';

-- Beverages
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty,image_url)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty,p.image_url
FROM (VALUES
  ('Coca Cola','Classic cola drink',45,50,'750ml',true,150,NULL),
  ('Pepsi','Original Pepsi cola',40,45,'600ml',false,130,NULL),
  ('Sprite Lemon Lime','Crisp lemon-lime soda',35,40,'600ml',false,120,NULL),
  ('Fanta Orange','Fizzy orange drink',35,40,'600ml',false,110,NULL),
  ('Thums Up','Strong cola drink',40,45,'600ml',true,130,NULL),
  ('Bisleri Water','Mineral drinking water',20,20,'1L',false,300,NULL),
  ('Aquafina Water','Purified water',20,20,'1L',false,250,NULL),
  ('Tropicana Orange','100% orange juice',80,95,'1L',true,90,NULL),
  ('Tropicana Apple','Apple juice drink',75,90,'1L',false,80,NULL),
  ('Real Guava Juice','Guava fruit drink',55,65,'1L',false,70,NULL),
  ('Red Bull','Energy drink',115,125,'250ml',true,100,NULL),
  ('Monster Energy','Monster energy drink',110,125,'355ml',false,80,NULL),
  ('Nescafe Classic','Instant coffee powder',259,299,'50g',true,70,NULL),
  ('Bru Gold Coffee','Premium instant coffee',185,210,'50g',false,60,NULL),
  ('Tata Tea Gold','Strong CTC tea leaves',195,225,'500g',true,80,NULL),
  ('Lipton Green Tea','Natural green tea bags',199,230,'25 bags',false,65,NULL),
  ('Minute Maid Nimbu Fresh','Lemon drink',25,30,'200ml',false,100,NULL),
  ('Paper Boat Aam Panna','Raw mango drink',25,30,'200ml',true,90,NULL),
  ('Horlicks','Malted milk drink',199,230,'200g',false,55,NULL),
  ('Boost Energy Drink','Chocolate malt drink',175,199,'200g',false,50,NULL)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty,image_url)
JOIN public.categories c ON c.slug='beverages';
