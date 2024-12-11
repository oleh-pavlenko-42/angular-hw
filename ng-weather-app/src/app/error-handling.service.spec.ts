import { TestBed } from '@angular/core/testing';
import { ErrorHandlingService } from './error-handling.service';

describe('ErrorHandlingService', () => {
  let service: ErrorHandlingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ErrorHandlingService],
    });
    service = TestBed.inject(ErrorHandlingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have an initial empty error value', () => {
    service.error.subscribe((error) => {
      expect(error).toBe('');
    });
  });

  it('should update the error value', () => {
    const newError = 'An error occurred';

    service.error.next(newError);

    service.error.subscribe((error) => {
      expect(error).toBe(newError);
    });
  });

  it('should notify subscribers when the error value changes', (done) => {
    const newError = 'New error occurred';

    service.error.subscribe((error) => {
      if (error === newError) {
        expect(error).toBe(newError);
        done();
      }
    });

    service.error.next(newError);
  });
});
