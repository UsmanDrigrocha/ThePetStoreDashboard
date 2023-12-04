import { HttpClient, HttpSentEvent } from '@angular/common/http';
import { Component } from '@angular/core';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
})
export class UsersComponent {


  ngOnInit() {
   this.login()
  }


  constructor(private http: HttpClient) {}

  public getJsonValue:any;

  login() {
    // Call your login API here
    this.http
      .get(
        'https://the-pet-store-backend.vercel.app/api/admin/getAllProducts',
      )
      .subscribe(
        (response) => {
          // Handle the response from the server
          this.getJsonValue=response
          console.log(response);
        },
        (error) => {
          // Handle errors
          console.error(error);
        }
      );
  }


}
