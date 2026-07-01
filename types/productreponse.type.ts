import { Product } from './searchresult.type';

export type ProductResponse = {
  code: string;
  product: Product;
  status: number;
  status_verbose: string;
};
