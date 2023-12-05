import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent {
  products: any[] = [];

  // constructor(private http: HttpClient) {}
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef, private location: Location , private router: Router) {}

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchCategories();
  }

  // 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

  
  fetchProducts(): void {
    const headers = this.getHeaders(); 
    this.http
      .get<any>(
        'https://the-pet-store-backend.vercel.app/api/admin/getAllProducts',{headers}
      )
      .subscribe(
        (data) => {
          // console.log('API Response:', data);
          this.products = data.Products;
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
    return headers;
  }

  deleteProductURL: string =
    'https://the-pet-store-backend.vercel.app/api/admin/deleteProduct';

  deleteProduct(productId: any): any {
    if (confirm('Are you sure you want to delete this product?')) {
      console.log('getting headers');
      const url = `${this.deleteProductURL}/${productId}`;
      console.log('Deleting : ', productId, 'URL', url);
  
      const headers = this.getHeaders(); // Retrieve headers
      return this.http.delete(url, { headers }).subscribe(
        (response) => {
          alert('Product Deleted Successfully !')
          window.location.reload();
          return;
        },
        (error) => {
          alert("Error Deleting Product");
          window.location.reload();
        }
      );
    }
  }

  redirectToCreatePage(){
    this.router.navigate(['/create-product']);
  }


  redirectToEditPage(productId: string) {
    this.router.navigate(['/update-product', productId]);
  }


  productCategories: any[] = [];


  fetchCategories(): void {
    const headers = this.getHeaders(); 
    this.http
      .get<any>(
        'https://the-pet-store-backend.vercel.app/api/admin/getProductCategories',{headers}
      )
      .subscribe(
        (data) => {
          this.productCategories=data;
          console.log('API cateories:', this.productCategories);
          this.cdr.detectChanges();
        },
        (error) => {
          console.error('Error fetching data:', error);
        }
      );
  }


  deleteCategoryURL="https://the-pet-store-backend.vercel.app/api/admin/deleteCategory"
  deleteCategory(val:any):any{
    console.log(val)
    if (confirm('Are you sure you want to delete this Category?')) {
      console.log('getting headers');
      const url = `${this.deleteCategoryURL}/${val}`;
      console.log('Deleting : ', val, 'URL', url);
  
      const headers = this.getHeaders(); // Retrieve headers
      return this.http.delete(url, { headers }).subscribe(
        (response) => {
          alert('Category Deleted Successfully !')
          window.location.reload();
          return;
        },
        (error) => {
          alert("Error Deleting Category");
          window.location.reload();
        }
      );
    }

  }

  redirectToCreateCategoryPage(){
    this.router.navigate(['/create-category']); 
  }
}
