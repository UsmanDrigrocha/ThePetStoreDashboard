import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private http: HttpClient, private authService: AuthService , private router: Router) {}

  login(form: any, event: Event) {
    event.preventDefault();
    const url = 'https://the-pet-store-backend.vercel.app/api/admin/adminLogin';
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    if (
      form.email.value === null ||
      form.email.value.trim() === '' ||
      form.password.value === null ||
      form.password.value.trim() === ''
    ) {
      alert('Fill the FORM');
      return;
    }

    this.http
      .post(
        url,
        { email: form.email.value, password: form.password.value },
        { headers }
      )
      .subscribe(
        (data: any) => {
          // console.log('Login successful:', data);
          alert('success 👍');

          this.authService.login(data.adminToken);
          form.reset();
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          alert('Login Failed !⚠');
          form.reset();
        }
      );
  }
}
