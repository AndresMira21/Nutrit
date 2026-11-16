
export interface FoodCatalogItem {
  name: string;
  kcalPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}

// Valores nutricionales aproximados por 100 g.
// Pueden variar según marca, variedad y preparación.
// Pendiente contrastar cada alimento con su ficha
// nutricional de USDA FoodData Central o ICBF.

export const FOOD_CATALOG = [
  {
    name: 'Arepa de maíz asada',
    kcalPer100g: 162,
    proteinPer100g: 3.6,
    carbsPer100g: 33.5,
    fatPer100g: 1.5
  },
  {
    name: 'Arroz blanco cocido',
    kcalPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28.2,
    fatPer100g: 0.3
  },
  {
    name: 'Atún en agua escurrido',
    kcalPer100g: 86,
    proteinPer100g: 19.4,
    carbsPer100g: 0,
    fatPer100g: 0.9
  },
  {
    name: 'Avena cocida en agua',
    kcalPer100g: 71,
    proteinPer100g: 2.5,
    carbsPer100g: 12,
    fatPer100g: 1.5
  },
  {
    name: 'Banano',
    kcalPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatPer100g: 0.3
  },
  {
    name: 'Fríjoles negros cocidos',
    kcalPer100g: 132,
    proteinPer100g: 8.9,
    carbsPer100g: 23.7,
    fatPer100g: 0.5
  },
  {
    name: 'Huevo cocido',
    kcalPer100g: 155,
    proteinPer100g: 12.6,
    carbsPer100g: 1.1,
    fatPer100g: 10.6
  },
  {
    name: 'Leche entera',
    kcalPer100g: 61,
    proteinPer100g: 3.2,
    carbsPer100g: 4.8,
    fatPer100g: 3.3
  },
  {
    name: 'Lentejas cocidas',
    kcalPer100g: 116,
    proteinPer100g: 9,
    carbsPer100g: 20.1,
    fatPer100g: 0.4
  },
  {
    name: 'Manzana',
    kcalPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fatPer100g: 0.2
  },
  {
    name: 'Naranja',
    kcalPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 11.8,
    fatPer100g: 0.1
  },
  {
    name: 'Pan blanco',
    kcalPer100g: 266,
    proteinPer100g: 9,
    carbsPer100g: 49,
    fatPer100g: 3.2
  },
  {
    name: 'Papa al horno con cáscara',
    kcalPer100g: 93,
    proteinPer100g: 2.5,
    carbsPer100g: 21.2,
    fatPer100g: 0.1
  },
  {
    name: 'Pasta cocida',
    kcalPer100g: 158,
    proteinPer100g: 5.8,
    carbsPer100g: 30.9,
    fatPer100g: 0.9
  },
  {
    name: 'Pechuga de pollo asada sin piel',
    kcalPer100g: 165,
    proteinPer100g: 31,
    carbsPer100g: 0,
    fatPer100g: 3.6
  },
  {
    name: 'Tomate crudo',
    kcalPer100g: 18,
    proteinPer100g: 0.9,
    carbsPer100g: 3.9,
    fatPer100g: 0.2
  }
] as const satisfies readonly FoodCatalogItem[];
