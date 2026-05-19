-- Breakfast
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty
FROM (VALUES
  ('Kelloggs Corn Flakes','Crunchy corn breakfast cereal',199,230,'500g',true,80),
  ('Kelloggs Chocos','Chocolate coated wheat balls',189,215,'375g',true,70),
  ('Muesli (Fruit & Nut)','Oats with fruits and nuts',249,285,'400g',false,60),
  ('Quaker Oats','Instant rolled oats',99,115,'200g',true,90),
  ('Upma Mix','Ready-to-cook upma mix',55,65,'200g',false,70),
  ('Idli Batter','Fresh fermented idli batter',60,72,'1 kg',true,50),
  ('Dosa Batter','Ready-to-use dosa batter',55,65,'1 kg',false,50),
  ('Pancake Mix','American pancake mix',149,175,'200g',false,45),
  ('Nutella Spread','Hazelnut chocolate spread',299,350,'350g',true,60),
  ('Peanut Butter (Crunchy)','Crunchy peanut spread',199,235,'350g',false,55),
  ('Almond Butter','Natural almond spread',349,399,'250g',false,35),
  ('Honey (Pure)','Raw organic honey',249,285,'250g',true,50),
  ('Jam (Mixed Fruit)','Kissan mixed fruit jam',89,105,'500g',false,60),
  ('Strawberry Preserve','Artisan strawberry jam',129,150,'250g',false,40),
  ('Maple Syrup','Pure Canadian maple syrup',399,450,'250ml',false,30),
  ('Protein Granola','High protein granola clusters',249,285,'300g',false,40),
  ('Overnight Oats Kit','Oats + toppings combo pack',179,210,'300g',false,35),
  ('Ragi Porridge Mix','Finger millet health porridge',89,105,'200g',false,45),
  ('Dates (Medjool)','Premium fresh dates',199,235,'200g',true,50),
  ('Chia Seeds','Organic white chia seeds',149,175,'150g',false,45)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty)
JOIN public.categories c ON c.slug='breakfast';

-- Frozen Foods
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty
FROM (VALUES
  ('Frozen Peas','Sweet garden peas',55,65,'500g',false,80),
  ('Frozen Sweet Corn','Whole kernel corn',55,65,'500g',false,75),
  ('Frozen Mixed Veg','Carrot peas corn beans',65,78,'500g',true,70),
  ('Frozen French Fries','Crispy potato fries',129,150,'500g',true,80),
  ('Frozen Momos (Veg)','Steamed veg dumplings',149,175,'15 pcs',true,60),
  ('Frozen Momos (Chicken)','Chicken steamed dumplings',175,199,'15 pcs',false,55),
  ('Frozen Burger Patty','Chicken burger patties',199,230,'4 pcs',false,50),
  ('Frozen Pizza Base','Ready-to-top pizza base',149,175,'2 pcs',false,45),
  ('Frozen Paratha','Whole wheat frozen paratha',89,105,'5 pcs',false,60),
  ('Ice Cream (Vanilla)','Classic vanilla ice cream',149,175,'750ml',true,50),
  ('Ice Cream (Chocolate)','Rich chocolate ice cream',149,175,'750ml',false,50),
  ('Kulfi (Malai)','Traditional malai kulfi',25,30,'1 pc',true,80),
  ('Kulfi (Mango)','Mango flavored kulfi',25,30,'1 pc',false,70)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty)
JOIN public.categories c ON c.slug='frozen-foods';

