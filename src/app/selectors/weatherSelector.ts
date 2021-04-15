import { RootState } from '../../types';

export const weatherSelector = (state: RootState) =>
  state.weatherState?.weather;

export const weatherForecastSelector = (state: RootState) =>
  state.weatherState?.weatherForecast;

export const loadingSelector = (state: RootState) =>
  state.weatherState?.isLoading;
