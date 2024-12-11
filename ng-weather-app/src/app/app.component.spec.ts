import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { CityWeatherService } from './city-weather.service';
import { BehaviorSubject } from 'rxjs';
import { City } from './city-search/city.model';

describe('AppComponent', () => {
  let app: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let cityWeatherService: jasmine.SpyObj<CityWeatherService>;
  beforeEach(async () => {
    cityWeatherService = jasmine.createSpyObj('CityWeatherService', [
      'citiesSubject',
      'getCityWeather',
    ]);
    cityWeatherService.citiesSubject = new BehaviorSubject<City[]>([]);
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: CityWeatherService, useValue: cityWeatherService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
});
