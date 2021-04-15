/**
 * Asynchronously loads the component for HomePage
 */

import { lazyLoad } from 'utils/loadable';

export const WeatherPage = lazyLoad(
  () => import('./index'),
  module => module.WeatherPage,
);
