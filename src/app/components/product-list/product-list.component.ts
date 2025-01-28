import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ CommonModule,
    FormsModule,],
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
  currentDateTime: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
    this.updateCurrentDateTime();

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

}
