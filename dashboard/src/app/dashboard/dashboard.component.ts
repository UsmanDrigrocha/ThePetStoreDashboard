import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  token: string | null = null;

  constructor(private authService: AuthService,private location:Location) {}

  ngOnInit(): void {
    this.token = this.authService.getToken();
  }
}
