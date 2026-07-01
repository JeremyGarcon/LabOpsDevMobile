export type ProductInfo = {
    code: number;
    products: Product[];
    status: number;
    status_verbose: string;
};
  
export type NutriscoreData = {
    component?: Component;
    count_proteins: number;
    count_proteins_reason: string;
    grade: string;
    is_beverage: number;
    is_cheese: number;
    is_fat_oil_nuts_seeds: number;
    is_red_meat_product: number;
    is_water: number;
    negative_points: number;
    negative_points_max: number;
    positive_nutrients: string[];
    positive_points: number;
    positive_points_max: number;
    score: number;
};

export type Component = {
    negative?: Negative;
    positive?: Positive;
};

export type Negative = {
    id: string;
    points: number;
    points_max: number;
    unit: string;
    value: number;
};
  
export type Positive = {
    id: string;
    points: number;
    points_max: number;
    unit: string;
    value: number;
};
  
export type Product = {
    nutriscore_data?: NutriscoreData;
    product_name: string;
};
  