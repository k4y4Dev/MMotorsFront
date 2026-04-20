import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { CarList } from './pages/car-list/car-list';
import { ItemPage } from './pages/item-page/item-page';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage },
    { path: 'cars', component: CarList },
    { path: 'cars/:id', component: ItemPage },
];
