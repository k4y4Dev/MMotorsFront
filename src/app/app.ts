import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './parts/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    CommonModule,
    Navbar
],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit{
  protected readonly title = signal('motorsFront');
  burgerStatus!: boolean;

  ngOnInit(): void {
    this.burgerStatus = false;
  }


  drawerStatus(){
    this.burgerStatus = !this.burgerStatus
    console.log(this.burgerStatus)
/*     this.burgerStatus?document.body.classList.add('no-scroll'):document.body.classList.remove('no-scroll')
 */
  if (this.burgerStatus) {

    document.body.classList.add('no-scroll');
  } else {

    setTimeout(() => {
      document.body.classList.remove('no-scroll');
    }, 250); 
  }
  }

}
