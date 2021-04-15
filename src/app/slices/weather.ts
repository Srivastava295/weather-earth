import { WeatherState } from '../types/WeatherState';
import { createSlice } from 'utils/@reduxjs/toolkit';
import { useInjectReducer, useInjectSaga } from 'utils/redux-injectors';
import { PayloadAction } from '@reduxjs/toolkit';
import IWeatherModel, { IWeatherForecast } from '../models/weather';
import weatherWatcher from '../sagas/weatherSaga';

const name = 'weatherState';

const initialState: WeatherState = {
  location: '',
  weather: {},
  weatherForecast: [],
  isLoading: false,
};

export const weatherSlice = createSlice({
  name,
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setCoords: (
      state,
      action: PayloadAction<{ lat: number; lon: number; loading: boolean }>,
    ) => {
      state.isLoading = action.payload.loading;
    },
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload;
    },
    setWeather: (state, action: PayloadAction<IWeatherModel>) => {
      state.weather = action.payload;
    },
    setWeatherForecast: (state, action: PayloadAction<IWeatherForecast>) => {
      state.weatherForecast.push(action.payload);
    },
  },
});

export const { actions: weatherActions, reducer } = weatherSlice;

export const useWeatherSlice = () => {
  useInjectReducer({ key: weatherSlice.name, reducer: weatherSlice.reducer });
  useInjectSaga({ key: weatherSlice.name, saga: weatherWatcher });
  return { actions: weatherSlice.actions };
};
