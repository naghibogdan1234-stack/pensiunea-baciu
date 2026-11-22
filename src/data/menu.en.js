// Meniul în engleză. Prețurile, gramajele și ordinea vin din menu.js; aici stau doar denumirile și ingredientele.
import { MENU as RO_MENU, PAGES as RO_PAGES } from './menu.js'

// pentru fiecare capitol: [titlu, [[denumire, ingrediente?], ...]], în aceeași ordine ca în menu.js
const T = {
  micDejun: ['Breakfast', [
    ['Plain omelette', 'Eggs'],
    ['Cheese omelette', 'Eggs, cheese'],
    ['Ham and cheese omelette', 'Eggs, ham, cheese'],
    ['Mushroom omelette', 'Eggs, mushrooms'],
    ['Boiled eggs'],
    ['Fried eggs'],
    ['Breaded cheese', 'Cheese, egg, breadcrumbs'],
    ['Breakfast platter', '2 fried eggs, salami, ham, cheese, pork ear, vegetables, olives'],
    ['English breakfast', '2 fried eggs, ham, telemea cheese, sausages, chips, mushrooms, tomatoes'],
  ]],
  laMicDejun: ['On the side, at breakfast', [
    ['Frankfurters'], ['Eggy bread'], ['Pressed ham'], ['Smoked pork loin'], ['Salami'], ['Transylvanian bacon'],
    ['Cheese'], ['Telemea cheese'], ['Zacuscă (vegetable spread)'], ['Butter'], ['Jam'],
  ]],
  diverse: ['Extras', [['Bread'], ['Toast'], ['Chilli pepper'], ['Olives'], ['Sweetcorn']]],
  ciorbe: ['Sour soups', [
    ['Transylvanian soup', 'Smoked ham hock, rice, sour cream, tarragon'],
    ['Tripe soup', 'Beef tripe, egg, sour cream, garlic, vegetables. With sour cream, garlic sauce and chilli'],
    ['Rădăuți chicken soup', 'Chicken breast, egg, sour cream, garlic, vegetables. With sour cream, garlic sauce and chilli'],
    ['Meatball soup', 'Pork, rice, vegetables, sour cream, egg'],
    ['Beef soup', 'Beef, vegetables'],
    ['Vegetable soup', 'Vegetables'],
    ['Cream of vegetable soup', 'Vegetables, croutons'],
  ]],
  specialitati1: ['House specials', [
    ['Chicken breast in mushroom sauce with crisps', 'Chicken breast, cheese, sour cream, mushrooms, potatoes'],
    ['Chicken breast in a cheese and parmesan crust, with chips', 'Chicken breast, cheese, egg, parmesan, potatoes'],
    ['Sweet and sour chicken with pineapple and vegetable rice', 'Chicken breast, pineapple, rice'],
    ['Chicken wings with chips'],
    ['Chicken paprikash with polenta'],
    ['Pork wing with golden potatoes', 'Pork, potatoes, chilli jam'],
    ['Pork knuckle with crisps', 'Boned pork knuckle, potatoes, garlic sauce'],
    ['Beans with smoked ham hock'],
  ]],
  specialitati2: ['House specials', [
    ['Goulash', 'Pork, sausages, potatoes'],
    ['The chef’s schnitzel with chips', 'Pork chop, ham, cheese, egg, garlic, potatoes, parmesan'],
    ['Pork neck with pepper sauce and mashed potatoes'],
    ['Pork chop “à la Mátrai”', 'Pork chop, sour cream, cheese, potatoes'],
    ['Pork ribs with golden potatoes', 'Pork, potatoes, barbecue sauce'],
    ['Moldavian tochitură (pork stew)', 'Pork, sausage, polenta, sheep’s cheese, egg'],
    ['Polenta with cottage cheese and sour cream'],
    ['Layered polenta', 'Polenta, sheep’s cheese, smoked ham hock, sour cream'],
  ]],
  platou: ['To share', [
    ['House platter', '2 mititei, boned chicken thigh, pork neck, boned knuckle, golden potatoes, fried bacon, sausages, mixed pickles, mustard'],
  ]],
  pui: ['Chicken', [
    ['Crispy chicken meal', 'Chicken breast, egg, cornflakes, chips, sauces'],
    ['Chicken cordon bleu', 'Chicken breast, ham, cheese'],
    ['Breaded chicken schnitzel', 'Chicken breast, egg, flour, breadcrumbs'],
    ['Chicken schnitzel in egg batter', 'Chicken breast, egg, flour'],
    ['Chicken escalope', 'Chicken breast, sour cream, mushrooms'],
    ['Boned chicken thigh'],
    ['Grilled chicken breast'],
    ['Chicken livers with onion and peppers'],
    ['Fried chicken livers'],
  ]],
  porc: ['Pork', [
    ['Hamburger meal', 'Pork, bacon, cheddar, caramelised onion, gherkins, tomato, lettuce, chips, sauces'],
    ['Pork cordon bleu', 'Pork chop, ham, cheese'],
    ['Breaded pork schnitzel', 'Pork chop, egg, flour, breadcrumbs'],
    ['Pork schnitzel in egg batter', 'Pork chop, egg, flour'],
    ['Pork escalope with mushrooms', 'Pork chop, sour cream, mushrooms'],
    ['Pork neck'],
    ['Pork chop'],
    ['Mititei (grilled skinless sausages)'],
  ]],
  peste: ['Fish', [
    ['Trout fried in a cornmeal crust'],
    ['Baked trout'],
    ['Pike-perch in an almond crust'],
    ['Baked pike-perch'],
    ['Baked salmon'],
  ]],
  garnituri: ['Sides', [
    ['Chips'], ['Crisps'], ['Golden potatoes'], ['Country potatoes'], ['Rosemary roast potatoes'], ['Potato gratin'],
    ['Mashed potatoes'], ['Mashed peas'], ['Roast vegetables'], ['Vegetable rice'], ['Baked mushrooms'],
    ['Mexican vegetables'], ['Polenta'],
  ]],
  salate: ['Salads', [
    ['House salad', 'Chicken breast, tomatoes, cucumber, cabbage, ham, cheese, mayonnaise, chips'],
    ['Bulgarian salad', 'Pressed ham, telemea cheese, egg, tomatoes, cucumber, cabbage, bell pepper, olives'],
    ['Caesar salad', 'Chicken breast, lettuce, cherry tomatoes, croutons, tartare sauce'],
    ['Mixed salad', 'Tomatoes, cucumber, onion, peppers'],
    ['Tomato and cucumber salad'],
    ['Fresh cabbage salad'],
    ['Mixed pickles'],
    ['Pickled cucumbers'],
    ['Pickled red peppers'],
    ['Pickled green tomatoes'],
    ['Roasted pepper salad'],
    ['Beetroot salad'],
    ['Onion salad'],
  ]],
  pizza: ['Pizza', [
    ['House pizza', 'Salami, cabanos, bacon, mozzarella, onion, sweetcorn, olives'],
    ['Pizza Quattro Stagioni', 'Ham, mushrooms, basil, mozzarella, olives, peppers'],
    ['Pizza Quattro Formaggi', 'Mozzarella, cheese, sheep’s cheese, parmesan'],
    ['Pizza Diavola', 'Mozzarella, ham, salami, parmesan, chilli, bell pepper'],
    ['Pizza Margherita', 'Mozzarella, tomatoes, basil'],
  ]],
  paste: ['Pasta', [
    ['Spaghetti carbonara', 'Guanciale, egg, parmesan'],
    ['Spaghetti al pomodoro', 'Tomatoes, garlic, basil, parmesan'],
    ['Spaghetti milanese', 'Ham, mushrooms, tomatoes, parmesan'],
    ['Penne with chicken and mushrooms', 'Chicken breast, mushrooms, cream, parmesan'],
    ['Penne with pesto and halloumi'],
  ]],
  deserturi: ['Desserts', [
    ['Papanași (fried cheese doughnuts)'],
    ['Pancakes with jam'],
    ['Pancakes with Nutella'],
    ['Pancakes with ice cream'],
    ['Pancakes with Nutella and ice cream'],
    ['Banana split'],
    ['Plum dumplings'],
    ['Seasonal fruit salad'],
    ['Peach Melba'],
    ['Magnum ice cream'],
    ['Betty ice cream'],
  ]],
  sosuri: ['Sauces', [
    ['Sweet ketchup'], ['Hot ketchup'], ['Mustard'], ['Mayonnaise'], ['Sour cream'], ['Mujdei (garlic sauce)'],
    ['Garlic sauce'], ['Barbecue sauce'], ['Tartare sauce'], ['Chilli jam'], ['Fresh apple sauce'],
  ]],
  cafea: ['Coffee and tea', [
    ['Espresso'], ['Decaf coffee'], ['Cappuccino'], ['Decaf cappuccino'], ['Latte macchiato'], ['Frappé'],
    ['Hot chocolate with whipped cream'], ['Cocoa milk'], ['Milk'],
    ['Julius organic tea', 'Forest fruits, cherry, ginger and lemon, mint, camomile, mountain herbs'],
    ['Honey'],
  ]],
  racoritoare: ['Soft drinks', [
    ['Coca-Cola, Fanta, Sprite'], ['Coca-Cola'], ['Schweppes'], ['Fuzetea'], ['Aloe vera'], ['Cappy Pulpy'],
    ['Santal'], ['Prigat'], ['Ilifruct'], ['Fresh orange juice'], ['Lemonade'], ['Fruit smoothie'],
    ['Still or sparkling water'], ['Still or sparkling water'],
  ]],
  bere: ['Beer', [
    ['Csíki Sör', 'Blonde, dark, IPA, unfiltered, raspberry'],
    ['Harghita'], ['Ciuc Premium'], ['Ciuc Radler, alcohol-free'], ['Nenea Iancu, unfiltered'],
    ['Paulaner, unfiltered'], ['Beck’s'], ['Birra Moretti'], ['Corona'], ['Heineken, regular or alcohol-free'],
    ['Ursus', 'Premium, dark, unfiltered, alcohol-free, Cooler'],
    ['Staropramen'], ['Strongbow'], ['Stella Artois, regular or alcohol-free'],
  ]],
  vinuri: ['Wine', [
    ['Purcari', 'Rară Neagră dry, rosé dry, Viorica dry'],
    ['Hermeziu “Te ispitește”', 'Fetească Neagră dry, Fetească Neagră rosé medium-dry, Fetească Regală medium-dry'],
    ['Individo', 'Rară Neagră dry, Cabernet Sauvignon–Merlot rosé dry, Fetească Regală–Riesling dry'],
    ['Glamour', 'Fetească Neagră medium-dry, Merlot rosé medium-dry, Sauvignon Blanc medium-dry'],
    ['Prosecco Inspiro'], ['Angelli sparkling wine'], ['Hermeziu house wine'], ['Mulled wine'],
  ]],
  lichior: ['Liqueur', [['Bilberry or sour-cherry liqueur'], ['Sour-cherry liqueur'], ['Baileys'], ['Sheridan’s']]],
  ginRom: ['Gin, tequila, rum', [
    ['Bombay Sapphire'], ['Camino'], ['Bumbu'], ['Havana Club 3 | 7 years'], ['Stroh 40 | 80'], ['Jägermeister'], ['Unicum'],
  ]],
  coniac: ['Brandy', [['Alexandrion 5* | 7*'], ['Metaxa 5* | 7*'], ['Kvint 8 | 10 years'], ['Jidvei']]],
  vodca: ['Vodka and pálinka', [
    ['Absolut'], ['Finlandia'], ['Ștefan cel Mare'], ['Voronskaya Bio'], ['Plum țuică'],
    ['Ungheni fruit brandy', 'Plum, quince, pear, apricot'],
  ]],
  whisky: ['Whisky', [['Jack Daniel’s Old No. 7 | Honey'], ['Teacher’s']]],
  cocktails: ['Cocktails', [
    ['Aperol Spritz'], ['Cuba Libre'], ['Gin Tonic'], ['Hugo'], ['Mojito'], ['Negroni'], ['Sex on the Beach'],
    ['Tequila Sunrise'], ['Alcohol-free Piña Colada'], ['Alcohol-free Cherry Cocktail'],
  ]],
}

