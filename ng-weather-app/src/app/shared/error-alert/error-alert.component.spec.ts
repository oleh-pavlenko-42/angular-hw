import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorAlertComponent } from './error-alert.component';
import { ErrorHandlingService } from '../../error-handling.service';
import { BehaviorSubject } from 'rxjs';
import { ComponentRef } from '@angular/core';

describe('ErrorAlertComponent', () => {
  let component: ErrorAlertComponent;
  let fixture: ComponentFixture<ErrorAlertComponent>;
  let componentRef: ComponentRef<ErrorAlertComponent>;
  let errorHandlingService: ErrorHandlingService;

  beforeEach(async () => {
    const mockErrorHandlingService = {
      error: new BehaviorSubject<string>(''),
    };
    await TestBed.configureTestingModule({
      imports: [ErrorAlertComponent],
      providers: [
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ErrorAlertComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;

    errorHandlingService = TestBed.inject(ErrorHandlingService);
    componentRef.setInput('alertText', 'Test Error Message');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have an input bound to alertText', () => {
    expect(component.alertText()).toBe('Test Error Message');
  });

  it('should call errorService to clear the error when closeAlert is called', () => {
    const spy = spyOn(errorHandlingService.error, 'next');

    component.closeAlert();

    expect(spy).toHaveBeenCalledWith('');
  });

  it('should update the error BehaviorSubject when closeAlert is called', () => {
    errorHandlingService.error.next('Some error message');

    component.closeAlert();

    errorHandlingService.error.subscribe((error) => {
      expect(error).toBe('');
    });
  });
});
