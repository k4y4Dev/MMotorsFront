import { Component, effect, ElementRef, inject, Renderer2, viewChild, viewChildren } from '@angular/core';
import { Prev } from "../../directives/slideshow/prev";
import { Next } from "../../directives/slideshow/next";
import { Card } from '../card/card';
import { ScreenSizeChecker } from '../../_directives/screen-size-checker';

@Component({
  selector: 'app-slideshow',
  imports: [
    Card,
    ScreenSizeChecker
  ],
  templateUrl: './slideshow.html',
  styleUrl: './slideshow.scss',
})
export class Slideshow {

    private renderer = inject(Renderer2);
  
    images = [
    {id:1,
      url:'/assets/berline_1.png'
    },
    {id:2,
      url:'/assets/suv_1.png'
    },
    {id:3,
      url:'/assets/sporty_1.png'
    }
  ]

  currentIndex:number = 0

  private babies = viewChildren('test', { read: ElementRef })

  constructor() {

    effect(() => {
      const list = this.babies();

      const target = list[1]; 
      if(target) {
        this.renderer.addClass(target.nativeElement, 'toRemove');
      }
    })
  }

/*   next(){
    this.currentIndex = (this.currentIndex + 1)%this.images.length;
    console.log(this.currentIndex)
  }

  prev(){
    this.currentIndex = (this.currentIndex - 1 + this.images.length)%this.images.length;
    console.log(this.currentIndex)

  } */

}
