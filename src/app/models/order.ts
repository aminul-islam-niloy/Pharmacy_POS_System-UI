import { CartItem } from './cart-item';

export interface Order {
  id?: number; 
  items: CartItem[];
  orderDate: Date;
  totalAmount: number;
  discount: number;
  vat: number;
  paymentMethod: string;
  paidAmount: number;
  changeAmount: number;
}