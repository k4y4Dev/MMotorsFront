import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { signal } from '@angular/core';
import { vi } from 'vitest';

import { Profile } from './profile';

import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

import { AuthService } from '../../_services/auth-service';
import { UploadService } from '../../_services/upload-service';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  // Mock UploadService
  const uploadServiceMock = {
    getImage: vi.fn(),
    uploadImage: vi.fn()
  };

  beforeEach(async () => {

    uploadServiceMock.getImage.mockReturnValue(
      of('https://fake-image-url.com/test.jpg')
    );

    uploadServiceMock.uploadImage.mockReturnValue(
      of({
        url: 'https://fake-upload-url.com/image.jpg'
      })
    );

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),

        {
          provide: AuthService,
          useValue: {
            isAuthenticated: signal(false)
          }
        },

        {
          provide: UploadService,
          useValue: uploadServiceMock
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Profile);
    component = fixture.componentInstance;

    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load image on init', () => {

    expect(uploadServiceMock.getImage).toHaveBeenCalled();

    expect(component.tempSignal()).toBe(
      'https://fake-image-url.com/test.jpg'
    );
  });

  it('should upload image', () => {

    // Fake file
    const file = new File(
      ['dummy content'],
      'test.png',
      { type: 'image/png' }
    );

    // Fake event
    const event = {
      target: {
        files: [file]
      }
    } as unknown as Event;

    component.uploadImage(event);

    expect(uploadServiceMock.uploadImage).toHaveBeenCalled();

    expect(component.tempSignal()).toBe(
      'https://fake-upload-url.com/image.jpg'
    );

    expect(component.isUploading()).toBe(false);
  });

});