1. Create app : ng new pharmacy-pos
2. install bootstrap 5 and icons
    npm install bootstrap-icons
    npm install bootstrap

https://localhost:7083;http://localhost:5016


ng generate interface models/brand
ng generate interface models/category
ng generate interface models/product
ng generate interface models/cart-item
ng generate interface models/order

ng generate component components/product-list
ng generate component components/category-list
ng generate component components/brand-list
ng generate component components/cart
ng generate component components/payment

ng generate service services/api