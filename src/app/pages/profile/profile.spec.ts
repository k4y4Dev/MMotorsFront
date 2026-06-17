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
import { CaseManagementService } from '../../_services/case-management-service';

describe('Profile', () => {
  let component: Profile;
  let fixture: ComponentFixture<Profile>;

  const uploadServiceMock = {
    getImage: vi.fn(),
    uploadImage: vi.fn(),
  };

  const caseServiceMock = {
    checkActiveCase: vi.fn().mockReturnValue(of(null)),
    _activeCase: signal(null),
    caseApplicationApplier: vi.fn().mockReturnValue(of(null)),
  };

  // Simule presetImage + uploadImage en séquence
  const triggerUpload = (component: Profile, docType: 'doc1' | 'doc2' | 'doc3') => {
    const file = new File(['dummy'], 'test.png', { type: 'image/png' });

    // Remplit le signal imageFiles[docType] via presetImage
    const presetEvent = {
      preventDefault: vi.fn(),
      target: { files: [file] },
    } as unknown as Event;
    component.presetImage(presetEvent, docType);

    // Appelle uploadImage maintenant que le fichier est en place
    const uploadEvent = {
      preventDefault: vi.fn(),
      target: { files: [file] },
    } as unknown as Event;
    component.uploadImage(uploadEvent, docType);
  };

  beforeEach(async () => {
    uploadServiceMock.getImage.mockReturnValue(of('https://fake-image-url.com/test.jpg'));
    uploadServiceMock.uploadImage.mockReturnValue(of({ url: 'https://fake-upload-url.com/image.jpg' }));
    caseServiceMock.checkActiveCase.mockReturnValue(of(null));

    await TestBed.configureTestingModule({
      imports: [Profile],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: { isAuthenticated: signal(false) } },
        { provide: UploadService, useValue: uploadServiceMock },
        { provide: CaseManagementService, useValue: caseServiceMock },
      ],
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
    expect(component.tempSignal()).toBe('https://fake-image-url.com/test.jpg');
  });

  // ─────────────────────────────────────────────
  // uploadImage()
  // ─────────────────────────────────────────────
  describe('uploadImage()', () => {
    it('should not call uploadService if no file is preset', () => {
      const event = { preventDefault: vi.fn(), target: { files: [] } } as unknown as Event;
      component.uploadImage(event, 'doc1');
      expect(uploadServiceMock.uploadImage).not.toHaveBeenCalled();
    });

    it('should upload doc1 and update tempSignal', () => {
      triggerUpload(component, 'doc1');
      expect(uploadServiceMock.uploadImage).toHaveBeenCalled();
      expect(component.tempSignal()).toBe('https://fake-upload-url.com/image.jpg');
      expect(component.isUploading()).toBe(false);
    });

    it('should upload doc2', () => {
      triggerUpload(component, 'doc2');
      expect(uploadServiceMock.uploadImage).toHaveBeenCalled();
    });

    it('should upload doc3', () => {
      triggerUpload(component, 'doc3');
      expect(uploadServiceMock.uploadImage).toHaveBeenCalled();
    });
  });

  // ─────────────────────────────────────────────
  // applicationSubmitter()
  // ─────────────────────────────────────────────
  describe('applicationSubmitter()', () => {
    it('should clear selectedCar when answer is false', () => {
      component.selectedCar.set({ id: 1, name: 'Tesla', price: 35000, km: 1000, image: 'x.jpg', trade: 'buying' });
      component.applicationSubmitter(false);
      expect(component.selectedCar()).toBeUndefined();
    });

    it('should call caseApplicationApplier when answer is true', () => {
      component.selectedCar.set({ id: 1, name: 'Tesla', price: 35000, km: 1000, image: 'x.jpg', trade: 'buying' });
      component.applicationSubmitter(true);
      expect(caseServiceMock.caseApplicationApplier).toHaveBeenCalledWith(1);
    });

    it('should clear selectedCar after submitting', () => {
      component.selectedCar.set({ id: 1, name: 'Tesla', price: 35000, km: 1000, image: 'x.jpg', trade: 'buying' });
      component.applicationSubmitter(true);
      expect(component.selectedCar()).toBeUndefined();
    });
  });
});