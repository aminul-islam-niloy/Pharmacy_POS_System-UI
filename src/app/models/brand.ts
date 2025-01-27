import { Category } from './category';
export interface Brand {
  id: number;
  name: string;
  categories?: Category[];
}
