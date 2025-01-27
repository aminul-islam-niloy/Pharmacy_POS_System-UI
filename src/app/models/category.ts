import { Product } from './product';

export interface Category {
  id: number;
  name: string;
  brandId: number;
  products?: Product[];
}