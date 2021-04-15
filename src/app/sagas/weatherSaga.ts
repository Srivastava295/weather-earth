import { call, put, takeLatest } from 'redux-saga/effects';
import { weatherActions } from '../slices/weather';
import { PayloadAction } from '@reduxjs/toolkit';
import { axiosApi } from '../utils/axios-utils/axios-api';
import IWeatherModel, { IWeatherForecast } from '../models/weather';
import { appId, units } from '../constants/app-constants';

const weatherWithLocationApi = (action: PayloadAction<any>) => {
  const location = action.payload;
  return axiosApi.get(`/weather?q=${location}&units=${units}&appid=${appId}`);
};

const weatherForecastApi = (action: PayloadAction<any>) => {
  const location = action.payload;
  return axiosApi.get(`/forecast/daily?q=${location}&appid=${appId}`);
};

const weatherWithCoordinatesApi = (
  action: PayloadAction<{ lat: number; lon: number }>,
) => {
  const { lat, lon } = action.payload;
  return axiosApi.get(
    `/weather?lat=${lat}&lon=${lon}&units=${units}&APPID=${appId}`,
  );
};

function* weatherFlowWithLocation(action: PayloadAction<{ place: string }>) {
  yield put(weatherActions.setLoading(true));
  try {
    const weatherResponse = yield call(weatherWithLocationApi, action);
    const weather: IWeatherModel = weatherResponse.data;
    if (weather) {
      yield put(weatherActions.setWeather(weather));
    }
    const weatherForecastResponse = yield call(weatherForecastApi, action);
    const weatherForecast: IWeatherForecast = weatherForecastResponse.data;
    if (weatherForecast) {
      yield put(weatherActions.setWeatherForecast(weatherForecast));
    }
  } catch (error) {
    console.error(error);
  }
  yield put(weatherActions.setLoading(false));
}

export function* weatherFlowWithCoordinates(
  action: PayloadAction<{ lat: number; lon: number }>,
) {
  yield put(weatherActions.setLoading(true));
  try {
    const response = yield call(weatherWithCoordinatesApi, action);
    const weather: IWeatherModel = response.data;
    if (weather && weather.name) {
      yield put(weatherActions.setLocation(weather.name));
      yield put(weatherActions.setWeather(weather));
    }
  } catch (error) {
    console.error(error);
  }
  yield put(weatherActions.setLoading(false));
}

function* weatherWatcher() {
  yield takeLatest(weatherActions.setLocation.type, weatherFlowWithLocation);
  yield takeLatest(weatherActions.setCoords.type, weatherFlowWithCoordinates);
}

export default weatherWatcher;
