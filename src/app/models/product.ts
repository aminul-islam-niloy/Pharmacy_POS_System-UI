export interface Product {
    id: number;
    name: string;
    price: number;
    barcode: string;
    generic: string;
    discount: number;
    vat: number;
    imageUrl: string;
    stockQuantity: number;
    categoryId: number;
  }