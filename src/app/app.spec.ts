import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { By } from '@angular/platform-browser';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('Should have the menu closed at first', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const backdrop = fixture.debugElement.query(By.css('.backdrop'))

    expect(app.burgerStatus).toBe(false);
    expect(app.burgerStatus).not.toBe(true);
    expect(app.burgerStatus).toBeTypeOf("boolean");
    expect(app.burgerStatus).toBeDefined();


    expect(app.burgerIcon).toBe('fa-bars');
    expect(app.burgerIcon).not.toBe('fa-xmark');
    expect(app.burgerIcon).toBeTypeOf("string");
    expect(app.burgerIcon).toBeDefined();

    expect(backdrop).toBeNull()


    

  })

  it('Should open the menu with a click', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    const burgerBtn = fixture.debugElement.query(By.css('.burgerMenu'));


    burgerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();

    const backdrop = fixture.debugElement.query(By.css('.backdrop'))

    expect(app.burgerStatus).toBe(true);
    expect(app.burgerStatus).not.toBe(false);
    expect(app.burgerStatus).toBeDefined();

    expect(app.burgerIcon).toBe('fa-xmark');
    expect(app.burgerIcon).not.toBe('fa-bars');
    expect(app.burgerIcon).toBeTypeOf("string");
    expect(app.burgerIcon).toBeDefined();

    expect(document.body.classList).toContain('no-scroll')


    expect(backdrop).not.toBeNull()


  })

  it('Should close the menu after a click', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    vi.useFakeTimers();

    //Mock burgerstatus
    app.burgerStatus = true;
    fixture.detectChanges();

    const burgerBtn = fixture.debugElement.query(By.css('.burgerMenu'));
    burgerBtn.triggerEventHandler('click', null);
    fixture.detectChanges();




    expect(app.burgerStatus).toBe(false);
    expect(app.burgerStatus).not.toBe(true);
    expect(app.burgerStatus).toBeTypeOf("boolean");
    expect(app.burgerStatus).toBeDefined();


    expect(app.burgerIcon).toBe('fa-bars');
    expect(app.burgerIcon).not.toBe('fa-xmark');
    expect(app.burgerIcon).toBeTypeOf("string");
    expect(app.burgerIcon).toBeDefined();


    expect(document.body.classList.contains('no-scroll')).toBeTruthy()
    vi.advanceTimersByTime(250);
    expect(document.body.classList.contains('no-scroll')).toBeFalsy()

    vi.useRealTimers();


    const backdrop = fixture.debugElement.query(By.css('.backdrop'))
    expect(backdrop).toBeNull()
  })




});
