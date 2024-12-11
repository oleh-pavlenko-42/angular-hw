import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CityWeatherListComponent } from './city-weather-list.component';
import { CityWeatherService } from '../city-weather.service';
import { City } from '../city-search/city.model';
import { BehaviorSubject, of } from 'rxjs';
import { CityWeatherCardComponent } from './city-weather-card/city-weather-card.component';

describe('CityWeatherListComponent', () => {
  let component: CityWeatherListComponent;
  let fixture: ComponentFixture<CityWeatherListComponent>;
  let cityWeatherService: jasmine.SpyObj<CityWeatherService>;

  beforeEach(async () => {
    cityWeatherService = jasmine.createSpyObj('CityWeatherService', [
      'citiesSubject',
      'getCityWeather',
    ]);
    const mockCities: City[] = [
      { name: 'New York', id: '1' } as City,
      { name: 'London', id: '2' } as City,
    ];
    const mockCityWeather = {
      id: '1',
      city: 'MockCity',
      state: 'MockState',
      country: 'MockCountry',
      weather: [{ src: '10d', alt: 'light rain' }],
      temperature: '20',
      lon: 0,
      lat: 0,
    };
    cityWeatherService.citiesSubject = new BehaviorSubject(mockCities);
    cityWeatherService.getCityWeather.and.returnValue(of(mockCityWeather));

    await TestBed.configureTestingModule({
      imports: [CityWeatherListComponent],
      providers: [
        { provide: CityWeatherCardComponent, useValue: {} },
        { provide: CityWeatherService, useValue: cityWeatherService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CityWeatherListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should subscribe to citiesSubject and update cities list', () => {
    expect(component.cities.length).toBe(2);
    expect(component.cities[0].name).toBe('New York');
    expect(component.cities[1].name).toBe('London');
  });

  it('should update cities list when new cities are emitted', () => {
    const newCities: City[] = [
      { name: 'Paris', id: '3' } as City,
      { name: 'Tokyo', id: '4' } as City,
    ];
    expect(component.cities[0].name).toBe('New York');
    expect(component.cities[1].name).toBe('London');

    cityWeatherService.citiesSubject.next(newCities);

    expect(component.cities[0].name).toBe('Paris');
    expect(component.cities[1].name).toBe('Tokyo');
  });
});
