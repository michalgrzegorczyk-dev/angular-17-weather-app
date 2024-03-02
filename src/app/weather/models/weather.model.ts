import {Temperature} from "../../shared/temperature-converter.pipe";

export interface Weather {
  city: {
    id: string;
    name: string;
  };
  temperature: {
    value: number;
    unit: Temperature;
    icon: string;
    description:string;
  }
}
