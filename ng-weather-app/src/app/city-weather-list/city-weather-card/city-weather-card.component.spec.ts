import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityWeatherCardComponent } from './city-weather-card.component';
import { CityWeatherService } from '../../city-weather.service';
import { City } from '../../city-search/city.model';
import { CityWeather } from '../../city-weather-response.model';
import { of } from 'rxjs';
import { ComponentRef } from '@angular/core';

describe('CityWeatherCardComponent', () => {
  let component: CityWeatherCardComponent;
  let fixture: ComponentFixture<CityWeatherCardComponent>;
  let componentRef: ComponentRef<CityWeatherCardComponent>;
  let cityWeatherService: jasmine.SpyObj<CityWeatherService>;
  let mockCity: City;
  let mockCityWeather: CityWeather;

  beforeEach(async () => {
    cityWeatherService = jasmine.createSpyObj('CityWeatherService', [
      'getCityWeather',
      'removeCityFromDashboard',
    ]);
    mockCity = { name: 'New York', id: '1' } as City; // example city
    mockCityWeather = {
      id: '1',
      city: 'MockCity',
      state: 'MockState',
      country: 'MockCountry',
      weather: [{ src: '10d', alt: 'light rain' }],
      temperature: '20',
      lon: 0,
      lat: 0,
    };

    await TestBed.configureTestingModule({
      imports: [CityWeatherCardComponent],
      providers: [
        { provide: CityWeatherService, useValue: cityWeatherService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CityWeatherCardComponent);
    component = fixture.componentInstance;
    componentRef = fixture.componentRef;
    componentRef.setInput('city', mockCity);
  });

  it('should create', () => {
    const cityWeatherObservable = of(mockCityWeather);
    cityWeatherService.getCityWeather.and.returnValue(cityWeatherObservable);
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should call getCityWeather on initialization', () => {
    cityWeatherService.getCityWeather.and.returnValue(of(mockCityWeather));

    fixture.detectChanges();

    expect(cityWeatherService.getCityWeather).toHaveBeenCalledWith(mockCity);
  });

  it('should call removeCityFromDashboard when removeFromDashboard is called', () => {
    component.removeFromDashboard(mockCity);
    expect(cityWeatherService.removeCityFromDashboard).toHaveBeenCalledWith(
      mockCity
    );
  });
});
