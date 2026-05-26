import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPage } from './item-page';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { AuthService } from '../../_services/auth-service';
import { signal } from '@angular/core';

describe('ItemPage', () => {
  let component: ItemPage;
  let fixture: ComponentFixture<ItemPage>;

  beforeEach(async () => {
    try {
      await TestBed.configureTestingModule({
        imports: [ItemPage],
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
    
      fixture = TestBed.createComponent(ItemPage);
      component = fixture.componentInstance;
      fixture.detectChanges();
    } catch (error) {
      // Force Vitest à afficher l'erreur Angular réelle dans le terminal
      console.error('ERREUR ANGULAR DETECTEE :', error);
      throw error;
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
