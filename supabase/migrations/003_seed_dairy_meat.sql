-- Dairy & Eggs
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty,image_url)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty,p.image_url
FROM (VALUES
  ('Amul Full Cream Milk','Pasteurized full cream milk',30,32,'500ml',true,200,NULL),
  ('Amul Toned Milk','Low-fat toned milk',26,28,'500ml',false,150,NULL),
  ('Farm Eggs (White)','Fresh white eggs',72,80,'6 pcs',true,120,NULL),
  ('Farm Eggs (Brown)','Free-range brown eggs',85,95,'6 pcs',false,100,NULL),
  ('Egg Tray','Bulk farm fresh eggs',220,250,'30 pcs',false,50,NULL),
  ('Amul Butter','Salted butter block',55,60,'100g',true,90,NULL),
  ('Amul Unsalted Butter','Baking grade butter',58,64,'100g',false,60,NULL),
  ('Fresh Curd','Thick set dahi',38,45,'400g',false,80,NULL),
  ('Greek Yogurt','Thick creamy Greek yogurt',89,110,'200g',true,55,NULL),
  ('Paneer','Fresh cottage cheese block',70,80,'200g',true,60,NULL),
  ('Mozzarella Cheese','Fresh mozzarella',150,175,'200g',false,40,NULL),
  ('Cheddar Cheese Slices','Processed cheddar slices',99,115,'10 slices',false,50,NULL),
  ('Cream Cheese','Spreadable cream cheese',120,140,'180g',false,40,NULL),
  ('Amul Cream','Fresh table cream',45,52,'200ml',false,70,NULL),
  ('Lassi (Sweet)','Traditional sweet lassi',35,40,'200ml',false,60,NULL),
  ('Buttermilk','Spiced chaas',20,25,'200ml',false,80,NULL),
  ('Ghee','Pure cow ghee',149,175,'200ml',true,70,NULL),
  ('Condensed Milk','Sweetened condensed milk',55,62,'200g',false,55,NULL),
  ('Skimmed Milk Powder','Instant milk powder',199,225,'400g',false,40,NULL),
  ('Whipping Cream','Heavy whipping cream',130,150,'200ml',false,35,NULL)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty,image_url)
JOIN public.categories c ON c.slug='dairy-eggs';

-- Meat & Seafood
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty,image_url)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty,p.image_url
FROM (VALUES
  ('Chicken Breast','Boneless skinless chicken breast',189,220,'500g',true,80,NULL),
  ('Chicken Leg Pieces','Fresh bone-in chicken legs',149,175,'500g',true,80,NULL),
  ('Whole Chicken','Dressed whole chicken',299,349,'1 kg',false,40,NULL),
  ('Chicken Keema','Fresh minced chicken',170,199,'500g',false,60,NULL),
  ('Chicken Wings','Fresh chicken wings',159,185,'500g',true,55,NULL),
  ('Mutton Curry Cut','Tender goat curry pieces',449,520,'500g',true,40,NULL),
  ('Mutton Keema','Fresh minced mutton',399,460,'500g',false,35,NULL),
  ('Lamb Chops','Tender lamb chops',550,650,'500g',false,25,NULL),
  ('Prawns (Medium)','Fresh cleaned prawns',299,350,'250g',true,45,NULL),
  ('Prawns (Large)','Jumbo tiger prawns',450,525,'250g',false,30,NULL),
  ('Rohu Fish','Fresh Rohu fish steaks',199,235,'500g',false,40,NULL),
  ('Salmon Fillet','Norwegian salmon fillet',599,699,'250g',true,25,NULL),
  ('Tuna Steaks','Fresh yellowfin tuna',450,525,'250g',false,20,NULL),
  ('Pomfret Fish','Fresh silver pomfret',349,399,'500g',true,35,NULL),
  ('Squid (Calamari)','Cleaned fresh squid rings',250,299,'250g',false,25,NULL),
  ('Crab (Mud)','Fresh mud crabs',350,420,'500g',false,20,NULL),
  ('Beef Mince','Fresh minced beef',320,380,'500g',false,30,NULL),
  ('Pork Ribs','Fresh pork spare ribs',380,450,'500g',false,25,NULL),
  ('Chicken Sausages','Smoked chicken sausages',129,150,'6 pcs',true,60,NULL),
  ('Salami Slices','Italian style salami',149,175,'100g',false,50,NULL)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty,image_url)
JOIN public.categories c ON c.slug='meat-seafood';
