import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent {
  Orders: any[] = [];

  constructor(private http: HttpClient, private router:Router) {}

  ngOnInit() {
    this.getOrders();
  }

  getOrders() {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http.get('http://localhost:8080/api/admin/getAllOrders', { headers }).subscribe(
      (res: any) => {
        console.log(res);
        this.Orders = res.Orders;
      },
      (error) => {
        console.error('Error getting orders', error);
      }
    );
  }

  // test
  redirectToOrderInfo(val:String){
    console.log(val)
    this.router.navigate(['/order-info',val])
  }
  // 

}
