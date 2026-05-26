import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Profile } from './profile';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../_services/auth-service';
import { signal } from '@angular/core';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Profile],
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
    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
