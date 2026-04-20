import { Component, input } from '@angular/core';
import { ICar } from '../../_interfaces/icar';

@Component({
  selector: 'app-card',
  imports: [],
  templateUrl: './card.html',
  styleUrl: './card.scss',
})
export class Card {

  carData = input.required<ICar>()

/*   indexSlide = input.required<string>()
 */

}
