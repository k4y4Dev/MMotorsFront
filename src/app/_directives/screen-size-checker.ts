import { Directive, effect, ElementRef, HostListener, inject, Renderer2 } from '@angular/core';
import { SlideshowService } from '../_services/slideshow-service';

@Directive({
  selector: '[appScreenSizeChecker]',
})
export class ScreenSizeChecker {

  private slideService = inject(SlideshowService);
  private el = inject(ElementRef);
  private renderer = inject(Renderer2);
  private responsiveClass = {
    mobile: ".mobileTest",
    tablet: ".tabletTest",
    desktop: ".desktopTest"
  }
  

  constructor() {


      effect(() => {
      let screenSize:any = this.slideService.isTest()

      switch (screenSize) {
        case 'mobile':
          console.log(this.responsiveClass.mobile)
          break;
        case 'tablet':
          console.log(this.responsiveClass.tablet)
          break;
        case 'desktop':
          console.log(this.responsiveClass.desktop)
          break;
        default:
          console.log(this.responsiveClass.mobile)
      }
      
/*       if (screenSize == 'mobile') {
        this.renderer.addClass(this.el.nativeElement, 'is-mobile');
        console.log('Mode Mobile activé');
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'is-mobile');
        console.log('Mode Desktop activé');
      } */
    });
  }


}