-- Cleaning
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty
FROM (VALUES
  ('Vim Dishwash Liquid','Lemon dishwash gel',99,115,'500ml',true,100),
  ('Surf Excel Liquid','Stain remover detergent',185,210,'750ml',true,90),
  ('Ariel Liquid','Advanced fabric care',199,230,'750ml',false,80),
  ('Tide Detergent Bar','Laundry washing bar',25,30,'150g',false,120),
  ('Colin Glass Cleaner','Glass surface spray',139,160,'500ml',false,70),
  ('Harpic Toilet Cleaner','Powerful bowl cleaner',89,105,'500ml',true,80),
  ('Lizol Floor Cleaner','Disinfectant floor cleaner',149,175,'500ml',false,75),
  ('Scotch-Brite Scrubber','Dual-side scrub pad',39,48,'3 pcs',false,120),
  ('Garbage Bags (Large)','Heavy duty trash bags',89,105,'30 pcs',false,100),
  ('Garbage Bags (Medium)','Medium trash bags',69,80,'30 pcs',false,100),
  ('Tissue Paper Rolls','2-ply toilet paper rolls',129,150,'6 rolls',true,100),
  ('Kitchen Paper Towels','Absorbent paper towels',79,92,'2 rolls',false,90),
  ('Wet Wipes (Household)','Multi-surface wet wipes',79,95,'80 pcs',false,80),
  ('Febreze Air Freshener','Fabric odour eliminator',199,230,'300ml',false,60),
  ('Air Freshener Spray','Floral room freshener',99,115,'200ml',false,70)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty)
JOIN public.categories c ON c.slug='cleaning';

-- Personal Care
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty
FROM (VALUES
  ('Dove Beauty Bar','Moisturizing soap bar',65,75,'75g',true,100),
  ('Dettol Soap','Antibacterial soap bar',45,52,'75g',false,100),
  ('Head & Shoulders Shampoo','Anti-dandruff shampoo',199,230,'180ml',true,80),
  ('Pantene Shampoo','Smooth and silky shampoo',199,230,'180ml',false,75),
  ('Dove Conditioner','Intense repair conditioner',175,199,'180ml',false,70),
  ('Colgate MaxFresh','Cooling mint toothpaste',89,105,'150g',true,90),
  ('Sensodyne','Sensitive teeth toothpaste',149,175,'100g',false,70),
  ('Oral-B Toothbrush','Soft bristle toothbrush',49,58,'1 pc',false,100),
  ('Fogg Deo Spray','Fresh fragrance deodorant',175,199,'150ml',true,80),
  ('Whisper Ultra Pads','Thin sanitary pads',149,175,'15 pcs',false,80),
  ('Stayfree Dry Max','Super dry pads',129,150,'15 pcs',false,75),
  ('Gillette Mach3','3-blade shaving razor',199,230,'1 razor',false,60),
  ('Gillette Shaving Gel','Sensitive shaving gel',149,175,'175g',false,55),
  ('Vaseline Body Lotion','Deep moisture lotion',155,180,'200ml',false,70),
  ('Sunscreen SPF 50','Sun protection cream',249,285,'50g',true,60),
  ('Face Wash (Neem)','Himalaya neem face wash',89,105,'100ml',false,70),
  ('Trimmer Blades','Compatible trimmer blades',199,235,'2 pcs',false,40),
  ('Disposable Razors','3-blade disposable pack',89,105,'5 pcs',false,60),
  ('Tweezers','Precision eyebrow tweezer',99,120,'1 pc',false,50),
  ('Cotton Pads','Soft cotton removal pads',79,95,'100 pcs',false,70)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty)
JOIN public.categories c ON c.slug='personal-care';

-- Condiments & Sauces
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty
FROM (VALUES
  ('Kissan Tomato Ketchup','Classic tomato sauce',89,105,'500g',true,100),
  ('Maggi Hot & Sweet Sauce','Chilli tomato sauce',75,89,'500g',false,90),
  ('Mayonnaise (Classic)','Creamy sandwich spread',99,115,'250g',true,80),
  ('Mustard Sauce','Yellow mustard condiment',65,78,'250g',false,70),
  ('Soy Sauce','Dark soy sauce',55,65,'200ml',false,80),
  ('Sriracha Hot Sauce','Thai chilli hot sauce',149,175,'250ml',true,60),
  ('Tabasco Sauce','Original red pepper sauce',199,230,'60ml',false,50),
  ('Olive Tapenade','Kalamata olive spread',249,285,'180g',false,35),
  ('Hummus','Lebanese chickpea dip',129,150,'200g',true,50),
  ('Salsa (Mild)','Tomato salsa dip',129,150,'300g',false,45),
  ('Pesto Sauce','Basil pine nut pesto',199,230,'130g',false,40),
  ('Pasta Sauce (Arrabbiata)','Spicy tomato pasta sauce',149,175,'350g',true,55),
  ('Pasta Sauce (Marinara)','Classic tomato basil',149,175,'350g',false,50),
  ('Coconut Milk','Thai cooking coconut milk',55,65,'400ml',false,70),
  ('Soy Sauce (Light)','Light cooking soy sauce',55,65,'200ml',false,70)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty)
