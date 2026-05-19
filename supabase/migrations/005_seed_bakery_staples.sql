-- Bakery
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty,image_url)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty,p.image_url
FROM (VALUES
  ('Britannia Sandwich Bread','Soft white bread',45,50,'400g',true,100,NULL),
  ('Multigrain Bread','Healthy seed bread',65,75,'400g',false,80,NULL),
  ('Brown Bread','Whole wheat bread',55,62,'400g',false,75,NULL),
  ('Pav Buns','Soft dinner rolls',20,22,'6 pcs',false,80,NULL),
  ('Butter Croissant','Flaky French croissant',45,55,'2 pcs',true,40,NULL),
  ('Chocolate Muffin','Rich chocolate muffin',55,65,'1 pc',true,35,NULL),
  ('Blueberry Muffin','Fresh blueberry muffin',55,65,'1 pc',false,30,NULL),
  ('Chocolate Brownie','Fudgy walnut brownie',65,80,'1 pc',true,30,NULL),
  ('Cinnamon Roll','Glazed cinnamon swirl',79,95,'1 pc',false,25,NULL),
  ('Banana Bread Slice','Moist banana loaf',60,72,'1 slice',false,25,NULL),
  ('Garlic Bread','Herb garlic baguette',89,105,'2 pcs',true,40,NULL),
  ('Sourdough Bread','Artisan sourdough loaf',149,175,'400g',false,30,NULL),
  ('Cupcake Assorted','Mixed frosted cupcakes',50,60,'1 pc',false,30,NULL),
  ('Cheese Danish','Flaky cheese pastry',65,78,'1 pc',false,20,NULL),
  ('Pita Bread','Soft pita flatbread',45,52,'4 pcs',false,45,NULL)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty,image_url)
JOIN public.categories c ON c.slug='bakery';

-- Staples & Grains
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty,image_url)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty,p.image_url
FROM (VALUES
  ('Basmati Rice','Long grain premium rice',149,175,'1 kg',true,120,NULL),
  ('Sona Masoori Rice','Everyday cooking rice',99,115,'1 kg',false,100,NULL),
  ('Toor Dal','Split pigeon peas',99,115,'500g',true,90,NULL),
  ('Moong Dal','Yellow split moong',89,105,'500g',false,85,NULL),
  ('Masoor Dal','Red lentils',79,95,'500g',false,85,NULL),
  ('Chana Dal','Bengal gram split',89,105,'500g',false,80,NULL),
  ('Kabuli Chana','White chickpeas',99,120,'500g',false,75,NULL),
  ('Rajma (Red Kidney)','Red kidney beans',85,100,'500g',false,75,NULL),
  ('Aashirvaad Atta','Whole wheat flour',75,88,'1 kg',true,100,NULL),
  ('Maida','All-purpose flour',45,52,'1 kg',false,90,NULL),
  ('Besan','Chickpea flour',65,78,'500g',false,80,NULL),
  ('Semolina (Rava)','Fine semolina',45,54,'500g',false,80,NULL),
  ('Rolled Oats','Quaker-style oats',149,175,'500g',true,70,NULL),
  ('Poha (Flattened Rice)','Thin rice flakes',45,55,'500g',false,70,NULL),
  ('Sugar','Refined white sugar',55,62,'1 kg',false,100,NULL),
  ('Brown Sugar','Unrefined cane sugar',89,105,'500g',false,60,NULL),
  ('Sunflower Oil','Refined sunflower oil',175,199,'1L',true,80,NULL),
  ('Olive Oil','Extra virgin olive oil',399,450,'500ml',false,50,NULL),
  ('Table Salt','Iodized table salt',20,22,'1 kg',false,150,NULL),
  ('Black Pepper','Ground black pepper',55,65,'50g',false,80,NULL)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty,image_url)
JOIN public.categories c ON c.slug='staples-grains';
