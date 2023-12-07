import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.css'],
})
export class UpdateCategoryComponent {
  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    console.log('Update Category');
    this.route.params.subscribe((params) => {
      const categoryId = params['id'];
      this.categoryId = categoryId;
      console.log(categoryId)
      // Now you have access to the product ID, you can fetch the corresponding product data for editing
      // Fetch data or perform necessary operations using this categoryId
      this.getProductCategories();
    });
  }

  categoryId = '';

  categories = {
    images: [] as string[], // Explicitly defining as an array of strings
  };

  imageUrl: any;
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): any {
    const formData = new FormData();
    formData.append('image', file);

    this.http
      .post<any>('http://localhost:8080/api/user/uploadImage', formData)
      .subscribe(
        (response) => {
          console.log('Upload successful!', response);
          if (response && response.url) {
            this.imageUrl = response.url;
            this.imageUrl = 'http://localhost:8080/' + this.imageUrl;
            console.log(this.imageUrl);

            const relativePath = this.imageUrl.replace(
              'http://localhost:8080/',
              ''
            );

            // Assuming 'categories' is your product object and 'images' is an array property
            this.categoryDetails.images.push(relativePath);
          }
        },
        (error) => {
          console.error('Error occurred while uploading: ', error);
          // Handle error, show an error message to the user
          // Avoid pushing the image URL in case of an error
        }
      );
  }

  // --------------- Get Product Categories ------------------------
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
        console.log('Product Categories:', this.productCategories);
      },
      (error) => {
        console.error('Error fetching product categories:', error);
      }
    );
  }

  // ------------------ Update Category ---------------------------
  categoryDetails = {
    name: '',
    categoryID: '',
    images: [] as string[],
  };
  onSubmit(e: Event, form: any) {
    e.preventDefault();
    this.categoryDetails.name = form.category.value;
    this.categoryDetails.categoryID = form.categoryID.value;

    console.log(this.categoryDetails);

    this.createCategory(this.categoryDetails);
  }

  // ---------------- Update Category Function -------------------

  createCategory(formData: any) {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .put<any>(
        'http://localhost:8080/api/admin/createCatagory',
        {
          categoryID: formData.categoryID,
          name: formData.name,
          image: formData.images[0],
        },
        { headers }
      )
      .subscribe(
        (response) => {
          console.log('Category Created', response);
          alert('Category Created Successfully !');
          this.router.navigate(['/products']);
          // Assuming the server responds with the URL of the uploaded image
        },
        (error) => {
          console.error('Error occurred while uploading: ', error);
          // Handle error, show an error message to the user
        }
      );
  }
}
