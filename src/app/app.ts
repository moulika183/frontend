// src/app/app.ts
import { Component, signal } from '@angular/core';
import { ProductsComponent } from './products/products.component';
import { LoginComponent } from './login/login.component'; // ✅ Import your login component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductsComponent, LoginComponent], // ✅ Add it to imports
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = signal('simple-products-ui');
}
