import {Pipe, PipeTransform} from '@angular/core';

export enum Temperature {
  Celsius = 'C',
  Fahrenheit = 'F',
  Kelvin = 'K'
}

type ConversionFunction = (value: number) => number;

interface TemperatureConversions {
  [key: string]: Record<Temperature, ConversionFunction>;
}

const temperatureConversions: TemperatureConversions = {
  [Temperature.Celsius]: {
    [Temperature.Celsius]: (value: number) => value,
    [Temperature.Fahrenheit]: (value: number) => (value * 9 / 5) + 32,
    [Temperature.Kelvin]: (value: number) => value + 273.15
  },
  [Temperature.Fahrenheit]: {
    [Temperature.Celsius]: (value: number) => (value - 32) * 5 / 9,
    [Temperature.Fahrenheit]: (value: number) => value,
    [Temperature.Kelvin]: (value: number) => (value + 459.67) * 5 / 9
  },
  [Temperature.Kelvin]: {
    [Temperature.Celsius]: (value: number) => value - 273.15,
    [Temperature.Fahrenheit]: (value: number) => (value * 9 / 5) - 459.67,
    [Temperature.Kelvin]: (value: number) => value
  }
};

@Pipe({
  name: 'temperatureConverter',
  standalone: true
})
export class TemperatureConverterPipe implements PipeTransform {
  transform(value: number, from: Temperature, to: Temperature): string {
    if (isNaN(value)) {
      console.error('Invalid temperature value.');
      return '';
    }

    const conversionFunction = temperatureConversions[from][to];

    if (!conversionFunction) {
      console.error('Invalid temperature unit.');
      return '';
    }

    return `${conversionFunction(value).toFixed(2)} °${to}`;
  }
}
