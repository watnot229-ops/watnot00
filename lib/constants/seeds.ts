export interface SeedProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  mrp: number;
  unit: string;
  category_id: string;
  is_available: boolean;
  is_featured: boolean;
  image_url: string;
}

export const DEFAULT_CATEGORIES = [
  { id: "cat-fruits-veggies", name: "Fruits & Veggies", slug: "fruits-veggies" },
  { id: "cat-dairy-eggs", name: "Dairy & Eggs", slug: "dairy-eggs" },
  { id: "cat-meat-seafood", name: "Meat & Seafood", slug: "meat-seafood" },
  { id: "cat-snacks", name: "Snacks", slug: "snacks" },
  { id: "cat-beverages", name: "Beverages", slug: "beverages" },
  { id: "cat-bakery", name: "Bakery", slug: "bakery" },
  { id: "cat-staples-grains", name: "Staples & Grains", slug: "staples-grains" },
  { id: "cat-breakfast", name: "Breakfast", slug: "breakfast" },
  { id: "cat-frozen-foods", name: "Frozen Foods", slug: "frozen-foods" },
  { id: "cat-cleaning", name: "Cleaning", slug: "cleaning" },
  { id: "cat-personal-care", name: "Personal Care", slug: "personal-care" },
  { id: "cat-pet-care", name: "Pet Care", slug: "pet-care" },
  { id: "cat-baby-care", name: "Baby Care", slug: "baby-care" },
  { id: "cat-condiments", name: "Condiments & Sauces", slug: "condiments" },
  { id: "cat-instant-food", name: "Instant Food", slug: "instant-food" }
];

export const DEFAULT_PRODUCTS: SeedProduct[] = [
  {
    id: "seed-tomatoes",
    name: "Fresh Tomatoes",
    description: "Farm fresh juicy red tomatoes",
    price: 29,
    mrp: 39,
    unit: "500g",
    category_id: "cat-fruits-veggies",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=Fresh+Tomatoes&category=fruits-veggies"
  },
  {
    id: "seed-onion",
    name: "Red Onion",
    description: "Locally sourced crispy red onions",
    price: 25,
    mrp: 30,
    unit: "500g",
    category_id: "cat-fruits-veggies",
    is_available: true,
    is_featured: false,
    image_url: "/api/images/product?name=Red+Onion&category=fruits-veggies"
  },
  {
    id: "seed-apple",
    name: "Kashmiri Apple",
    description: "Crisp premium red apples from Kashmir valleys",
    price: 120,
    mrp: 149,
    unit: "4 pcs",
    category_id: "cat-fruits-veggies",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=Kashmiri+Apple&category=fruits-veggies"
  },
  {
    id: "seed-milk",
    name: "Amul Full Cream Milk",
    description: "Pasteurized rich full cream milk pouch",
    price: 30,
    mrp: 32,
    unit: "500ml",
    category_id: "cat-dairy-eggs",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=Full+Cream+Milk&category=dairy-eggs"
  },
  {
    id: "seed-eggs",
    name: "Farm Eggs (White)",
    description: "Fresh high protein white table eggs",
    price: 72,
    mrp: 80,
    unit: "6 pcs",
    category_id: "cat-dairy-eggs",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=White+Eggs&category=dairy-eggs"
  },
  {
    id: "seed-butter",
    name: "Amul Salted Butter",
    description: "Utterly butterly delicious salted butter block",
    price: 55,
    mrp: 60,
    unit: "100g",
    category_id: "cat-dairy-eggs",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=Salted+Butter&category=dairy-eggs"
  },
  {
    id: "seed-paneer",
    name: "Fresh Paneer Block",
    description: "Soft fresh paneer cottage cheese block",
    price: 70,
    mrp: 80,
    unit: "200g",
    category_id: "cat-dairy-eggs",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=Paneer&category=dairy-eggs"
  },
  {
    id: "seed-chicken",
    name: "Chicken Breast",
    description: "Boneless tender skinless chicken breast fillet",
    price: 189,
    mrp: 220,
    unit: "500g",
    category_id: "cat-meat-seafood",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=Chicken+Breast&category=meat-seafood"
  },
  {
    id: "seed-chips",
    name: "Potato Chips Classic Salted",
    description: "Crispy crunchy classic salted potato chips",
    price: 20,
    mrp: 20,
    unit: "50g",
    category_id: "cat-snacks",
    is_available: true,
    is_featured: false,
    image_url: "/api/images/product?name=Potato+Chips&category=snacks"
  },
  {
    id: "seed-bread",
    name: "Premium Sliced White Bread",
    description: "Freshly baked soft white sliced bread loaf",
    price: 40,
    mrp: 45,
    unit: "400g",
    category_id: "cat-bakery",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=Sliced+Bread&category=bakery"
  },
  {
    id: "seed-juice",
    name: "Real Orange Juice",
    description: "100% pure orange juice rich in Vitamin C",
    price: 99,
    mrp: 120,
    unit: "1L",
    category_id: "cat-beverages",
    is_available: true,
    is_featured: false,
    image_url: "/api/images/product?name=Orange+Juice&category=beverages"
  },
  {
    id: "seed-maggi",
    name: "Maggi 2-Minute Noodles",
    description: "Your favorite instant masala noodles pack",
    price: 14,
    mrp: 14,
    unit: "70g",
    category_id: "cat-instant-food",
    is_available: true,
    is_featured: true,
    image_url: "/api/images/product?name=Maggi+Noodles&category=instant-food"
  }
];
