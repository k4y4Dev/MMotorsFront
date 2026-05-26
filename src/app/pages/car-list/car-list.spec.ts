import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarList } from './car-list';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { signal } from '@angular/core';
import { AuthService } from '../../_services/auth-service';

describe('CarList', () => {
  let component: CarList;
  let fixture: ComponentFixture<CarList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarList],
        providers: [
          provideRouter([]), // Évite les crashs liés aux directives RouterLink
          provideHttpClient(), // Requis pour le client HTTP
          provideHttpClientTesting(), // Intercepte et bloque les requêtes HTTP réelles (Évite le statut 0)
        
        // Mock de AuthService si votre Navbar ou page l'utilise
        { 
          provide: AuthService, 
          useValue: { isAuthenticated: signal(false) } 
        }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
