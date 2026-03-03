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
  burgerIcon!: string;

  ngOnInit(): void {
    this.burgerStatus = false;
    this.burgerIcon = "fa-bars"
  }


  drawerStatus(){
    this.burgerStatus = !this.burgerStatus
    this.burgerIcon = this.burgerStatus ? "fa-xmark": "fa-bars"
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
