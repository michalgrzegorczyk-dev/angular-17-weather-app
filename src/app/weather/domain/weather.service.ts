import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, forkJoin, Observable, BehaviorSubject,} from 'rxjs';
import {Weather} from "../models/weather.model";
import {City} from "../models/city.model";
import {ForecastResponse} from "../models/weather.dto";
import {Temperature} from "../../shared/temperature-converter.pipe";

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  private readonly http = inject(HttpClient);
  private readonly apiKey = '';
  private readonly baseUrl = 'https://api.openweathermap.org/data/2.5/';

  readonly allCities$ = new BehaviorSubject<City[]>([
    {name: "Lodz", id: "3093133"},
    {name: "Warsaw", id: "756135"},
    {name: "Berlin", id: "2950159"},
    {name: "New York", id: "5128581"},
    {name: "London", id: "2643743"}
  ]);

  getWeather(cityId: string): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(`${this.baseUrl}forecast?id=${cityId}&appid=${this.apiKey}`);
  }

  getWeatherForCities(cities: City[]): Observable<Weather[]> {
    return forkJoin(
      cities.map(city => this.getWeather(city.id).pipe(
          map((data: ForecastResponse) => this.convertToCurrentWeather(data, city))
        )
      )
    );
  }

  private convertToCurrentWeather(data: ForecastResponse, city: City): Weather {
    if (!data.list[0] || !data.list[0].main || !data.list[0].weather[0]) {
      throw new Error('Invalid data structure');
    }

    return {
      temperature: {
        value: data.list[0].main.temp,
        unit: Temperature.Kelvin,
        icon: `http://openweathermap.org/img/w/${data.list[0].weather[0].icon}.png`,
        description: data.list[0].weather[0].description,
      },
      city: {
        id: city.id,
        name: city.name,
      },
    };
  }
}
