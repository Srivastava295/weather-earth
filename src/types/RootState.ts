// [IMPORT NEW CONTAINER-STATE ABOVE] < Needed for generating containers seamlessly

/* 
  Because the redux-injectors injects your reducers asynchronously somewhere in your code
  You have to declare them here manually
*/
import { WeatherState } from '../app/types/WeatherState';

export interface RootState {
  weatherState?: WeatherState;
  // [INSERT NEW REDUCER KEY ABOVE] < Needed for generating containers seamlessly
}
