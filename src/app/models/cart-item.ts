export interface CartItem {
    productId: number;
    productName: string;
    quantity: number;
    price: number;
    discount: number;
    vat: number;
    subTotal: number;
  }