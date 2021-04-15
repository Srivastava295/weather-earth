import IWeatherModel, { IWeatherForecast } from '../models/weather';

export interface WeatherState {
  location: string;
  weather: IWeatherModel;
  weatherForecast: IWeatherForecast[];
  isLoading: boolean;
}
