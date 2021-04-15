import * as React from 'react';
import { Helmet } from 'react-helmet-async';
import Weather from './Weather';

export function WeatherPage() {
  return (
    <>
      <Helmet>
        <title>Weather Earth</title>
        <meta name="description" content="Weather Earth" />
      </Helmet>
      <Weather />
    </>
  );
}
