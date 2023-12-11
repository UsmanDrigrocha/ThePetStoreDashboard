import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-order-info',
  templateUrl: './order-info.component.html',
  styleUrls: ['./order-info.component.css'],
})
export class OrderInfoComponent {
  constructor(
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}
  productId = '';
  orderDetails: any = {};
  productDetails: any = {};
  userDetails: any = {};
  ngOnInit() {
    this.route.params.subscribe((params) => {
      const productId = params['id'];
      console.log(productId);
      //
      const orderId = productId;
      this.productId = productId;
      this.getProductPrice();
      this.getOrders();
    });
  }

  productData: any = {
    name: '', // Replace with your product name
    price: '', // Replace with your product price
    email: '', // Assigning user email to display
    paymentStatus: '',
    orderStatus: '',
  };

  orderData: any = {};

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
          };
          console.log(data);
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
    // this.http.get("http://localhost:8080/api/admin/getAllOrders",{headers}).subscribe((data)=>{
    //   try {
    //     console.log(data)
    //   } catch (error) {
    //     console.log("Error getting orders")
    //   }
    // })

    //
    // this.http
    //   .get('http://localhost:8080/api/admin/getAllOrders', { headers })
    //   .subscribe((data: any) => {
    //     try {
    //       console.log(data);

    //       if (data && data.Orders && data.Orders.length > 0) {
    //         const orders = data.Orders;

    //         // Find the order associated with the productId
    //         const productOrder = orders.find((order: any) =>
    //           order.order.some((item: any) => item.productID === this.productId)
    //         );

    //         if (productOrder) {
    //           const productDetails = productOrder.order.find(
    //             (item: any) => item.productID === this.productId
    //           );

    //           // Assuming userEmail is associated with the order
    //           this.userDetails = {
    //             userID: productOrder.userID, // Adding user ID to userDetails
    //             // other user details if available
    //           };
    //           this.orderData={
    //             price:price*data.order[].quantity
    //           }

    //           this.http
    //             .get(
    //               `http://localhost:8080/api/admin/getUserDetails/${this.userDetails.userID}`,
    //               { headers }
    //             )
    //             .subscribe(
    //               (res: any) => {
    //                 try {
    //                   console.log(res);

    //                   if (res && res.User) {
    //                     this.userDetails = res.User; // Assign the whole user object to userDetails
    //                     const userEmail = this.userDetails.email;

    //                     // Assigning order details to productData
    //                     this.productData.email = userEmail;
    //                   } else {
    //                     console.log('User details not found in the response.');
    //                   }
    //                 } catch (error) {
    //                   console.log(
    //                     'Error getting or processing user details:',
    //                     error
    //                   );
    //                 }
    //               },
    //               (error) => {
    //                 console.log('HTTP Error:', error);
    //               }
    //             );

    //           // Assigning order details to productData
    //           console.log(this.userDetails);
    //         }
    //       }
    //     } catch (error) {
    //       console.log('Error getting orders');
    //     }
    //   });
    //

    // -------
    this.http
      .get('http://localhost:8080/api/admin/getAllOrders', { headers })
      .subscribe((data: any) => {
        try {
          console.log(data);

          if (data && data.Orders && data.Orders.length > 0) {
            const orders = data.Orders;

            // Find the order associated with the productId
            const productOrder = orders.find((order: any) =>
              order.order.some((item: any) => item.productID === this.productId)
            );

            if (productOrder) {
              const productDetails = productOrder.order.find(
                (item: any) => item.productID === this.productId
              );

              // Assuming userEmail is associated with the order
              this.userDetails = {
                userID: productOrder.userID, // Adding user ID to userDetails
                // other user details if available
              };

              // Calculate total price for the specific product
              const productQuantity = productDetails.quantity;
              const productActualPrice = this.productData.price;
              const totalPrice = productQuantity * productActualPrice;

              this.orderData = {
                price: totalPrice,
              };

              console.log(this.orderData);
              this.http
                .get(
                  `http://localhost:8080/api/admin/getUserDetails/${this.userDetails.userID}`,
                  { headers }
                )
                .subscribe(
                  (res: any) => {
                    try {
                      console.log(res);

                      if (res && res.User) {
                        this.userDetails = res.User; // Assign the whole user object to userDetails
                        const userEmail = this.userDetails.email;

                        // Assigning order details to productData
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

              // Assigning order details to productData
              console.log(this.userDetails);
            }
          }
        } catch (error) {
          console.log('Error getting orders');
        }
      });
  }

  //
}
