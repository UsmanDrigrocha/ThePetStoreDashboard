import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgModule } from '@angular/core';
import { retry } from 'rxjs';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css'],
})
export class OrderInfoComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  productId = '';
  orderDetails: any = {};
  productDetails: any = {};
  userDetails: any = {};
  selectedPaymentStatus: string = '';
  selectedOrderStatus: string = '';

  productData: any = {
    name: '',
    price: '',
    email: '',
    paymentStatus: '',
    orderStatus: '',
  };

  orderData: any = {};

  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      console.log(productId);
      const orderId = productId;
      this.productId = productId;
      this.getProductPrice();
      this.getOrders();
    });
  }

  getProductPrice() {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .get(`http://localhost:8080/api/admin/getOneProduct/${this.productId}`, {
        headers,
      })
      .subscribe((data: any) => {
        try {
          const price =
            parseInt(data.findProduct.price) *
            parseInt(data.findProduct.quantity);

          this.productData = {
            name: data.findProduct.name,
            price: data.findProduct.price,
            orderStatus: '',
            paymentStatus: '',
          };
        } catch (error) {
          console.log('Error Getting Order Info !');
        }
      });
  }

  getOrders() {
    const accessToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    this.http
      .get('http://localhost:8080/api/admin/getAllOrders', { headers })
      .subscribe((data: any) => {
        try {
          if (data && data.Orders && data.Orders.length > 0) {
            const orders = data.Orders;

            const productOrder = orders.find((order: any) =>
              order.order.some((item: any) => item.productID === this.productId)
            );

            if (productOrder) {
              const productDetails = productOrder.order.find(
                (item: any) => item.productID === this.productId
              );

              this.userDetails = {
                userID: productOrder.userID,
              };

              const productQuantity = productDetails.quantity;
              const orderStatus = productDetails.orderStatus;
              const paymentStatus = productDetails.paymentStatus;
              this.productData.orderStatus = orderStatus;
              this.productData.paymentStatus = paymentStatus;
              const productActualPrice = this.productData.price;
              const totalPrice = productQuantity * productActualPrice;

              this.orderData = {
                price: totalPrice,
              };

              console.log(this.productData);

              this.http
                .get(
                  `http://localhost:8080/api/admin/getUserDetails/${this.userDetails.userID}`,
                  { headers }
                )
                .subscribe(
                  (res: any) => {
                    try {
                      if (res && res.User) {
                        this.userDetails = res.User;
                        const userEmail = this.userDetails.email;

                        this.productData.email = userEmail;
                      } else {
                        console.log('User details not found in the response.');
                      }
                    } catch (error) {
                      console.log(
                        'Error getting or processing user details:',
                        error
                      );
                    }
                  },
                  (error) => {
                    console.log('HTTP Error:', error);
                  }
                );
            }
          }
        } catch (error) {
          console.log('Error getting orders');
        }
      });
  }
  updateStatus(pay: any, order: any) {
    console.log('Updated Payment Status:', pay.value);
    console.log('Updated Order Status:', order.value);

    if (order.value === '' && pay.value === '') {
      return alert('Already set to default !');
    }

    const accessToken = localStorage.getItem('token');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    });

    const requestBody = {
      productID: this.productId,
      paymentStatus: pay.value,
      orderStatus: order.value,
      id: this.userDetails._id,
    };


    this.http
      .put(
        'http://localhost:8080/api/admin/updateOrderStatus/',
        requestBody, // Pass the request body here
        { headers } // Pass the headers object separately
      )
      .subscribe((res) => {
        try {
          console.log(res);
          alert("Order Status Updated !");
        } catch (error) {
          alert('Error Updating !');
        }
      });
  }
}
