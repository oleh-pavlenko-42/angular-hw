import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';

import { CitySearchComponent } from './city-search.component';
import { CityWeatherService } from '../city-weather.service';
import { DestroyRef } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { of } from 'rxjs';
import { City } from './city.model';

describe('CitySearchComponent', () => {
  let component: CitySearchComponent;
  let fixture: ComponentFixture<CitySearchComponent>;
  let cityWeatherService: jasmine.SpyObj<CityWeatherService>;
  let destroyRef: jasmine.SpyObj<DestroyRef>;
  let form: NgForm;

  beforeEach(async () => {
    cityWeatherService = jasmine.createSpyObj('CityWeatherService', [
      'getCities',
      'addCityToDashboard',
    ]);
    destroyRef = jasmine.createSpyObj('DestroyRef', ['onDestroy']);

    await TestBed.configureTestingModule({
      imports: [CitySearchComponent, FormsModule],
      providers: [
        { provide: CityWeatherService, useValue: cityWeatherService },
        { provide: DestroyRef, useValue: destroyRef },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    form = component.form() as NgForm;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call getCities when form value changes and city name is 3 characters or more', fakeAsync(() => {
    const cities = [
      { name: 'New York' } as City,
      { name: 'New Jersey' } as City,
    ];
    cityWeatherService.getCities.and.returnValue(of(cities));

    component.ngOnInit();
    form.setValue({ city: 'New' });
    tick(500);
    expect(cityWeatherService.getCities).toHaveBeenCalledWith('New');
    expect(component.citySearchVariants()).toEqual(cities);
  }));

  it('should not call getCities when city name is less than 3 characters', fakeAsync(() => {
    cityWeatherService.getCities.and.returnValue(of([]));

    component.ngOnInit();

    form.setValue({ city: 'Ne' });
    tick(500);
    expect(cityWeatherService.getCities).not.toHaveBeenCalled();
    expect(component.citySearchVariants()).toEqual([]);
  }));

  it('should call addCityToDashboard and reset form when addCityToDashboard is called', () => {
    const city = { name: 'London' } as City;

    component.addCityToDashboard(city);

    expect(cityWeatherService.addCityToDashboard).toHaveBeenCalledWith(city);
    expect(form.value.city).toBe('');
    expect(component.citySearchVariants()).toEqual([]);
  });

  it('should set citySearchVariants to an empty array when city name is less than 3 characters', () => {
    cityWeatherService.getCities.and.returnValue(of([]));

    form.setValue({ city: 'Lo' });

    component.ngOnInit();

    expect(component.citySearchVariants()).toEqual([]);
  });
});
