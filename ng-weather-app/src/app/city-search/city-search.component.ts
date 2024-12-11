import {
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounceTime, filter, map } from 'rxjs';

import { City } from './city.model';
import { CityWeatherService } from '../city-weather.service';

@Component({
  selector: 'app-city-search',
  imports: [FormsModule],
  standalone: true,
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.scss',
})
export class CitySearchComponent implements OnInit {
  private cityWeatherServie = inject(CityWeatherService);
  private destroyRef = inject(DestroyRef);

  form = viewChild<NgForm>('form');

  citySearchVariants = signal<City[]>([]);

  ngOnInit(): void {
    const geoSub = this.form()
      ?.valueChanges?.pipe(
        debounceTime(250),
        filter((value) => value.city.length >= 3),
        map((value) => value.city)
      )
      .subscribe((value) => {
        this.cityWeatherServie.getCities(value).subscribe((values: City[]) => {
          this.citySearchVariants.set(values);
        });
      });
    this.destroyRef.onDestroy(() => {
      geoSub?.unsubscribe();
    });
  }

  addCityToDashboard(city: City): void {
    this.cityWeatherServie.addCityToDashboard(city);
    this.form()?.setValue({ city: '' });
    this.citySearchVariants.set([]);
  }
}
