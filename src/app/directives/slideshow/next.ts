import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNext]',
})
export class Next {

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
  nextFunc() {
    const elm = this.el.nativeElement.parentElement.parentElement.children[0];
    const items = elm.getElementsByClassName('item');

    // Move the first set of visible items to the end
    for (let i = 0; i < 4; i++) {  // Adjust the number 4 based on your visible items
      elm.append(items[0]);
    }
  }

}
