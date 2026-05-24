import { Component, inject, signal } from '@angular/core';
import { AuthService } from '../../_services/auth-service';
import { RegisterFormModel } from '../../_models/form-models';
import { email, form, FormField, required, schema, submit } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { firstValueFrom } from 'rxjs';

export const registerFormSchema = schema<RegisterFormModel>((rootPath) => {
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
      required(
        rootPath.lastname,
        {message:'Your lastname is required'}
      );
      required(
        rootPath.firstname,
        {message:'Your password is required'}
      );
    })

@Component({
  selector: 'app-register',
  imports: [
    FormField,
    JsonPipe
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {

  private loginService = inject(AuthService)

  registerModel = signal<RegisterFormModel>( {
    username: '',
    password: '',
    lastname: '',
    firstname: '',
    role: 'user'
  })

    registerForm = form<RegisterFormModel>(
    this.registerModel,
    registerFormSchema
  )

  
  submitForm(event: Event) {
    event.preventDefault();

    submit(this.registerForm, async (form) => {
      console.log(form().value())

      try {
        await firstValueFrom(this.loginService.register(form().value()))

        return undefined
      } catch (error)  {
        return console.error();
        
      }
    })
  }

}
