/** Réponse de GET /api/v2/search */
export type SearchResult = {
    count: number;
    page: number;
    page_count: number;
    page_size: number;
    skip: number;
    products: Product[];
  };
  
  export type NutriscoreGrade = 'a' | 'b' | 'c' | 'd' | 'e' | 'unknown' | 'not-applicable';
  
  export type Product = {
    code: string;
    product_name: string;
    brands?: string;
    image_url?: string;
    image_front_url?: string;
    image_small_url?: string;
    image_thumb_url?: string;
    nutriscore_grade?: NutriscoreGrade;
    categories?: string;
    quantity?: string;
    ingredients_text?: string;
    url?: string;
    nutriments?: Nutriments;
  };
  
  export type Nutriments = {
    'energy-kcal_100g'?: number;
    'energy-kcal_value'?: number;
    fat_100g?: number;
    'saturated-fat_100g'?: number;
    carbohydrates_100g?: number;
    sugars_100g?: number;
    proteins_100g?: number;
    salt_100g?: number;
    fiber_100g?: number;
  };