import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginFormModel } from '../../_models/form-models';
import {  email, form, FormField, required, schema, submit } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../_services/auth-service';
import { RouterLink } from "@angular/router";

export const loginFormSchema = schema<LoginFormModel>((rootPath) => {
      required(
        rootPath.username,
        {message:'Email is required'}
      );
      email(
        rootPath.username,
        {message:'Please enter a valid email address'}
      );
      required(
        rootPath.password,
        {message:'Password is required'}
      );
    })

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    FormField,
    JsonPipe,
    RouterLink
],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {

  private loginService = inject(AuthService)

  loginModel = signal<LoginFormModel>( {
    username: '',
    password: ''
  })


  loginForm = form<LoginFormModel>(
    this.loginModel,
    loginFormSchema
  )

  submitForm(event: Event) {
    event.preventDefault();

    submit(this.loginForm, async (form) => {

      try {
        await firstValueFrom(this.loginService.login(form().value()))

        return undefined
      } catch (error)  {
        return console.error();
        
      }
    })
  }
}
