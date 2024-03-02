import {Component, ChangeDetectionStrategy} from '@angular/core';
import {WeatherPage} from "./weather/pages/weather/weather.page";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeatherPage],
  template: `
    <h1>Weather App</h1>
    <app-weather />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
}
