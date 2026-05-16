import { Routes } from '@angular/router';
import { HomePage } from './pages/home-page/home-page';
import { CarList } from './pages/car-list/car-list';
import { ItemPage } from './pages/item-page/item-page';
import { LoginPage } from './pages/login-page/login-page';
import { Profile } from './pages/profile/profile';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuardGuard } from './_guards/auth-guard-guard';
import { adminGuardGuard } from './_guards/admin-guard-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomePage },
    { path: 'cars', component: CarList },
    { path: 'cars/:id', component: ItemPage },
    { path: 'login', component: LoginPage },
    { path: 'profile', component: Profile, canActivate: [authGuardGuard] },
    { path: 'dashboard', component: Dashboard, canActivate: [adminGuardGuard]},
];
