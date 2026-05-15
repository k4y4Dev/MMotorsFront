import { Component } from '@angular/core';
import { Login } from '../../auth/login/login';

@Component({
  selector: 'app-login-page',
  imports: [
    Login
  ],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

}
