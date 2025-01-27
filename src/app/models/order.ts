import { CartItem } from './cart-item';

export interface Order {
  items: CartItem[];
  total: number;
  discount: number;
  vat: number;
  paymentMethod: string;
  paidAmount: number;
  returnAmount: number;
  dueAmount: number;
}