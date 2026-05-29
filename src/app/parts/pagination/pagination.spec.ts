import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Pagination } from './pagination';
import { CarService } from '../../_services/car-service';
import { signal } from '@angular/core';

describe('Pagination', () => {
  let component: Pagination;
  let fixture: ComponentFixture<Pagination>;
  let carServiceMock: {
    getSignal: ReturnType<typeof vi.fn>;
    loadCars: ReturnType<typeof vi.fn>;
  };

  // Signaux contrôlables depuis les tests
  let hasMoreSignal = signal<boolean>(false);

  beforeEach(async () => {
    hasMoreSignal = signal<boolean>(false);

    carServiceMock = {
      getSignal: vi.fn().mockReturnValue(hasMoreSignal),
      loadCars: vi.fn(),
    };

    await TestBed.configureTestingModule({
      imports: [Pagination],
      providers: [
        { provide: CarService, useValue: carServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Pagination);
    component = fixture.componentInstance;
    await fixture.whenStable();
    fixture.detectChanges();
  });

  // ──────────────────────────────────────────────
  // Création
  // ──────────────────────────────────────────────
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ──────────────────────────────────────────────
  // État initial (page 1, pas de pages suivantes)
  // ──────────────────────────────────────────────
  describe('initial state', () => {
    it('should start on page 1', () => {
      expect(component._currentPage()).toBe(1);
    });

    it('should NOT show Previous button on page 1', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const labels = Array.from(buttons).map((b: any) => b.textContent.trim());
      expect(labels).not.toContain('Previous');
    });

    it('should NOT show Next button when hasMore is false', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const labels = Array.from(buttons).map((b: any) => b.textContent.trim());
      expect(labels).not.toContain('Next');
    });

    it('should show current page number', () => {
      const mainPage = fixture.nativeElement.querySelector('.mainPage');
      expect(mainPage.textContent.trim()).toBe('1');
    });

    it('should NOT show previous page li on page 1', () => {
      const subPages = fixture.nativeElement.querySelectorAll('.subPages');
      expect(subPages.length).toBe(0);
    });
  });

  // ──────────────────────────────────────────────
  // Page 1 avec pages suivantes disponibles
  // ──────────────────────────────────────────────
  describe('page 1 with hasMore = true', () => {
    beforeEach(async () => {
      hasMoreSignal.set(true);
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should show Next button', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const labels = Array.from(buttons).map((b: any) => b.textContent.trim());
      expect(labels).toContain('Next');
    });

    it('should show next page number in li', () => {
      const subPages = fixture.nativeElement.querySelectorAll('.subPages');
      expect(subPages.length).toBe(1);
      expect(subPages[0].textContent.trim()).toBe('2');
    });

    it('should NOT show Previous button on page 1 even with hasMore', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const labels = Array.from(buttons).map((b: any) => b.textContent.trim());
      expect(labels).not.toContain('Previous');
    });
  });

  // ──────────────────────────────────────────────
  // changePage()
  // ──────────────────────────────────────────────
  describe('changePage()', () => {
    it('should update currentPage signal', () => {
      component.changePage(3);
      expect(component._currentPage()).toBe(3);
    });

    it('should call carService.loadCars with correct skip', () => {
      component.changePage(3);
      // skip = (3 - 1) * 10 = 20
      expect(carServiceMock.loadCars).toHaveBeenCalledWith(20);
    });

    it('should call carService.loadCars with skip=0 for page 1', () => {
      component.changePage(1);
      expect(carServiceMock.loadCars).toHaveBeenCalledWith(0);
    });

    it('should call carService.loadCars with skip=10 for page 2', () => {
      component.changePage(2);
      expect(carServiceMock.loadCars).toHaveBeenCalledWith(10);
    });
  });

  // ──────────────────────────────────────────────
  // Interactions DOM — page > 1
  // ──────────────────────────────────────────────
  describe('DOM interactions on page 2', () => {
    beforeEach(async () => {
      hasMoreSignal.set(true);
      component.changePage(2);
      await fixture.whenStable();
      fixture.detectChanges();
    });

    it('should show Previous button on page 2', () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const labels = Array.from(buttons).map((b: any) => b.textContent.trim());
      expect(labels).toContain('Previous');
    });

    it('should show both previous and next page numbers in li', () => {
      const subPages = fixture.nativeElement.querySelectorAll('.subPages');
      expect(subPages.length).toBe(2);
      expect(subPages[0].textContent.trim()).toBe('1');
      expect(subPages[1].textContent.trim()).toBe('3');
    });

    it('should go to previous page on Previous button click', async () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const prevBtn: HTMLElement = Array.from(buttons).find(
        (b: any) => b.textContent.trim() === 'Previous'
      ) as HTMLElement;

      prevBtn.click();
      await fixture.whenStable();

      expect(component._currentPage()).toBe(1);
      expect(carServiceMock.loadCars).toHaveBeenLastCalledWith(0);
    });

    it('should go to next page on Next button click', async () => {
      const buttons = fixture.nativeElement.querySelectorAll('button');
      const nextBtn: HTMLElement = Array.from(buttons).find(
        (b: any) => b.textContent.trim() === 'Next'
      ) as HTMLElement;

      nextBtn.click();
      await fixture.whenStable();

      expect(component._currentPage()).toBe(3);
      expect(carServiceMock.loadCars).toHaveBeenLastCalledWith(20);
    });

    it('should go to page on subPage li click', async () => {
      const subPages = fixture.nativeElement.querySelectorAll('.subPages');
      subPages[0].click(); // clic sur page 1
      await fixture.whenStable();

      expect(component._currentPage()).toBe(1);
    });
  });
});