import {
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CityWeather } from '../../city-weather-response.model';
import { CityWeatherService } from '../../city-weather.service';
import { City } from '../../city-search/city.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-city-weather-card',
  imports: [LoadingSpinnerComponent],
  standalone: true,
  templateUrl: './city-weather-card.component.html',
  styleUrl: './city-weather-card.component.scss',
})
export class CityWeatherCardComponent {
  private cityWeatherService = inject(CityWeatherService);

  isLoading = signal(false);
  city = input.required<City>();
  cityWeahter = signal<CityWeather | null>(null);
  weatherImg = computed(() => {
    if (this.cityWeahter()) {
      return {
        src: `https://openweathermap.org/img/wn/${
          this.cityWeahter()?.weather[0].src
        }.png`,
        alt: this.cityWeahter()?.weather[0].alt,
      };
    }
    return null;
  });

  constructor() {
    effect(() => {
      this.isLoading.set(true);
      this.cityWeatherService
        .getCityWeather(this.city())
        .subscribe((cityWeahter: CityWeather) => {
          this.cityWeahter.set(cityWeahter);
          this.isLoading.set(false);
        });
    });
  }

  removeFromDashboard(cityToRemove: City): void {
    this.cityWeatherService.removeCityFromDashboard(cityToRemove);
  }
}
