import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appPrev]',
})
export class Prev {

    constructor(private el: ElementRef) { }

     getVisibleItems(): number {
    const sliderContainer = this.el.nativeElement.closest('.slider-wrap');

    if (!sliderContainer) {
      console.error('Slider container not found');
      return 1; 
    }

    const containerWidth = sliderContainer.offsetWidth; 
    const itemElement = sliderContainer.querySelector('.item'); 

    if (!itemElement) {
      console.error('Item element not found');
      return 1; 
    }

    const itemWidth = itemElement.offsetWidth; 
    return Math.floor(containerWidth / itemWidth);
  }

  @HostListener('click')
  prevFunc() {
    const elm = this.el.nativeElement.parentElement.parentElement.children[0];
    const items = elm.getElementsByClassName('item');

    // Move the last set of visible items to the beginning
    for (let i = 0; i < 4; i++) {  // Adjust based on visible items
      elm.prepend(items[items.length - 1]);
    }
  }

}