JOIN public.categories c ON c.slug='condiments';

-- Instant Food
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty
FROM (VALUES
  ('Maggi Masala Noodles','2-minute instant noodles',14,14,'70g',true,250),
  ('Yippee Noodles','Smooth round noodles',14,14,'70g',false,200),
  ('Knorr Soup (Tomato)','Instant tomato soup mix',45,55,'55g',true,100),
  ('Knorr Soup (Sweet Corn)','Instant corn soup mix',45,55,'55g',false,90),
  ('Haldirams Dal Makhani','Ready-to-eat dal',85,100,'300g',true,70),
  ('Haldirams Palak Paneer','Ready-to-eat curry',95,115,'300g',false,65),
  ('MTR Poha Mix','Ready-to-cook poha',45,55,'180g',false,80),
  ('MTR Upma Mix','Instant semolina upma',45,55,'180g',false,75),
  ('Cup Noodles (Chicken)','Hot cup instant noodles',35,40,'75g',true,120),
  ('Tasty Treat Biryani RTE','Ready-to-eat biryani',149,175,'250g',true,60),
  ('Gits Gulab Jamun Mix','Instant gulab jamun',89,105,'175g',false,60),
  ('Gits Kheer Mix','Instant rice kheer',55,65,'100g',false,55),
  ('Sunfeast Pasta (Penne)','Quick-cook pasta',59,70,'200g',false,70),
  ('Pasta (Fusilli)','Spiral shaped pasta',65,78,'500g',false,65),
  ('Canned Corn','Sweetened whole kernel corn',55,65,'400g',false,60)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty)
JOIN public.categories c ON c.slug='instant-food';

-- Pet Care
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty
FROM (VALUES
  ('Pedigree Dog Food','Adult dog dry food',299,350,'1.2 kg',true,60),
  ('Whiskas Cat Food','Adult cat wet food',55,65,'85g',true,80),
  ('Royal Canin (Mini)','Small breed dog food',699,799,'1 kg',false,35),
  ('Dog Treat Sticks','Chicken flavour treats',129,150,'100g',false,55),
  ('Cat Treat Temptations','Crunchy cat snacks',99,115,'85g',false,50),
  ('Pet Shampoo (Dog)','Gentle dog shampoo',199,230,'200ml',false,40)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty)
JOIN public.categories c ON c.slug='pet-care';

-- Baby Care
INSERT INTO public.products (name,description,price,mrp,unit,category_id,is_featured,stock_qty)
SELECT p.name,p.description,p.price,p.mrp,p.unit,c.id,p.is_featured,p.stock_qty
FROM (VALUES
  ('Pampers Baby Dry','Soft absorbent diapers',599,699,'40 pcs',true,50),
  ('Huggies Ultra Soft','Ultra-thin baby diapers',549,649,'40 pcs',false,45),
  ('Johnson Baby Shampoo','Tear-free gentle shampoo',175,199,'200ml',true,60),
  ('Johnson Baby Lotion','Soft moisturizing lotion',149,175,'200ml',false,55),
  ('Nestle Cerelac','Wheat rice baby cereal',199,235,'300g',true,50),
  ('Himalaya Baby Soap','Natural gentle soap',45,55,'75g',false,70),
  ('WaterWipes Baby Wipes','99% water sensitive wipes',299,349,'60 pcs',false,45),
  ('Gripe Water','Colic relief drops',89,105,'100ml',false,55)
) AS p(name,description,price,mrp,unit,is_featured,stock_qty)
JOIN public.categories c ON c.slug='baby-care';

-- Coupons
INSERT INTO public.coupons (code,discount_type,discount_value,min_order_value,max_uses,is_active) VALUES
  ('WATNOT10','percent',10,100,1000,true),
  ('FIRST50','flat',50,200,500,true),
  ('SAVE30','flat',30,150,200,true),
  ('MEAT20','percent',20,300,100,true),
  ('FRESH15','percent',15,250,300,true)
ON CONFLICT (code) DO NOTHING;
