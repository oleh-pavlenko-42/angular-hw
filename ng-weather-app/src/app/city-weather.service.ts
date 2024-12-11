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

  citiesSubject = new BehaviorSubject<City[]>([]);
  cities: City[] = [];

  constructor() {
    const citiesItem = localStorage.getItem('cities');
    if (citiesItem) {
      this.cities = [...JSON.parse(citiesItem)];
      this.citiesSubject.next([...this.cities]);
    }
  }

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

  addCityToDashboard(city: City): void | false {
    if (
      !this.cities.filter((cityItem: City) => cityItem.id === city.id).length
    ) {
      const newCities = [...this.cities, city];
      this.cities = [...newCities];
      this.citiesSubject.next([...newCities]);
      localStorage.setItem('cities', JSON.stringify([...newCities]));
    }
  }

  getCityWeather(city: City): Observable<CityWeather> {
    console.log('getCityWeather', city);
    const { lat, lon } = city;
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${environment.apiKey}&units=metric`;
    return this.httpClient.get<CityWeatherResponse>(url).pipe(
      map((response) => {
        const newCityWeather: CityWeather = {
          id: city.id,
          city: city.name,
          state: city.state,
          country: city.country,
          temperature: `${response.main.temp}℃`,
          weather: response.weather.map((weather) => ({
            src: weather.icon,
            alt: weather.main,
          })),
          lon: response.coord.lon,
          lat: response.coord.lat,
        };
        return newCityWeather;
      })
    );
  }

  removeCityFromDashboard(cityToRemove: City): void {
    this.cities = this.cities.filter((city) => cityToRemove.id !== city.id);
    this.citiesSubject.next([...this.cities]);
    localStorage.setItem('cities', JSON.stringify([...this.cities]));
  }
}