// gramajele care au cuvinte de tradus
const G = { '1 bucată': '1 piece', '2 ouă': '2 eggs', plic: 'sachet' }

export const MENU = Object.fromEntries(
  Object.entries(RO_MENU).map(([k, sec]) => {
    const [title, rows] = T[k]
    return [
      k,
      {
        ...sec,
        title,
        items: sec.items.map((it, i) => {
          const [name, desc] = rows[i] || [it.name, it.desc]
          return { ...it, name, desc: it.desc ? desc || it.desc : undefined, weight: it.weight ? G[it.weight] || it.weight : it.weight }
        }),
      },
    ]
  }),
)

// titlurile de capitol din cuprins
const CH = {
  'Mic dejun': 'Breakfast',
  Ciorbe: 'Sour soups',
  Specialități: 'House specials',
  'Pui și porc': 'Chicken and pork',
  'Garnituri și salate': 'Sides and salads',
  'Pizza și paste': 'Pizza and pasta',
  Deserturi: 'Desserts',
  'Cafea și răcoritoare': 'Coffee and soft drinks',
  'Bere și vin': 'Beer and wine',
  Spirtoase: 'Spirits',
  Cocktailuri: 'Cocktails',
}
export const PAGES = RO_PAGES.map((p) => (p.chapter ? { ...p, chapter: CH[p.chapter] || p.chapter } : p))
