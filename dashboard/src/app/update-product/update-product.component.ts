import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Data } from '@angular/router';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.css'],
})
export class UpdateProductComponent {
  constructor(private http: HttpClient, private route: ActivatedRoute) {}
  productId = '';

  ngOnInit() {
    console.log('Update Product');
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      this.productId = productId;
      this.getProductValues();
      this.getProductCategories()
      // Now you have access to the product ID, you can fetch the corresponding product data for editing
      // Fetch data or perform necessary operations using this productId
    });
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

  productObject:any={
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
  }
  onSubmit(e: Event, form: any) {
    e.preventDefault();
    this.productObject.images[0] = form.images.value;
    this.productObject.name = form.name.value;
    this.productObject.price = form.price.value;
    this.productObject.description = form.description.value;
    this.productObject.size = form.size.value;
    this.productObject.quantity = form.quantity.value;
    this.productObject.animal = form.animal.value;
    this.productObject.categoryID = form.categoryID.value;
    this.productObject.code = form.couponCode.value;
    this.productObject.discountPercentage = form.discountPercentage.value;
    this.productObject.coupon.code = this.productObject.code;
    this.productObject.expirationDate = form.expirationDate.value;
    console.log('ProductObject Entered :', this.productObject);

    if (
      this.productObject.name === null ||
      this.productObject.name.trim() === '' ||
      this.productObject.price === null ||
      this.productObject.price.trim() === '' ||
      this.productObject.description === null ||
      this.productObject.description.trim() === '' ||
      this.productObject.size === null ||
      this.productObject.size.trim() === '' ||
      this.productObject.quantity === null ||
      this.productObject.quantity.trim() === '' ||
      this.productObject.animal === null ||
      this.productObject.animal.trim() === '' ||
      this.productObject.categoryID === null ||
      this.productObject.categoryID.trim() === ''
    ) {
      return alert('Enter All Required Fields !');
    } else {
      // this.updateProduct();
    }
  }

  getProductValues() {
    const accessToken = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    console.log('Getting Products Values ');
    this.http
      .get(
        `https://the-pet-store-backend.vercel.app/api/admin/getOneProduct/${this.productId}`,
        { headers }
      )
      .subscribe((data: any) => {
        console.log(data);
        this.product.name = data.findProduct.name;
        this.product.price = data.findProduct.price;
        this.product.description = data.findProduct.description;
        this.product.size = data.findProduct.size;
        this.product.quantity = data.findProduct.quantity;
        this.product.animal = data.findProduct.animal;
        this.product.images = data.findProduct.images[0];
        this.product.coupon.code = data.findProduct.coupon.code;
        this.product.coupon.discountPercentage =
          data.findProduct.coupon.discountPercentage;


        const dateString = data.findProduct.coupon.expirationDate;
        const date = new Date(dateString);

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0'); // Adding 1 to month since it's zero-based, and padding with '0'
        const day = String(date.getDate()).padStart(2, '0'); // Padding with '0'
        const formattedDate = `${year}-${month}-${day}`;
        this.product.coupon.expirationDate =formattedDate;
        console.log(formattedDate); // Output: 2023-12-04
      });
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

}
