import * as qs from 'qs';
import { PathLike } from 'fs';

export const apiConfig = {
  returnRejectedPromiseOnError: true,
  withCredentials: true,
  timeout: 30000,
  baseURL: 'https://api.openweathermap.org/data/2.5',
  /*headers: {
    common: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Accept: 'application/json',
    },
  },*/
  paramsSerializer: (params: PathLike) =>
    qs.stringify(params, { indices: false }),
};
