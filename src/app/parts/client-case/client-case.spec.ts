import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientCase } from './client-case';

describe('ClientCase', () => {
  let component: ClientCase;
  let fixture: ComponentFixture<ClientCase>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientCase]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientCase);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
