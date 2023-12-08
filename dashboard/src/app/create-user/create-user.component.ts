import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css'],
})
export class CreateUserComponent {
  constructor(private http: HttpClient, private router: Router) {}

  formValue = {
    email: '',
    password: '',
    role: '',
    name: '',
  };
  createUser(e: Event, form: any) {
    e.preventDefault();

    // Assuming form contains references to input fields with names 'email', 'password', and 'role'
    this.formValue.email = form.email.value;
    this.formValue.password = form.password.value;
    this.formValue.role = form.userRole.value;
    this.formValue.name = form.name.value;

    console.log(this.formValue);
    if (
      !this.formValue.email ||
      !this.formValue.role ||
      !this.formValue.password ||
      !this.formValue.name
    ) {
      alert('Enter All Fields');
      return;
    }

    // Getting Headers
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    // Creating User
    this.http
      .post<any>(
        'http://localhost:8080/api/admin/createAdmin',
        {
          name: this.formValue.name,
          email:this.formValue.email,
          password:this.formValue.password,
          role:this.formValue.role
        },
        { headers }
      )
      .subscribe(
        (response) => {
          console.log('Category Created', response);
          alert('Category Created Successfully !');
          this.router.navigate(['/users']);
          // Assuming the server responds with the URL of the uploaded image
        },
        (error) => {
          console.error('Error occurred while uploading: ', error);
          // Handle error, show an error message to the user
        }
      );
    //
  }
}
