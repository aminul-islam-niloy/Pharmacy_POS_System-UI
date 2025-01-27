import { Component, OnInit, importProvidersFrom } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';


import {ElementRef, inject, ViewChild,} from '@angular/core';
import {FormBuilder,FormGroup,ReactiveFormsModule,Validators,} from '@angular/forms';


@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {
  products: any[] = [];
  categories: any[] = [];
  brands: any[] = [];
  filteredProducts: any[] = [];
  searchText: string = '';

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.fetchData();
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
    });
  }

  filterByCategory(categoryId: number): void {
    this.filteredProducts = this.products.filter(
      (product) => product.categoryId === categoryId
    );
  }

  filterByBrand(brandId: number): void {
    this.filteredProducts = this.products.filter(
      (product) =>
        this.categories.find(
          (category) => category.brandId === brandId && category.id === product.categoryId
        )
    );
  }

  searchProduct(): void {
    this.filteredProducts = this.products.filter((product) =>
      product.name.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }
}
