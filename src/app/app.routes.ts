import { Routes } from '@angular/router';
import { ProductListComponent } from './components/product-list/product-list.component';
import { PaymentComponent } from './components/payment/payment.component';


export const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' }, 
  { path: 'products', component: ProductListComponent },              
  { path: 'payment', component: PaymentComponent },      
  { path: '**', redirectTo: 'products' }                
];