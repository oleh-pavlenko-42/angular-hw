import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { City, CityResponse } from './city-search/city.model';
import { HttpClient } from '@angular/common/http';
import {
  CityWeather,
  CityWeatherResponse,
} from './city-weather-response.model';
import { environment } from '../environment/environment';

@Injectable({ providedIn: 'root' })
export class CityWeatherService {
  private httpClient = inject(HttpClient);

  cities = new BehaviorSubject<CityWeather[]>([]);

  getCities(cityName: string): Observable<City[]> {
    return this.httpClient
      .get<CityResponse[]>(
        `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=${environment.apiKey}`
      )
      .pipe(
        map((values: CityResponse[]) => {
          return values.map((value: CityResponse) => {
            return {
              id: `${value.name}-${value.state}-${value.country}-${value.lon}-${value.lat}`,
              name: value.name,
              state: value.state,
              country: value.country,
              lat: value.lat,
              lon: value.lon,
            };
          });
        })
      );
  }

  getCityWeather(city: City): void {
    const { lat, lon } = city;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.apiKey}`;
    this.httpClient.get<CityWeatherResponse>(url).subscribe((response) => {
      this.cities.subscribe((cities) => {
        const newCityWeather: CityWeather = {
          city: city.name,
          state: city.state,
          country: city.country,
          temperature: response.main.temp,
          weather: response.weather.map((weather) => weather.icon),
          lon: response.coord.lon,
          lat: response.coord.lat,
        };
        const newCitiesWeather = [...cities, newCityWeather];
        this.cities.next(newCitiesWeather);
      });
    });
  }
}
