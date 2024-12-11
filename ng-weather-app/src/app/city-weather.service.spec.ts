import { TestBed } from '@angular/core/testing';
import { CityWeatherService } from './city-weather.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { City } from './city-search/city.model';

describe('CityWeatherService', () => {
  let service: CityWeatherService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('HttpClient', ['get']);
    const mockCities = [
      {
        id: '1-New York-NY-US-40.7128-74.0060',
        name: 'New York',
        state: 'NY',
        country: 'US',
        lat: 40.7128,
        lon: -74.006,
      },
      {
        id: '2-London-ENG-GB-51.5074-0.1278',
        name: 'London',
        state: 'ENG',
        country: 'GB',
        lat: 51.5074,
        lon: -0.1278,
      },
    ];
    localStorage.setItem('cities', JSON.stringify(mockCities));

    TestBed.configureTestingModule({
      providers: [CityWeatherService, { provide: HttpClient, useValue: spy }],
    });
    service = TestBed.inject(CityWeatherService);
    httpClientSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should load cities from localStorage on initialization', () => {
    service.citiesSubject.subscribe((cities) => {
      expect(cities.length).toBe(2);
      expect(cities[0].name).toBe('New York');
    });
  });

  it('should return city list from getCities method', () => {
    const mockResponse = [
      {
        name: 'New York',
        state: 'NY',
        country: 'US',
        lat: 40.7128,
        lon: -74.006,
      },
      {
        name: 'London',
        state: 'ENG',
        country: 'GB',
        lat: 51.5074,
        lon: -0.1278,
      },
    ];

    httpClientSpy.get.and.returnValue(of(mockResponse));

    service.getCities('New').subscribe((cities) => {
      expect(cities.length).toBe(2);
      expect(cities[0].name).toBe('New York');
    });

    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should map response from getCityWeather to CityWeather model', () => {
    const city = {
      id: '1-New York-NY-US-40.7128-74.0060',
      name: 'New York',
      state: 'NY',
      country: 'US',
      lat: 40.7128,
      lon: -74.006,
    };
    const mockWeatherResponse = {
      main: { temp: 22.5 },
      weather: [{ icon: '10d', main: 'Rain' }],
      coord: { lat: 40.7128, lon: -74.006 },
    };

    httpClientSpy.get.and.returnValue(of(mockWeatherResponse));

    service.getCityWeather(city).subscribe((weather) => {
      expect(weather.city).toBe('New York');
      expect(weather.temperature).toBe('22.5℃');
      expect(weather.weather[0].src).toBe('10d');
    });

    expect(httpClientSpy.get).toHaveBeenCalled();
  });

  it('should add city to the dashboard and localStorage', () => {
    const city: City = {
      id: '3-Paris-ILE-FR-48.8566-2.3522',
      name: 'Paris',
      state: 'ILE',
      country: 'FR',
      lat: 48.8566,
      lon: 2.3522,
    };

    service.addCityToDashboard(city);

    service.citiesSubject.subscribe((cities) => {
      expect(cities.length).toBe(3);
      expect(cities[2].name).toBe('Paris');
    });

    const savedCities = JSON.parse(localStorage.getItem('cities')!);
    expect(savedCities.length).toBe(3);
    expect(savedCities[2].name).toBe('Paris');
  });

  it('should not add duplicate city to the dashboard', () => {
    const city: City = {
      id: '3-Paris-ILE-FR-48.8566-2.3522',
      name: 'Paris',
      state: 'ILE',
      country: 'FR',
      lat: 48.8566,
      lon: 2.3522,
    };
    service.addCityToDashboard(city);

    service.addCityToDashboard(city);

    service.citiesSubject.subscribe((cities) => {
      expect(cities.length).toBe(3);
      expect(cities[2].name).toBe('Paris');
    });
  });

  it('should remove city from dashboard and localStorage', () => {
    const city: City = {
      id: '3-Paris-ILE-FR-48.8566-2.3522',
      name: 'Paris',
      state: 'ILE',
      country: 'FR',
      lat: 48.8566,
      lon: 2.3522,
    };
    service.addCityToDashboard(city);

    service.removeCityFromDashboard(city);

    service.citiesSubject.subscribe((cities) => {
      expect(cities.length).toBe(2);
    });

    const savedCities = JSON.parse(localStorage.getItem('cities')!);
    expect(savedCities.length).toBe(2);
  });
});
