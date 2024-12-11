import { Component, inject, OnInit, signal } from '@angular/core';
import { CitySearchComponent } from './city-search/city-search.component';
import { CityWeatherListComponent } from './city-weather-list/city-weather-list.component';
import { ErrorAlertComponent } from './shared/error-alert/error-alert.component';
import { ErrorHandlingService } from './error-handling.service';

@Component({
  selector: 'app-root',
  imports: [CitySearchComponent, CityWeatherListComponent, ErrorAlertComponent],
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private errorService = inject(ErrorHandlingService);
  error = signal('');

  ngOnInit(): void {
    this.errorService.error.subscribe((errorMessage) => {
      this.error.set(errorMessage);
    });
  }
}
