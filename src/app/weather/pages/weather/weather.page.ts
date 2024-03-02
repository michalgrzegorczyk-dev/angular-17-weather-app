import {Component, ChangeDetectionStrategy, OnInit, inject, OnDestroy} from '@angular/core';
import {
  map,
  Observable,
  switchMap,
  interval,
  merge,
  withLatestFrom,
  of,
  timer,
  scan,
  concatMap,
  takeUntil,
  Subject,
  share
} from "rxjs";
import {WeatherService} from "../../domain/weather.service";
import {WeatherListComponent} from "../../components/list/weather-list.component";
import {AsyncPipe} from "@angular/common";
import {Weather} from "../../models/weather.model";
import {City} from "../../models/city.model";
import {Action} from "../../models/action.model";
import {getRandomElements} from "../../../shared/utils";

const RANDOM_DATA_INTERVAL = 60_000;
const REFRESH_INTERVAL = 10_000;
const NUMBER_OF_CITIES = 3;

@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [WeatherListComponent, AsyncPipe],
  templateUrl: './weather.page.html',
  styleUrl: './weather.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WeatherPage implements OnInit, OnDestroy {
  data$!: Observable<Weather[]> | null;

  private readonly weatherService = inject(WeatherService);
  private readonly destroyed$ = new Subject<void>();

  ngOnInit(): void {
    const starters$ = merge(
      timer(0, RANDOM_DATA_INTERVAL).pipe(
        withLatestFrom(this.weatherService.allCities$),
        switchMap(([_, allCities]) => of(getRandomElements(allCities, NUMBER_OF_CITIES))),
      ),
      interval(REFRESH_INTERVAL).pipe(map(() => Action.Refresh)),
    ).pipe(takeUntil(this.destroyed$));

    this.data$ = starters$.pipe(
      scan((acc: {
        cities: City[],
        action: Action
      }, val: Action | City[]) => val !== Action.Refresh ? {
        cities: val as City[],
        action: Action.New
      } : {...acc, action: Action.Refresh}, {cities: [], action: Action.Init}),
      concatMap(state => this.weatherService.getWeatherForCities(state.cities)),
      share(),
      takeUntil(this.destroyed$),
    );
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  openDetails(cityId: string): void {
    window.open(`https://openweathermap.org/city/${cityId}`, '_blank');
  }
}
