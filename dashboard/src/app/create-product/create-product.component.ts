import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Component, Optional } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, from } from 'rxjs';

@Component({
  selector: 'app-create-product',
  templateUrl: './create-product.component.html',
  styleUrls: ['./create-product.component.css'],
})
export class CreateProductComponent {
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getHeaders();
    this.getProductCategories();
  }

  
  getHeaders(): HttpHeaders {
    const accessToken = localStorage.getItem('token');
    console.log(accessToken);
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${accessToken}`,
    });

    // Return the headers
    return headers;
  }
  
  getProductCategoriesURL =
  'https://the-pet-store-backend.vercel.app/api/admin/getProductCategories';
  
  productCategories: any[] = [];
  getProductCategories(): any {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    return this.http.get(this.getProductCategoriesURL, { headers }).subscribe(
      (data: any) => {
        this.productCategories = data;
        console.log('Product Categories:',this.productCategories );
      },
      (error) => {
        console.error('Error fetching product categories:', error);
      }
    );
  }

  product: any = {
    name: '',
    price: null,
    description: '',
    size: '',
    quantity: null,
    images: [],
    animal: '',
    categoryID: '',
    coupon: {
      code: '',
      discountPercentage: 0,
      expirationDate: Date.now(),
    },
  };

  createProduct(): any {
    const accessToken = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .post<any>(
        'https://the-pet-store-backend.vercel.app/api/admin/createProduct',
        this.product,
        { headers }
      )
      .subscribe({
        next: (data) => {
          console.log('Product Created INTO DB:', data.message);
          console.log('Product Details:', data.Product);
        },
        error: (error) => {
          console.error('Error creating product:', error);

          // Log the full error response
          if (error instanceof HttpErrorResponse) {
            console.error('Full error response:', error);
          }
        },
        complete: () => {
          this.router.navigate(['/products']);
        },
      });
  }

  onSubmit(e: Event, form: any) {
    e.preventDefault();
    this.product.images[0] = form.images.value;
    // this.product.image=['test']
    this.product.name = form.name.value;
    this.product.price = form.price.value;
    this.product.description = form.description.value;
    this.product.size = form.size.value;
    this.product.quantity = form.quantity.value;
    this.product.animal = form.animal.value;
    this.product.categoryID = form.categoryID.value;
    this.product.code = form.couponCode.value;
    this.product.discountPercentage = form.discountPercentage.value;
    this.product.coupon.code = this.product.code;
    this.product.expirationDate = form.expirationDate.value;
    console.log('Product Entered :', this.product);

    if (
      this.product.name === null ||
      this.product.name.trim() === '' ||
      this.product.price === null ||
      this.product.price.trim() === '' ||
      this.product.description === null ||
      this.product.description.trim() === '' ||
      this.product.size === null ||
      this.product.size.trim() === '' ||
      this.product.quantity === null ||
      this.product.quantity.trim() === '' ||
      this.product.animal === null ||
      this.product.animal.trim() === '' ||
      this.product.categoryID === null ||
      this.product.categoryID.trim() === ''
    ) {
      return alert('Enter All Required Fields !');
    } else {
      this.createProduct();
    }
  }

  // -------------------- Upload Image ------------------------
  // private imageUploadApiURL = 'https://the-pet-store-backend.vercel.app/api/user/uploadImage';
  
  private imageUploadApiURL = 'http://localhost:8080/api/user/uploadImage';

    onFileChange(event: any): void {
      const file = event.target.files[0];
  
      if (file) {
        console.log(file);
  
        this.http.post(this.imageUploadApiURL, file).subscribe(
          (response) => {
            console.log('Image uploaded successfully', response);
            // Handle success
          },
          (error) => {
            console.error('Error uploading image', error);
            // Handle error
          }
        );
      }
    }
 
}
