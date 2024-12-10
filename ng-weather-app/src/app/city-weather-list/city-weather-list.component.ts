import { Component, inject, OnInit, signal } from '@angular/core';
import { CityWeather } from '../city-weather-response.model';
import { CityWeatherService } from '../city-weather.service';
import { CityWeatherCardComponent } from './city-weather-card/city-weather-card.component';

@Component({
  selector: 'app-city-weather-list',
  imports: [CityWeatherCardComponent],
  standalone: true,
  templateUrl: './city-weather-list.component.html',
  styleUrl: './city-weather-list.component.scss',
})
export class CityWeatherListComponent implements OnInit {
  private cityWeatherService = inject(CityWeatherService);

  cities = signal<CityWeather[]>([]);

  ngOnInit(): void {
    this.cityWeatherService.citiesSubject.subscribe((cities) => {
      this.cities.set(cities);
    });
  }
}
