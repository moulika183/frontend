import { Component } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './products.component.html'
})
export class ProductsComponent {
  apiUrl = 'https://demoappservice-c7cjgvf6fdd4hpdv.westus-01.azurewebsites.net/api/Product';  // adjust port if needed
  name = '';
  products: { id: number; name: string }[] = [];
  message = '';

  constructor(private http: HttpClient) {}

  addProduct() {
    this.message = '';
    if (!this.name.trim()) {
      this.message = 'Name is required.';
      return;
    }
    this.http.post(this.apiUrl, { name: this.name }).subscribe({
      next: () => {
        this.message = 'Successfully added!';
        this.name = '';
      },
      error: () => {
        this.message = 'Add failed.';
      }
    });
  }

  getProducts() {
    this.http.get<{ id: number; name: string }[]>(this.apiUrl).subscribe({
      next: data => {
        this.products = data;
        this.message = '';
      },
      error: () => {
        this.message = 'Load failed.';
      }
    });
  }
}
