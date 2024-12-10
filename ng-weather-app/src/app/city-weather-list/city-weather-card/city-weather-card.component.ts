import { Component, computed, inject, input } from '@angular/core';
import { CityWeather } from '../../city-weather-response.model';
import { CityWeatherService } from '../../city-weather.service';

@Component({
  selector: 'app-city-weather-card',
  imports: [],
  standalone: true,
  templateUrl: './city-weather-card.component.html',
  styleUrl: './city-weather-card.component.scss',
})
export class CityWeatherCardComponent {
  cityWeatherService = inject(CityWeatherService);

  city = input.required<CityWeather>();
  weatherImgs = computed(() => {
    return this.city().weather.map((weatherImg) => {
      return `https://openweathermap.org/img/wn/${weatherImg}.png`;
    });
  });

  removeFromDashboard(cityToRemove: CityWeather): void {
    this.cityWeatherService.citiesSubject.subscribe((cities) => {
      const newCities = cities.filter((city) => city.id !== cityToRemove.id);
      this.cityWeatherService.citiesSubject.next(newCities);
    });
  }
}
