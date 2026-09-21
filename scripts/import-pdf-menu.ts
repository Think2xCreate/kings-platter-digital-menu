import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
dotenv.config();

import { Category, FoodItem, DietaryType, PricingType } from '../src/types/menu';

export interface PDFMenuItem {
  name: string;
  categorySlug: string;
  categoryName: string;
  description?: string;
  dietary: DietaryType;
  pricingType: PricingType;
  price: number;
  vegPrice?: number;
  nonVegPrice?: number;
  variants?: { id: string; label: string; price: number }[];
  displayOrder: number;
}

export interface PDFCategory {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  description: string;
  defaultPricingType?: PricingType;
  displayOrder: number;
  isActive: boolean;
}

// ==============================================================================
// 22 SOURCE CATEGORIES FROM KINGS_PLATTER_FINAL_MENU.PDF
// ==============================================================================
export const PDF_CATEGORIES: PDFCategory[] = [
  { id: 'cat-soup', name: 'Soup', slug: 'soup', iconName: 'Soup', description: 'Freshly brewed aromatic soups', displayOrder: 1, isActive: true },
  { id: 'cat-fresh-harvest', name: 'Fresh Harvest', slug: 'fresh-harvest', iconName: 'Salad', description: 'Crisp salads and fresh harvest creations', displayOrder: 2, isActive: true },
  { id: 'cat-appetizers-veg', name: 'Appetizers (Veg)', slug: 'appetizers-veg', iconName: 'Utensils', description: 'Crispy vegetarian starters and sizzlers', displayOrder: 3, isActive: true },
  { id: 'cat-appetizers-non-veg', name: 'Appetizers (Non Veg)', slug: 'appetizers-non-veg', iconName: 'Flame', description: 'Tandoori, kebabs and fiery meat starters', displayOrder: 4, isActive: true },
  { id: 'cat-kings-special-seafood', name: 'King\'s Special Seafood', slug: 'kings-special-seafood', iconName: 'Fish', description: 'Fresh coastal prawns, fish tikka and tawa fry', displayOrder: 5, isActive: true },
  { id: 'cat-mains', name: 'Mains', slug: 'mains', iconName: 'ChefHat', description: 'Continental mains and chef signature roasts', displayOrder: 6, isActive: true },
  { id: 'cat-pasta-and-risotto', name: 'Pasta And Risotto', slug: 'pasta-and-risotto', iconName: 'UtensilsCrossed', description: 'Handcrafted pastas, lasagne and creamy risottos', displayOrder: 7, isActive: true },
  { id: 'cat-asian-mains', name: 'Asian Mains', slug: 'asian-mains', iconName: 'Bowl', description: 'Thai curries, ramen and khao suey', displayOrder: 8, isActive: true },
  { id: 'cat-indian-mains-veg', name: 'Indian Mains Veg', slug: 'indian-mains-veg', iconName: 'Soup', description: 'Rich paneer butter masala, koftas and lentils', displayOrder: 9, isActive: true },
  { id: 'cat-indian-mains-non-veg', name: 'Indian Mains Non-veg', slug: 'indian-mains-non-veg', iconName: 'Flame', description: 'Authentic butter chicken, makhani and mutton rogan josh', displayOrder: 10, isActive: true },
  { id: 'cat-noodle-and-rice', name: 'Noodle And Rice', slug: 'noodle-and-rice', iconName: 'Utensils', description: 'Wok-tossed hakka noodles and fried rice', displayOrder: 11, isActive: true },
  { id: 'cat-assorted-breads', name: 'Assorted Breads', slug: 'assorted-breads', iconName: 'Bread', description: 'Tandoori rotis, garlic naans and kulchas', displayOrder: 12, isActive: true },
  { id: 'cat-sandwich-n-burger', name: 'Sandwich N Burger', slug: 'sandwich-n-burger', iconName: 'Sandwich', description: 'Gourmet burgers and toasted club sandwiches', displayOrder: 13, isActive: true },
  { id: 'cat-biriyani-and-mandi', name: 'Biriyani And Mandi', slug: 'biriyani-and-mandi', iconName: 'Crown', description: 'Royal dum biryani and tandoori mandi', displayOrder: 14, isActive: true },
  { id: 'cat-rice', name: 'Rice', slug: 'rice', iconName: 'Utensils', description: 'Jeera rice, pulao and aromatic biryani rice', displayOrder: 15, isActive: true },
  { id: 'cat-add-on', name: 'Add-on', slug: 'add-on', iconName: 'Plus', description: 'Sides, raitas, eggs and extra toppings', displayOrder: 16, isActive: true },
  { id: 'cat-dessert', name: 'Dessert', slug: 'dessert', iconName: 'Cake', description: 'Cheesecakes, brownies and tender coconut pudding', displayOrder: 17, isActive: true },
  { id: 'cat-juice', name: 'Juice', slug: 'juice', iconName: 'GlassWater', description: 'Freshly squeezed fruit juices and lime sodas', displayOrder: 18, isActive: true },
  { id: 'cat-milkshake', name: 'Milkshake', slug: 'milkshake', iconName: 'Milk', description: 'Thick creamy milkshakes and chocochip blends', displayOrder: 19, isActive: true },
  { id: 'cat-frappe', name: 'Frappe', slug: 'frappe', iconName: 'Coffee', description: 'Chilled iced coffee frappes and Spanish lattes', displayOrder: 20, isActive: true },
  { id: 'cat-beverage', name: 'Beverage', slug: 'beverage', iconName: 'Wine', description: 'Refreshing classic mojitos and fruit coolers', displayOrder: 21, isActive: true },
  { id: 'cat-bucket-biriyani', name: 'Bucket Biriyani', slug: 'bucket-biriyani', iconName: 'Gift', description: 'Grand family biryani buckets (4 to 6 persons)', displayOrder: 22, isActive: true },
];

