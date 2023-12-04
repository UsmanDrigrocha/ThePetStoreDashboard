import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authenticated = false;
  private token: string | null = null;

  constructor() {
    // Check for the presence of the token in local storage during initialization
    const storedToken = localStorage.getItem('token');

    if (storedToken) {
      this.authenticated = true;
      this.token = storedToken;
    } 
  }

  login(token: string) {
    this.authenticated = true;
    this.token = token;

    setTimeout(() => {
      this.logout();
    },  24 * 60 * 60 * 1000);

    // Save token to local storage
    localStorage.setItem('token', token);
  }

  logout() {
    this.authenticated = false;
    this.token = null;
    // Remove token from local storage
    localStorage.removeItem('token');
  }

  isAuthenticated(): boolean {
    return this.authenticated;
  }

  getToken(): string | null {
    return this.token;
  }
}
