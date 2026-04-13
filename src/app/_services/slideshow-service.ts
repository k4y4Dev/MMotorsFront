import { Injectable, Signal, signal } from '@angular/core';
import { retry } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
@Injectable({ providedIn: 'root' })
export class SlideshowService {
  

  private readonly queries = {
    mobile: '(max-width: 599px)',
    tablet: '(min-width: 600px) and (max-width: 999px)',
    desktop: '(min-width: 1000px)'
  };


  isTest = signal<string>(this.queries.mobile);

  constructor() {
    this.initQueries();
  }

  private initQueries() {
    Object.entries(this.queries).forEach(([name, query]) => {
      const mql = window.matchMedia(query);
      

      if (mql.matches) this.isTest.set(name);


      mql.addEventListener('change', (event) => {
        if (event.matches) {
          this.isTest.set(name);
/*           console.log('Passage en mode :', name); */
        }
      });
    });
  }
}


  

