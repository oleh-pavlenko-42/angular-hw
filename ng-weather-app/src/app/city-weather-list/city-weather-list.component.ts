import { Component, inject, OnInit } from '@angular/core';
import { CityWeatherService } from '../city-weather.service';
import { CityWeatherCardComponent } from './city-weather-card/city-weather-card.component';
import { City } from '../city-search/city.model';

@Component({
  selector: 'app-city-weather-list',
  imports: [CityWeatherCardComponent],
  standalone: true,
  templateUrl: './city-weather-list.component.html',
  styleUrl: './city-weather-list.component.scss',
})
export class CityWeatherListComponent implements OnInit {
  private cityWeatherService = inject(CityWeatherService);

  cities: City[] = [];

  ngOnInit(): void {
    this.cityWeatherService.citiesSubject.subscribe((cities) => {
      this.cities = cities;
    });
  }
}