// ==============================================================================
// ALL MENU ITEMS FROM KINGS_PLATTER_FINAL_MENU.PDF (PAGES 1-12)
// ==============================================================================
export const PDF_FOOD_ITEMS: PDFMenuItem[] = [
  // --- PAGE 1: SOUP ---
  { name: 'CREAM OF BROCCOLI CHEESE SOUP', categorySlug: 'soup', categoryName: 'Soup', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 185, displayOrder: 1 },
  { name: 'MUSHROOM CAPPUCCINO', categorySlug: 'soup', categoryName: 'Soup', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 195, displayOrder: 2 },
  { name: 'CREAM OF CHICKEN', categorySlug: 'soup', categoryName: 'Soup', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 195, displayOrder: 3 },
  { name: 'MANCHOW SOUP', categorySlug: 'soup', categoryName: 'Soup', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 145, vegPrice: 145, nonVegPrice: 165, displayOrder: 4 },
  { name: 'HOT & SOUR', categorySlug: 'soup', categoryName: 'Soup', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 145, vegPrice: 145, nonVegPrice: 165, displayOrder: 5 },
  { name: 'CLEAR SOUP', categorySlug: 'soup', categoryName: 'Soup', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 125, vegPrice: 125, nonVegPrice: 145, displayOrder: 6 },
  { name: 'MUTTON PEPPER SOUP', categorySlug: 'soup', categoryName: 'Soup', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 215, displayOrder: 7 },

  // --- PAGE 1: FRESH HARVEST ---
  { name: 'WATERMELON FETA SALAD', categorySlug: 'fresh-harvest', categoryName: 'Fresh Harvest', description: 'Watermelon feta cheese in honey and lemon with romain lettuce', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 1 },
  { name: 'CESAR SALAD', categorySlug: 'fresh-harvest', categoryName: 'Fresh Harvest', description: 'Ice berg, roman lettuce with classic dressing and garlic bread', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 235, vegPrice: 235, nonVegPrice: 255, displayOrder: 2 },
  { name: 'WARM CHICKEN SALAD', categorySlug: 'fresh-harvest', categoryName: 'Fresh Harvest', description: 'Roman lettuce, iceberg and warm mexican chicken, corn, cheery tomato with vinegarette dressing', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 255, displayOrder: 3 },

  // --- PAGE 2: APPETIZERS (VEG) ---
  { name: 'FRENCH FRIES', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 125, displayOrder: 1 },
  { name: 'PERI PERI FRIES', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 2 },
  { name: 'CHEESE LOADED FRIES', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 185, displayOrder: 3 },
  { name: 'GARLIC BREAD', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 165, displayOrder: 4 },
  { name: 'KINGS NACHOS', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Corn nachos topped with rich melted cheese spicy jalapenos, tomato salsa, and sour cream', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 5 },
  { name: 'CORN CHEESE BALL', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Cheese & corn-filled bites coated in crispy bread crumbs', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 6 },
  { name: 'VEGITABLE SALT & PAPPER', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'exotic veggies fried and tossed with salt and pepper', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 245, displayOrder: 7 },
  { name: 'CHEESE GARLIC BREAD', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Baked garlic bread with mozzarella cheese', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 8 },
  { name: 'CRISPY CORN', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Crispy golden corn kernels tossed with bell pepper, aromatic spices', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 195, displayOrder: 9 },
  { name: 'VEG MANCHURIAN', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Exotic vegetable balls in Indo -Chinese sauce, sweet savoury', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 205, displayOrder: 10 },
  { name: 'BUTTER GARLIC MUSHROOM', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Mushroom tossed in garlic and herbs with rich creamy flavour', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 11 },
  { name: 'PANNER TIKKA/MALAI/GARLIC', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Char grilled panner, marinated in spicy yogurt', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 345, displayOrder: 12 },
  { name: 'DAHI KEBAB', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Hung cured, veggies, soft & spicy yogurt, Then deep fried', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 13 },
  { name: 'CORN PANNER SEEKH', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Sweet corn & panner seasoned with herbs & spices', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 14 },
  { name: 'KINGS VEG TANDOORI SIZZLER', categorySlug: 'appetizers-veg', categoryName: 'Appetizers (Veg)', description: 'Sizziling platter with varities of option', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 750, displayOrder: 15 },

  // --- PAGE 3: APPETIZERS (NON VEG) ---
  { name: 'ZESTY CHICKEN', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Crumbly coated chicken, with citrus, herbs & warm Spices', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 265, displayOrder: 1 },
  { name: 'GHEE ROAST CHICKEN', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Chicken pepper fry in Tamil Nadu style – curry leaves Fragrant and black pepper', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 295, displayOrder: 2 },
  { name: 'TANDOORI MURGH H/F', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Char grilled chicken, with spice yogurt', dietary: 'non-veg', pricingType: 'PORTION', price: 395, variants: [{ id: 'v-half', label: 'Half', price: 395 }, { id: 'v-full', label: 'Full', price: 745 }], displayOrder: 3 },
  { name: 'CHICKEN TIKKA(MALAI/GARLIC/MIRCHI)', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Thai boneless chicken, marinated in yogurt & spices', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 345, displayOrder: 4 },
  { name: 'PILI MIRCH TANGDI KABAB', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Drumstick chicken, marinated with yellow chilli And yogurt', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 325, displayOrder: 5 },
  { name: 'ANGRY WINGS( KOREAN/AMERICAN/PERI PERI)', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Fried chicken wings, tossed in sauces', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 345, displayOrder: 6 },
  { name: 'DRUMS OF HEAVEN', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Crispy chicken drumsticks, served tossed in chilli garlic sauce', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 375, displayOrder: 7 },
  { name: 'DRAGON CHICKEN', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Fried chicken strips, tossed with chilli garlic and sweet sauce', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 315, displayOrder: 8 },
  { name: 'CHICKEN 65', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'South Indian style fried chicken tossed with curry leaves And Spices', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 295, displayOrder: 9 },
  { name: 'DEVIL CHICKEN', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Firey chicken with pepper chilli, and aromatic in a Punchy sauce', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 295, displayOrder: 10 },
  { name: 'KUNG PAO CHICKEN', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Stir fried chicken, with aromatic and roasted peanut', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 325, displayOrder: 11 },
  { name: 'CHICKEN SEEKH KABAB', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Minced chicken, seasoned with herbs and spices and char-grilled', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 385, displayOrder: 12 },
  { name: 'MUTTON SEEKH', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Minced mutton char grilled with herbs and spices', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 445, displayOrder: 13 },
  { name: 'KINGS NON-VEG TANDOORI SIZZLER', categorySlug: 'appetizers-non-veg', categoryName: 'Appetizers (Non Veg)', description: 'Sizzling platter with varieties of kebab', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 1195, displayOrder: 14 },

  // --- PAGE 4: KING'S SPECIAL SEAFOOD ---
  { name: 'BUTTER GARLIC PRAWNS', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Prawns with butter roast garlic and a hint of lemon', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 385, displayOrder: 1 },
  { name: 'TEMPURA PRAWNS', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Battered fried prawns served with sweet chilli sauce', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 365, displayOrder: 2 },
  { name: 'DYNAMITE PRAWNS', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Crispy fried prawns, creamy spicy dynamite sauce', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 365, displayOrder: 3 },
  { name: 'TANDOORI PRAWNS', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Char grilled prawns, marinated in ginger/garlic and spices', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 395, displayOrder: 4 },
  { name: 'FISH FINGER', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Panko fried fish with mustard and lemon, served with tartar sauce', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 385, displayOrder: 5 },
  { name: 'CLASSIC FISH & CHIPS', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Crispy crumbed fish served with lettuce and wedges', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 485, displayOrder: 6 },
  { name: 'KING FISH TAWA FRY', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Pan seared fish with spices and aromatics', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 685, displayOrder: 7 },
  { name: 'MANGALOREAN GHEE ROAST PRAWNS', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Prawns roasted in fragrant ghee with a Mangalorean masala', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 325, displayOrder: 8 },
  { name: 'GARLIC FISH TIKKA', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Basa fish tikka marinated with garlic and aromatic spices', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 345, displayOrder: 9 },
  { name: 'GOAN CURRY (FISH/PRAWN)', categorySlug: 'kings-special-seafood', categoryName: 'King\'s Special Seafood', description: 'Coconut based Goan gravy with spices and silky tangy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 385, displayOrder: 10 },

  // --- PAGE 5: MAINS ---
  { name: 'HALF ROAST CHICKEN', categorySlug: 'mains', categoryName: 'Mains', description: 'Turkish style half roast chicken served with mash and vegetables', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 545, displayOrder: 1 },
  { name: 'RATATOUILLE WITH HERB RICE', categorySlug: 'mains', categoryName: 'Mains', description: 'Exotic vegetables in a fragrant tomato herb base served with Italian herb rice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 485, displayOrder: 2 },
  { name: 'PAN SEARED FISH', categorySlug: 'mains', categoryName: 'Mains', description: 'Pan seared fish with lemon butter sauce and mash potato', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 595, displayOrder: 3 },

  // --- PAGE 5: PASTA AND RISOTTO ---
  { name: 'PASTA PUTTANESCA', categorySlug: 'pasta-and-risotto', categoryName: 'Pasta And Risotto', description: 'Choice of pasta tossed in tomato sauce with olives, tomatoes, and parmesan cheese', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 415, vegPrice: 415, nonVegPrice: 435, displayOrder: 1 },
  { name: 'ALFREDO PASTA', categorySlug: 'pasta-and-risotto', categoryName: 'Pasta And Risotto', description: 'Choice of pasta penne spaghetti, macroni, with Velvety creamy bechemel sauce', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 445, vegPrice: 445, nonVegPrice: 475, displayOrder: 2 },
  { name: 'AGLIO, OLIO E PEPPERONCINO', categorySlug: 'pasta-and-risotto', categoryName: 'Pasta And Risotto', description: 'Olive oil, roast garlic chilli flakes and cheese', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 425, vegPrice: 425, nonVegPrice: 475, displayOrder: 3 },
  { name: 'PESTO SPAGHETTI', categorySlug: 'pasta-and-risotto', categoryName: 'Pasta And Risotto', description: 'Spaghetti cooked with basil pesto and parmesan Cheese', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 395, vegPrice: 395, nonVegPrice: 425, displayOrder: 4 },
  { name: 'MAC N CHEESE', categorySlug: 'pasta-and-risotto', categoryName: 'Pasta And Risotto', description: 'Macroni pasta with creamy cheese sauce and baked', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 335, vegPrice: 335, nonVegPrice: 375, displayOrder: 5 },
  { name: 'PASTA LASAGNE', categorySlug: 'pasta-and-risotto', categoryName: 'Pasta And Risotto', description: 'layered sheet pasta with creamy rich sauce and minced meat', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 485, displayOrder: 6 },
  { name: 'ROASTED GARLIC RISOTTO', categorySlug: 'pasta-and-risotto', categoryName: 'Pasta And Risotto', description: 'Arborio rice cooked with roast garlic sauce And white wine', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 485, vegPrice: 485, nonVegPrice: 515, displayOrder: 7 },

  // --- PAGE 5: ASIAN MAINS ---
  { name: 'THAI YELLOW CURRY WITH JASMIN RICE', categorySlug: 'asian-mains', categoryName: 'Asian Mains', description: 'Mild,earthy curry with turmeric and carrots. Comfortingly sweet savoury', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 345, vegPrice: 345, nonVegPrice: 375, displayOrder: 1 },
  { name: 'THAI RED CURRY WITH JASMINE RICE', categorySlug: 'asian-mains', categoryName: 'Asian Mains', description: 'Garden vegetable simmered with coconut milk And thai basil and thai chilli served with jasmine rice', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 345, vegPrice: 345, nonVegPrice: 375, displayOrder: 2 },
  { name: 'BURMESE KHAO SUEY', categorySlug: 'asian-mains', categoryName: 'Asian Mains', description: 'COCONUT CURRY NOODLE IN A BURMESE STYLE SERVED WITH CONDIMENTS', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 395, displayOrder: 3 },
  { name: 'Korean Raman Bowl', categorySlug: 'asian-mains', categoryName: 'Asian Mains', description: 'Spicy Ramen noodles in a bold Korean Chili broth,topped with vegetables, soft boilled egg,and scallions', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 325, displayOrder: 4 },

  // --- PAGE 6: INDIAN MAINS VEG ---
  { name: 'DAL FRY /TADKA', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Yellow lintel, finished with a tempering on cummin and garlic and ghee', dietary: 'veg', pricingType: 'PORTION', price: 215, variants: [{ id: 'v-fry', label: 'Dal Fry', price: 215 }, { id: 'v-tadka', label: 'Dal Tadka', price: 225 }], displayOrder: 1 },
  { name: 'PANNER BUTTER MASALA', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Velvetty tomato butter gravy, with soft panner', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 325, displayOrder: 2 },
  { name: 'VEG KOFTA', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Vegetable dumpling served in smooth spice gravy', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 305, displayOrder: 3 },
  { name: 'KADAI PANNER', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Char grilled panner cooked with tomato and gravy', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 305, displayOrder: 4 },
  { name: 'AMRITSARI ALOO', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Baby potato, cooked with Punjabi masala gravy', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 5 },
  { name: 'MUSHROOM GREEN PEAS MASALA', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Mushroom and green peas, with onion, tomato gravy', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 6 },
  { name: 'VEG KOLHAPURI', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Mixed vegetables, cooked with spicy kolhapuri masala', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 7 },
  { name: 'VEG DIWANI HANDI', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Exotic vegetable with spinach puree and onion gravy', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 305, displayOrder: 8 },
  { name: 'MALAI KOFTA-E-KHAS', categorySlug: 'indian-mains-veg', categoryName: 'Indian Mains Veg', description: 'Rich flavoured kofta served with cashew paste', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 375, displayOrder: 9 },

  // --- PAGE 6 & 7: INDIAN MAINS NON-VEG ---
  { name: 'BUTTER CHICKEN', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Roasted tandoori chicken, cooked with tomato Makhani gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 385, displayOrder: 1 },
  { name: 'KADAI CHICKEN', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Chicken cooked with onion masala gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 355, displayOrder: 2 },
  { name: 'CHICKEN HANDI', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Chicken cooked with Indian whole spices masala With spicy gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 355, displayOrder: 3 },
  { name: 'CHICKEN TIKKA MASALA', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Char grilled chicken tikka with Spicy tomato gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 385, displayOrder: 4 },
  { name: 'MALABARI CHICKEN CURRY', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Chicken cooked with coconut gravy with curry leaves', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 305, displayOrder: 5 },
  { name: 'CHICKEN CHETTINADU', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Chicken cooked with garam masala and spiced Onion gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 305, displayOrder: 6 },
  { name: 'KINGS CHICKEN NAWABI', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Rich flavoury chicken, cooked with creamy gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 385, displayOrder: 7 },
  { name: 'EGG CURRY CHETTINADU', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Egg curry with chettinadu gravy', dietary: 'egg', pricingType: 'SINGLE_PRICE', price: 275, displayOrder: 8 },
  { name: 'MURUG MUSALLAM (H/F)', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Char grilled tandoor chicken and minced chicken Served with basmati rice', dietary: 'non-veg', pricingType: 'PORTION', price: 595, variants: [{ id: 'v-half', label: 'Half', price: 595 }, { id: 'v-full', label: 'Full', price: 895 }], displayOrder: 9 },
  { name: 'CHICKEN KONDATTAM', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Kerala style chicken with coconut gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 355, displayOrder: 10 },
  { name: 'MUTTON ROGAN JOSH', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Kashmiri style mutton, with whole spices and masala', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 445, displayOrder: 11 },
  { name: 'MUTTON LAAL MAAS', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Traditionally Rajasthani style laal maas', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 455, displayOrder: 12 },
  { name: 'MUTTON KEEMA FRY', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Minced mutton cooked with Indian spices and Aromatic', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 425, displayOrder: 13 },
  { name: 'KADAI RARA GHOST', categorySlug: 'indian-mains-non-veg', categoryName: 'Indian Mains Non-veg', description: 'Minced mutton and curry cut mutton cooked With spicy tomato gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 495, displayOrder: 14 },

  // --- PAGE 7: NOODLE AND RICE ---
  { name: 'CLASSIC HAKKA NOODLE', categorySlug: 'noodle-and-rice', categoryName: 'Noodle And Rice', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 215, vegPrice: 215, nonVegPrice: 265, displayOrder: 1 },
  { name: 'CHILLI GARLIC NOODLE', categorySlug: 'noodle-and-rice', categoryName: 'Noodle And Rice', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 225, vegPrice: 225, nonVegPrice: 285, displayOrder: 2 },
  { name: 'TRIPLE NOODLE', categorySlug: 'noodle-and-rice', categoryName: 'Noodle And Rice', description: 'Rice and noodle mixed with schezwan and served with Hot chilli sauce gravy', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 365, displayOrder: 3 },
  { name: 'BURNT GARLIC FRIED RICE', categorySlug: 'noodle-and-rice', categoryName: 'Noodle And Rice', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 195, vegPrice: 195, nonVegPrice: 225, displayOrder: 4 },
  { name: 'SCHEWAN FRIED RICE', categorySlug: 'noodle-and-rice', categoryName: 'Noodle And Rice', description: 'Panko fried fish with mustard and lemon, served with tartar sauce', dietary: 'veg', pricingType: 'VEG_NON_VEG', price: 215, vegPrice: 215, nonVegPrice: 245, displayOrder: 5 },
  { name: 'NASI GORENG', categorySlug: 'noodle-and-rice', categoryName: 'Noodle And Rice', description: 'Rice served with Indo Chinese style sauce and shrimp cracker', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 395, displayOrder: 6 },

  // --- PAGE 8: ASSORTED BREADS ---
  { name: 'TANDOORI ROTI', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', dietary: 'veg', pricingType: 'PORTION', price: 35, variants: [{ id: 'v-plain', label: 'Plain Roti', price: 35 }, { id: 'v-butter', label: 'Butter Roti', price: 45 }], displayOrder: 1 },
  { name: 'NAAN', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', dietary: 'veg', pricingType: 'PORTION', price: 55, variants: [{ id: 'v-plain', label: 'Plain Naan', price: 55 }, { id: 'v-butter', label: 'Butter Naan', price: 65 }], displayOrder: 2 },
  { name: 'GARLIC NAAN', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', dietary: 'veg', pricingType: 'PORTION', price: 85, variants: [{ id: 'v-plain', label: 'Plain Garlic Naan', price: 85 }, { id: 'v-butter', label: 'Butter Garlic Naan', price: 95 }], displayOrder: 3 },
  { name: 'CHEESE GARLIC NAAN', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 125, displayOrder: 4 },
  { name: 'LACCHA PARATHA', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 65, displayOrder: 5 },
  { name: 'KULCHA', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', dietary: 'veg', pricingType: 'PORTION', price: 65, variants: [{ id: 'v-plain', label: 'Plain Kulcha', price: 65 }, { id: 'v-butter', label: 'Butter Kulcha', price: 75 }], displayOrder: 6 },
  { name: 'MISSI ROTI', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 55, displayOrder: 7 },
  { name: 'STUFFED KULCHA', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', description: 'ALOO, PANNER, MIX VEG', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 125, displayOrder: 8 },
  { name: 'KINGS SPECIAL MALABARI PAROTTA', categorySlug: 'assorted-breads', categoryName: 'Assorted Breads', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 30, displayOrder: 9 },

  // --- PAGE 8: SANDWICH N BURGER ---
  { name: 'CLASSIC GRILLED VEG SANDWICH', categorySlug: 'sandwich-n-burger', categoryName: 'Sandwich N Burger', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 1 },
  { name: 'FALAFAL BURGER', categorySlug: 'sandwich-n-burger', categoryName: 'Sandwich N Burger', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 265, displayOrder: 2 },
  { name: 'BBQ CHICKEN SANDWICH', categorySlug: 'sandwich-n-burger', categoryName: 'Sandwich N Burger', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 325, displayOrder: 3 },
  { name: 'CRISPY CHICKEN BURGER', categorySlug: 'sandwich-n-burger', categoryName: 'Sandwich N Burger', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 325, displayOrder: 4 },
  { name: 'BLT SANDWICH', categorySlug: 'sandwich-n-burger', categoryName: 'Sandwich N Burger', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 255, displayOrder: 5 },

  // --- PAGE 9: BIRIYANI AND MANDI ---
  { name: 'VEG BIRIYANI', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 205, displayOrder: 1 },
  { name: 'PANEER BIRIYANI', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 2 },
  { name: 'CHICKEN DARBAR BIRIYANI', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 220, displayOrder: 3 },
  { name: 'CHICKEN 65 BIRIYANI', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 4 },
  { name: 'PRAWNS BIRIYANI', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 315, displayOrder: 5 },
  { name: 'CHICKEN TIKKA BIRIYANI', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 305, displayOrder: 6 },
  { name: 'LOLLIPPO BIRIYANI', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 285, displayOrder: 7 },
  { name: 'MALAI BIRIYANI CHICKEN', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 305, displayOrder: 8 },
  { name: 'MUTTON ROYAL BIRIYANI', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 395, displayOrder: 9 },
  { name: 'KINGS TANDOORI MANDI (Q/H/F)', categorySlug: 'biriyani-and-mandi', categoryName: 'Biriyani And Mandi', dietary: 'non-veg', pricingType: 'PORTION', price: 335, variants: [{ id: 'v-quarter', label: 'Quarter', price: 335 }, { id: 'v-half', label: 'Half', price: 575 }, { id: 'v-full', label: 'Full', price: 895 }], displayOrder: 10 },

  // --- PAGE 9: RICE ---
  { name: 'PLAIN RICE', categorySlug: 'rice', categoryName: 'Rice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 120, displayOrder: 1 },
  { name: 'JEERA RICE', categorySlug: 'rice', categoryName: 'Rice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 2 },
  { name: 'BIRIYANI RICE', categorySlug: 'rice', categoryName: 'Rice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 165, displayOrder: 3 },
  { name: 'ONION PANEER RICE', categorySlug: 'rice', categoryName: 'Rice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 165, displayOrder: 4 },
  { name: 'GHEE RICE', categorySlug: 'rice', categoryName: 'Rice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 165, displayOrder: 5 },
  { name: 'KASHMIRI PULAO', categorySlug: 'rice', categoryName: 'Rice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 195, displayOrder: 6 },
  { name: 'VEG PULAO', categorySlug: 'rice', categoryName: 'Rice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 185, displayOrder: 7 },

  // --- PAGE 10: ADD-ON ---
  { name: 'CURD', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 35, displayOrder: 1 },
  { name: 'MIX VEG RAITA', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 75, displayOrder: 2 },
  { name: 'MASALA PAPPAD', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 65, displayOrder: 3 },
  { name: 'ROASTED / FRY PAPPAD', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 45, displayOrder: 4 },
  { name: 'PRAWNS', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 75, displayOrder: 5 },
  { name: 'EGG OMLETTE', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'egg', pricingType: 'SINGLE_PRICE', price: 85, displayOrder: 6 },
  { name: 'CHEESE CHICKEN OMLETTE', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'non-veg', pricingType: 'SINGLE_PRICE', price: 125, displayOrder: 7 },
  { name: 'SCRAMBLED EGG /EGG BURJI', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'egg', pricingType: 'SINGLE_PRICE', price: 115, displayOrder: 8 },
  { name: 'BOILED EGG', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'egg', pricingType: 'SINGLE_PRICE', price: 25, displayOrder: 9 },
  { name: 'BULLS EYE', categorySlug: 'add-on', categoryName: 'Add-on', dietary: 'egg', pricingType: 'SINGLE_PRICE', price: 35, displayOrder: 10 },

  // --- PAGE 10: DESSERT ---
  { name: 'TENDER COCONUT PUDDING', categorySlug: 'dessert', categoryName: 'Dessert', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 195, displayOrder: 1 },
  { name: 'SIZZILING BROWNIE', categorySlug: 'dessert', categoryName: 'Dessert', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 195, displayOrder: 2 },
  { name: 'MANGO CHEESE CAKE', categorySlug: 'dessert', categoryName: 'Dessert', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 195, displayOrder: 3 },
  { name: 'LOTUS BISCOFF CHEESE CAKE', categorySlug: 'dessert', categoryName: 'Dessert', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 245, displayOrder: 4 },
  { name: 'GULAB JAMUN WITH ICE CREAM', categorySlug: 'dessert', categoryName: 'Dessert', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 175, displayOrder: 5 },
  { name: 'ICE CREAM', categorySlug: 'dessert', categoryName: 'Dessert', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 120, displayOrder: 6 },

  // --- PAGE 11: JUICE ---
  { name: 'ORANGE', categorySlug: 'juice', categoryName: 'Juice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 125, displayOrder: 1 },
  { name: 'PINEAPPLE', categorySlug: 'juice', categoryName: 'Juice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 125, displayOrder: 2 },
  { name: 'WATERMELON JUICE', categorySlug: 'juice', categoryName: 'Juice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 125, displayOrder: 3 },
  { name: 'KINGS SPECIAL GINGER LIME', categorySlug: 'juice', categoryName: 'Juice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 75, displayOrder: 4 },
  { name: 'FRESH LIME', categorySlug: 'juice', categoryName: 'Juice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 75, displayOrder: 5 },
  { name: 'ABC JUICE', categorySlug: 'juice', categoryName: 'Juice', description: 'Apple, Beetroot & Carrot Juice', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 205, displayOrder: 6 },

  // --- PAGE 11: MILKSHAKE ---
  { name: 'STRAWBERRY MILKSHAKE', categorySlug: 'milkshake', categoryName: 'Milkshake', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 1 },
  { name: 'OREO MILK SHAKE', categorySlug: 'milkshake', categoryName: 'Milkshake', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 245, displayOrder: 2 },
  { name: 'CHOCO CHIP MILKSHAKE', categorySlug: 'milkshake', categoryName: 'Milkshake', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 245, displayOrder: 3 },
  { name: 'VANILA MILKSHAKE', categorySlug: 'milkshake', categoryName: 'Milkshake', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 245, displayOrder: 4 },
  { name: 'BUTTERSCOTCH MILKSHAKE', categorySlug: 'milkshake', categoryName: 'Milkshake', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 5 },

  // --- PAGE 11: FRAPPE ---
  { name: 'CLASSIC FRAPPE', categorySlug: 'frappe', categoryName: 'Frappe', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 1 },
  { name: 'CARAMEL FRAPPE', categorySlug: 'frappe', categoryName: 'Frappe', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 2 },
  { name: 'SPANISH FRAPPE', categorySlug: 'frappe', categoryName: 'Frappe', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 3 },
  { name: 'STRAWBERRY FRAPPE', categorySlug: 'frappe', categoryName: 'Frappe', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 225, displayOrder: 4 },
  { name: 'VANILA FRAPPE', categorySlug: 'frappe', categoryName: 'Frappe', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 215, displayOrder: 5 },

  // --- PAGE 11: BEVERAGE ---
  { name: 'CLASSIC MOJITO', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 1 },
  { name: 'PASSION FRUIT MOJITO', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 2 },
  { name: 'WATERMELON MOJITO', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 3 },
  { name: 'BLUE LAGON', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 4 },
  { name: 'ORANGE MOJITO', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 5 },
  { name: 'STRAWBERRY MOJITO', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 6 },
  { name: 'KIWI MOJITO', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 7 },
  { name: 'GREEN APPLE MOJITO', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 8 },
  { name: 'BLUEBERRY MOJITO', categorySlug: 'beverage', categoryName: 'Beverage', dietary: 'veg', pricingType: 'SINGLE_PRICE', price: 135, displayOrder: 9 },

  // --- PAGE 12: BUCKET BIRIYANI ---
  { name: 'FAMILY BIRIYANI CHICKEN - CHICKEN (4/6)', categorySlug: 'bucket-biriyani', categoryName: 'Bucket Biriyani', description: 'Royal chicken biryani bucket for family dining (4 to 6 persons)', dietary: 'non-veg', pricingType: 'PORTION', price: 845, variants: [{ id: 'v-4p', label: '4 Persons', price: 845 }, { id: 'v-6p', label: '6 Persons', price: 1295 }], displayOrder: 1 },
  { name: 'FAMILY BIRIYANI MUTTON - MUTTON (4/6)', categorySlug: 'bucket-biriyani', categoryName: 'Bucket Biriyani', description: 'Royal mutton biryani bucket for family dining (4 to 6 persons)', dietary: 'non-veg', pricingType: 'PORTION', price: 1565, variants: [{ id: 'v-4p', label: '4 Persons', price: 1565 }, { id: 'v-6p', label: '6 Persons', price: 2325 }], displayOrder: 2 },
];

// Helper slug generator
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Validation logic
export function validatePDFDataset() {
  console.log('===========================================================');
  console.log('KING\'S PLATTER PDF MENU DATASET VALIDATION');
  console.log('===========================================================');
  console.log(`Total Categories: ${PDF_CATEGORIES.length}`);
  console.log(`Total Food Items: ${PDF_FOOD_ITEMS.length}`);

  let vegCount = 0;
  let nonVegCount = 0;
  let eggCount = 0;
  let descCount = 0;
  let singlePriceCount = 0;
  let vegNonVegSplitCount = 0;
  let portionVariantsCount = 0;

  const categoryMap = new Map<string, number>();

  PDF_FOOD_ITEMS.forEach((item) => {
    if (item.dietary === 'veg') vegCount++;
    else if (item.dietary === 'non-veg') nonVegCount++;
    else if (item.dietary === 'egg') eggCount++;

    if (item.description) descCount++;

    if (item.pricingType === 'SINGLE_PRICE') singlePriceCount++;
    else if (item.pricingType === 'VEG_NON_VEG') vegNonVegSplitCount++;
    else if (item.pricingType === 'PORTION' || item.pricingType === 'CUSTOM_VARIANTS') portionVariantsCount++;

    categoryMap.set(item.categorySlug, (categoryMap.get(item.categorySlug) || 0) + 1);
  });

  console.log(`\nDietary Breakdown:`);
  console.log(`  - Vegetarian: ${vegCount}`);
  console.log(`  - Non-Vegetarian: ${nonVegCount}`);
  console.log(`  - Egg: ${eggCount}`);

  console.log(`\nPricing Models:`);
  console.log(`  - Single Price Items: ${singlePriceCount}`);
  console.log(`  - Veg/Non-Veg Dual Price Items: ${vegNonVegSplitCount}`);
  console.log(`  - Multi-Portion/Variant Items: ${portionVariantsCount}`);

  console.log(`\nDescriptions Provided: ${descCount} / ${PDF_FOOD_ITEMS.length}`);

  console.log(`\nItems per Category:`);
  PDF_CATEGORIES.forEach((cat) => {
    const count = categoryMap.get(cat.slug) || 0;
    console.log(`  - ${cat.name} (${cat.slug}): ${count} items`);
  });

  // Check for orphan items
  const validSlugs = new Set(PDF_CATEGORIES.map((c) => c.slug));
  const orphans = PDF_FOOD_ITEMS.filter((item) => !validSlugs.has(item.categorySlug));
  if (orphans.length > 0) {
    console.error(`\n❌ ERROR: Found ${orphans.length} items with invalid category slugs!`);
    orphans.forEach((o) => console.error(`   - ${o.name} -> ${o.categorySlug}`));
    return false;
  } else {
    console.log(`\n✅ Category Slug Validation PASSED (0 orphan items)`);
  }

  // Check for duplicates
  const nameSet = new Set<string>();
  const duplicates: string[] = [];
  PDF_FOOD_ITEMS.forEach((item) => {
    const key = `${item.categorySlug}:${item.name.toLowerCase()}`;
    if (nameSet.has(key)) duplicates.push(key);
    nameSet.add(key);
  });

  if (duplicates.length > 0) {
    console.warn(`\n⚠️ Warning: Found ${duplicates.length} duplicate dish names in same category:`);
    duplicates.forEach((d) => console.warn(`   - ${d}`));
  } else {
    console.log(`✅ Duplicate Item Validation PASSED (0 duplicate dishes in same category)`);
  }

  console.log('\n===========================================================');
  console.log('VALIDATION COMPLETED SUCCESSFULLY');
  console.log('===========================================================');
  return true;
}

// Helper to strip undefined values for Firestore SDK
export function cleanUndefined<T extends Record<string, any>>(obj: T): T {
  const result: Record<string, any> = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] !== undefined) {
      result[key] = obj[key];
    }
  });
  return result as T;
}

// Firestore import logic using Firebase Admin SDK
export async function importPDFDatasetToFirestore() {
  if (!validatePDFDataset()) {
    console.error('Validation failed. Aborting Firestore import.');
    process.exit(1);
  }

  // Dynamic import ensures dotenv environment variables are loaded FIRST before server.ts initializes Firebase Admin
  const { serverDb, hasAdminCredentials } = await import('../src/lib/firebase/server');

  if (!hasAdminCredentials()) {
    console.error('❌ Firebase Admin credentials missing or invalid in .env.local.');
    process.exit(1);
  }

  console.log('\nStarting Firestore import of King\'s Platter production menu via Firebase Admin SDK...');

  // 1. Import Categories
  const categoryIdMap = new Map<string, string>(); // slug -> categoryId

  console.log('\nUploading categories to Firestore...');
  for (const cat of PDF_CATEGORIES) {
    const docId = `cat-${cat.slug}`;
    categoryIdMap.set(cat.slug, docId);

    const categoryData = cleanUndefined({
      id: docId,
      name: cat.name,
      slug: cat.slug,
      iconName: cat.iconName,
      description: cat.description,
      defaultPricingType: cat.defaultPricingType,
      displayOrder: cat.displayOrder,
      isActive: cat.isActive,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    });

    await serverDb.collection('categories').doc(docId).set(categoryData, { merge: true });
    console.log(`  ✓ Saved Category: ${cat.name} (${docId})`);
  }

  // 2. Import Food Items in batches
  console.log('\nUploading food items to Firestore...');

  const foodBatches: PDFMenuItem[][] = [];
  for (let i = 0; i < PDF_FOOD_ITEMS.length; i += 30) {
    foodBatches.push(PDF_FOOD_ITEMS.slice(i, i + 30));
  }

  let importedFoodCount = 0;

  for (const batchItems of foodBatches) {
    const batch = serverDb.batch();
    for (const item of batchItems) {
      const categoryId = categoryIdMap.get(item.categorySlug) || `cat-${item.categorySlug}`;
      const foodSlug = slugify(item.name);
      const docId = `food-${item.categorySlug}-${foodSlug}`;

      const foodData = cleanUndefined({
        id: docId,
        categoryId,
        categoryName: item.categoryName,
        name: item.name,
        description: item.description || '',
        price: item.price,
        pricingType: item.pricingType,
        vegPrice: item.vegPrice,
        nonVegPrice: item.nonVegPrice,
        finalPrice: item.price,
        discountPercentage: 0,
        imageUrl: '',
        imageStorageKey: '',
        youtubeVideoId: null,
        youtubeVideoUrl: null,
        isAvailable: true,
        dietary: item.dietary,
        displayOrder: item.displayOrder,
        variants: item.variants,
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      const docRef = serverDb.collection('foodItems').doc(docId);
      batch.set(docRef, foodData, { merge: true });
      importedFoodCount++;
    }
    await batch.commit();

    console.log(`  ✓ Batch committed. (${importedFoodCount} / ${PDF_FOOD_ITEMS.length} food items)`);
  }

  console.log('\n===========================================================');
  console.log(`SUCCESSFULLY IMPORTED TO FIRESTORE:`);
  console.log(`  - ${PDF_CATEGORIES.length} Categories`);
  console.log(`  - ${importedFoodCount} Food Items`);
  console.log('===========================================================');
}

// Execution runner
if (process.argv.includes('--validate')) {
  validatePDFDataset();
} else if (process.argv.includes('--import')) {
  importPDFDatasetToFirestore().catch((err) => {
    console.error('Import failed:', err);
    process.exit(1);
  });
}
