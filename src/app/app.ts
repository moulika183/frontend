// src/app/app.component.ts
import { Component, signal } from '@angular/core';
import { ProductsComponent } from './products/products.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ProductsComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  title = signal('simple-products-ui');
}
