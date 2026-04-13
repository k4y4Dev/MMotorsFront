import { Component } from '@angular/core';
import { Card } from '../../parts/card/card';
import { Slideshow } from '../../parts/slideshow/slideshow';

@Component({
  selector: 'app-home-page',
  imports: [
    Slideshow
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePage {
  

}
