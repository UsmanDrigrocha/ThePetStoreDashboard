import { HttpClient, HttpHeaders, HttpSentEvent } from '@angular/common/http';
import { Component } from '@angular/core';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {
  ngOnInit() {
    this.getUsers();
  }

  constructor(private http: HttpClient, private router: Router) {}

  public getJsonValue: any;

  getUsers() {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });
    // Call your getUsers API here
    this.http
      .get(
        'http://localhost:8080/api/admin/getRegistedUsers',
        { headers }
      )
      .subscribe(
        (response) => {
          // Handle the response from the server
          this.getJsonValue = response;
          console.log(this.getJsonValue);
        },
        (error) => {
          // Handle errors
          console.error(error);
        }
      );
  }

  //  Delete User Logic
  deleteUser(val: string): any {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    if (confirm('Are you sure you want to delete this User?')) {
      const url = `http://localhost:8080/api/admin/deleteAdmin/${val}`;
      console.log('Deleting : ', val, 'URL', url);

      return this.http.delete(url, { headers }).subscribe(
        (response) => {
          alert('User Deleted Successfully !');
          window.location.reload();
          return;
        },
        (error) => {
          alert('Error Deleting User');
          window.location.reload();
          console.log(error.message)
        }
      );
    }
  }
}
