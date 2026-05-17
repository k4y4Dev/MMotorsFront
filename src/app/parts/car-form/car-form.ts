import { Component, inject, input, OnInit, signal } from '@angular/core';
import { CarFormModel } from '../../_models/form-models';
import { form, FormField, required, schema, submit } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { CarService } from '../../_services/car-service';
import { ICarResponse } from '../../_models/icar';

export const carFormSchema = schema<CarFormModel>((rootPath) => {
      required(
        rootPath.name,
        {message:'Name is required'}
      );
/*       email(
        rootPath.username,
        {message:'Please enter a valid email address'}
      ); */
      required(
        rootPath.price,
        {message:'Password is required'}
      );
      required(
        rootPath.price,
        {message:'Password is required'}
      );
    })

@Component({
  selector: 'app-car-form',
  imports: [
    FormField
  ],
  templateUrl: './car-form.html',
  styleUrl: './car-form.scss',
})
export class CarForm implements OnInit{

  private carService = inject(CarService)
  carData = input.required<ICarResponse | null>()
  btnName = signal<string>("Ajouter")


    carFormModel = signal<CarFormModel>( {
    name: '',
    price: 0,
    km: 0,
    image: ''
    
  })

    carForm = form<CarFormModel>(
    this.carFormModel,
    carFormSchema
  )

  ngOnInit(){
    const car = this.carData();

    if(car != null) {
        this.carFormModel.set({
          name: car.name,
          price: car.price,
          km: car.km,
          image: car.image
      });

      this.btnName.set("Modifier")
    }
  }

    submitForm(event: Event) {
    event.preventDefault();

    submit(this.carForm, async (form) => {

      try {
        await firstValueFrom(this.carService.createCar(form().value()))

        return 
      } catch (error)  {
        return console.error();
        
      }
    })
  }

}
