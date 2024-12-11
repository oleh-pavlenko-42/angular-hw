import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CityWeatherService } from './city-weather.service';
import { BehaviorSubject } from 'rxjs';
import { City } from './city-search/city.model';
import { ErrorHandlingService } from './error-handling.service';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let cityWeatherService: jasmine.SpyObj<CityWeatherService>;
  let errorHandlingService: ErrorHandlingService;

  beforeEach(async () => {
    const mockErrorHandlingService = {
      error: new BehaviorSubject<string>(''),
    };
    cityWeatherService = jasmine.createSpyObj('CityWeatherService', [
      'citiesSubject',
      'getCityWeather',
    ]);
    cityWeatherService.citiesSubject = new BehaviorSubject<City[]>([]);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: CityWeatherService, useValue: cityWeatherService },
        { provide: ErrorHandlingService, useValue: mockErrorHandlingService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    errorHandlingService = TestBed.inject(ErrorHandlingService);

    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  it('should update the error signal when errorService emits a new error message', () => {
    const newErrorMessage = 'An error occurred';

    errorHandlingService.error.next(newErrorMessage);
    expect(app.error()).toBe(newErrorMessage);
  });
});
