import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
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
      console.log(categoryId);
      // Now you have access to the product ID, you can fetch the corresponding product data for editing
      // Fetch data or perform necessary operations using this categoryId
      this.getProductCategories();
      this.updateSelectedCategoryName();
      this.showUpdatedValues(categoryId);
      this.showUpdatedValues("test");
      this.updateImgValue()
    });
  }

  categoryId = '';

  categories = {
    images: [] as string[], // Explicitly defining as an array of strings
  };

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

    this.updateCategory(this.categoryDetails);
  }

  // ---------------- Update Category Function -------------------

  updateCategory(formData: any) {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .put<any>(
        `http://localhost:8080/api/admin/updateCategory/${this.categoryId}`,
        {
          categoryID: formData.categoryID,
          name: formData.name,
          image: formData.images[0],
        },
        { headers }
      )
      .subscribe(
        (response) => {
          console.log('Category updated', response);
          alert('Category updated Successfully !');
          this.router.navigate(['/products']);
          // Assuming the server responds with the URL of the uploaded image
        },
        (error) => {
          console.error('Error occurred while uploading: ', error);
          // Handle error, show an error message to the user
        }
      );
  }

  selectedCategoryID = this.categoryId;
  selectedCategoryName = '';
  updateSelectedCategoryName() {
    const selectedCategory = this.productCategories.find(
      (category) => category._id === this.selectedCategoryID
    );
    if (selectedCategory) {
      this.selectedCategoryName = selectedCategory.name;
      console.log(selectedCategory.name);
    } else {
      this.selectedCategoryName = ''; // Handle if category is not found
    }
  }

  // Get Category Values
  categoryValues = {
    name: '',
    image: '',
  };
  showUpdatedValues(val: string) {
    const accessToken = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .get<any>(
        `http://localhost:8080/api/admin/getOneCategory/${this.categoryId}`,
        { headers }
      )
      .subscribe({
        next: (data) => {
          console.log('Category Details:', data);
          this.categoryValues.name = data.data.name;
          this.categoryValues.image = data.data.image;
          console.log(this.categoryValues);
          this.relativePath=data.data.image;
          console.log('relaive path',data.data.image)
          this.imageUrl="http://localhost:8080/"+data.data.image
        },
        error: (error) => {
          console.error('Error getting category values:', error);

          if (error instanceof HttpErrorResponse) {
            console.error('Full error response:', error);
          }
        },
        complete: () => {
          // this.router.navigate(['/products']);
          // console.log('Product Updated !');
        },
      });
  }


  updateImgValue(){
    console.log("Ipt runned")
    console.log(this.imageUrl)
  }

  //  Upload Image 
  imageUrl: string | undefined;
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploadFile(file);
    }
  }

  // 
  relativePath='';
  
  // 

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('image', file);

    // Replace 'upload_url' with your server endpoint URL
    this.http
      .post<any>('http://localhost:8080/api/user/uploadImage', formData)
      .subscribe(
        (response) => {
          console.log('Upload successful!', response);
          // Assuming the server responds with the URL of the uploaded image
          if (response && response.url) {
            this.imageUrl = response.url;
            this.imageUrl = 'http://localhost:8080/' + this.imageUrl;

            console.log(this.imageUrl);
            const relativePath = this.imageUrl.replace(
              'http://localhost:8080/',
              ''
            );
            this.categoryValues.image=(relativePath);
          }
        },
        (error) => {
          console.error('Error occurred while uploading: ', error);
          alert('Error Uploading Image');
          // Handle error, show an error message to the user
        }
      );
  }
}
