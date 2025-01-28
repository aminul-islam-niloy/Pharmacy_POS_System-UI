import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
//import bootstrap from '../../../main.server';
import * as bootstrap from 'bootstrap';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ CommonModule,
    FormsModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';
  selectedBrandName: string = 'All Brands';
  cartItems: any[] = [];
  currentDateTime: string = '';

  filteredCartItems: any[] = [];
  cartSearchText: string = '';

  subtotal: number = 0;
  vat: number = 0;
  total: number = 0;

  newProduct = {
    name: '',
    categoryId: null,
    price: null,
    stockQuantity: null,
    barcode: '',
    generic: '',
    imageUrl: '',
  };
  showModal: boolean = false;
  

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
    this.updateCurrentDateTime();
    this.loadCart();
    setInterval(() => {
      this.updateCurrentDateTime();
    }, 1000);
  }

  fetchData(): void {
    this.apiService.getProducts().subscribe((data) => {
      this.products = data;
      this.filteredProducts = data;
    });

    this.apiService.getCategories().subscribe((data) => {
      this.categories = data;
    });

    this.apiService.getProducts().subscribe((data) => (this.products = data));
    this.apiService.getCategories().subscribe((data) => (this.categories = data));

    this.apiService.getBrands().subscribe((data) => {
      this.brands = data;

      this.brands.forEach((brand) => {
        brand.count = this.products.filter(
          (product) =>
            this.categories.find(
              (category) =>
                category.brandId === brand.id && category.id === product.categoryId
            )
        ).length;
      });
    });
  }


  filterByCategory(categoryId: number): void {
    this.filteredProducts = this.products.filter(
      (product) => product.categoryId === categoryId
    );
  }



  filterByBrand(brandId: number | null): void {
    if (brandId === null) {
      this.selectedBrandName = 'All Brands';
      this.filteredProducts = [...this.products];
    } else {
      const selectedBrand = this.brands.find((brand) => brand.id === brandId);
      this.selectedBrandName = selectedBrand ? selectedBrand.name : 'All Brands';
  
      this.filteredProducts = this.products.filter((product) =>
        this.categories.some(
          (category) =>
            category.brandId === brandId && category.id === product.categoryId
        )
      );
    }
  }
  
  searchProduct(): void {
    const searchLower = this.searchText.toLowerCase();
    this.filteredProducts = this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(searchLower) ||
        product.generic?.toLowerCase().includes(searchLower) ||
        product.barcode?.toLowerCase().includes(searchLower)
    );
  }

  updateCurrentDateTime(): void {
    const now = new Date();
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true, 
    };

    this.currentDateTime = new Intl.DateTimeFormat('en-US', options).format(now);
  }

  loadCart(): void {
    this.apiService.getCartItems().subscribe((cart) => {
      this.cartItems = cart || [];
    });
  }

  addToCart(product: any): void {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      subTotal: product.price,
    };

    this.apiService.addToCart(cartItem).subscribe((cart) => {
      this.cartItems = cart;
      alert(`${product.name} added to cart!`);
    });
  }

  // removeFromCart(productId: number): void {
  //   this.apiService.removeFromCart(productId).subscribe((cart) => {
  //     this.cartItems = cart;
  //   });
  // }

  filterCart(): void {
    const searchLower = this.cartSearchText.toLowerCase();
    this.filteredCartItems = this.cartItems.filter(
      (item) => item.name.toLowerCase().includes(searchLower)
    );
  }

  increaseQty(item: any): void {
    item.quantity += 1;
    item.subTotal = item.quantity * item.price;
    this.updateCart();
  }

  decreaseQty(item: any): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      item.subTotal = item.quantity * item.price;
      this.updateCart();
    } else {
      this.removeFromCart(item.productId);
    }
  }

  removeFromCart(productId: number): void {
    this.apiService.removeFromCart(productId).subscribe((cart) => {
      this.cartItems = cart;
      this.filteredCartItems = [...this.cartItems];
      this.calculateTotals();
    });
  }

  updateCart(): void {
    this.apiService.addToCart(this.cartItems).subscribe(() => {
      this.calculateTotals();
    });
  }

  calculateTotals(): void {
    this.subtotal = this.cartItems.reduce((acc, item) => acc + item.subTotal, 0);
    this.vat = this.subtotal * 0.05;
    this.total = this.subtotal + this.vat;
  }

  proceedToPayment(): void {
    alert('Proceeding to payment...');
  }


  openAddProductModal(): void {
    this.showModal = true; // Show modal
  }

  closeAddProductModal(): void {
    this.showModal = false; // Hide modal
    this.resetForm();
  }

  addProduct(form: any): void {
    if (form.valid) {
      this.apiService.addProduct(this.newProduct).subscribe(() => {
        console.log('Product added successfully');
        this.fetchData();
        this.closeAddProductModal();
      }, (error) => {
        console.error('Error adding product:', error);
      });
    }
  }

  resetForm(): void {
    this.newProduct = {
      name: '',
      categoryId: null,
      price: null,
      stockQuantity: null,
      barcode: '',
      generic: '',
      imageUrl: '',
    };
  }

}
