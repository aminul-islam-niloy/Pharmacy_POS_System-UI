import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartKey = 'shoppingCart';

  private cartItems = new BehaviorSubject<{ 
    cart: any[], 
    subtotal: number, 
    discount: number, 
    vat: number, 
    total: number 
  }>({
    cart: this.getCartFromStorage(), 
    subtotal: 0,
    discount: 0,
    vat: 0,
    total: 0
  });

  cartItems$ = this.cartItems.asObservable();

  constructor() {
    this.loadInitialCart();
  }

  private getCartFromStorage(): any[] {
    const cart = localStorage.getItem(this.cartKey);
    return cart ? JSON.parse(cart) : [];
  }

  public getCart(): any[] { 
    return this.getCartFromStorage();
  }

  private loadInitialCart() {
    const cart = this.getCartFromStorage();
    this.updateLocalStorage(cart);
  }

  addToCart(product: any): void {
    let cart = this.getCartFromStorage();
    const existingItem = cart.find((item) => item.productId === product.id);

    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ 
        productId: product.id, 
        productName: product.name, 
        price: product.price, 
        quantity: 1, 
        discount: product.discount || 0, 
        vat: product.vat || 0 
      });
    }

    this.updateLocalStorage(cart);
  }

  removeFromCart(productId: number): void {
    let cart = this.getCartFromStorage().filter((item) => item.productId !== productId);
    this.updateLocalStorage(cart);
  }

  updateQuantity(productId: number, quantity: number): void {
    let cart = this.getCartFromStorage();
    const item = cart.find((item) => item.productId === productId);
    if (item) {
      item.quantity = quantity;
    }
    this.updateLocalStorage(cart);
  }

  clearCart(): void {
    this.updateLocalStorage([]);
  }

  private updateLocalStorage(cart: any[]) {
    const totals = this.calculateCartTotals(cart);
    localStorage.setItem(this.cartKey, JSON.stringify(cart));
    this.cartItems.next({ cart, ...totals });
  }

  public calculateCartTotals(cart: any[]): { subtotal: number, discount: number, vat: number, total: number } {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = cart.reduce((sum, item) => sum + (item.discount * item.quantity), 0);
    // const vat = subtotal * 0.15;
    const vat = cart.reduce((sum, item) => sum + ((item.vat / 100) * item.price * item.quantity), 0);

    const total = subtotal - discount + vat;
    
    return { subtotal, discount, vat, total };
  }
}
