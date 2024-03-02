import {Component, input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {AsyncPipe, NgForOf, JsonPipe, NgIf} from "@angular/common";
import {Temperature, TemperatureConverterPipe} from "../../../shared/temperature-converter.pipe";
import {Weather} from "../../models/weather.model";

@Component({
  selector: 'app-weather-list',
  standalone: true,
  imports: [AsyncPipe, NgForOf, TemperatureConverterPipe, JsonPipe, NgIf],
  templateUrl: './weather-list.component.html',
  styleUrl: './weather-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherListComponent {
  readonly weatherList = input<Weather[] | null>([]);
  @Output() readonly weatherClicked = new EventEmitter();

  protected readonly Temperature = Temperature;

  clickWeather(weatherId: string): void {
    this.weatherClicked.emit(weatherId);
  }
}
