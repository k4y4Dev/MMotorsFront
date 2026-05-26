import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Filter } from './filter';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../_services/auth-service';
import { signal } from '@angular/core';

describe('Filter', () => {
  let component: Filter;
  let fixture: ComponentFixture<Filter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Filter],
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

    fixture = TestBed.createComponent(Filter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
