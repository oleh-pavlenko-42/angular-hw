import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CitySearchComponent } from './city-search/city-search.component';
import { CityWeatherListComponent } from './city-weather-list/city-weather-list.component';

@Component({
  selector: 'app-root',
  imports: [CitySearchComponent, CityWeatherListComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-weather-app';
}
