import { TestBed } from '@angular/core/testing';
import { NgxEnvModule } from '@ngx-env/core';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgxEnvModule],
      declarations: [AppComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should get the correct values from the environment', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.version).toBeDefined();
  });

  it('should get the correct values in the template', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const elt: Element = fixture.nativeElement;
    fixture.detectChanges();
    // expect(elt.querySelector('#NG_APP_ENV')?.innerHTML).toEqual('test');
    expect(elt.querySelector('#NG_APP_VERSION')?.innerHTML.trim()).not.toEqual(
      ''
    );
  });
});
