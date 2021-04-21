import React, { useEffect, useState } from 'react';
import {
  RiDropFill,
  WiStrongWind,
  WiCloudy,
  RiSearchLine,
} from 'react-icons/all';
import IWeatherModel from '../../models/weather';
import { useWeatherSlice } from '../../slices/weather';
import { useDispatch, useSelector } from 'react-redux';
import {
  // weatherForecastSelector,
  weatherSelector,
} from '../../selectors/weatherSelector';
import '../../assets/css/landing.css';
import initialFigure from '../../assets/images/landing_svgs/inicial.svg';
import rainFigure from '../../assets/images/landing_svgs/rain.svg';
import sunFigure from '../../assets/images/landing_svgs/sun.svg';
import snowFigure from '../../assets/images/landing_svgs/snow.svg';
import thunderFigure from '../../assets/images/landing_svgs/thunder.svg';
import cloudyFigure from '../../assets/images/landing_svgs/cloudy.svg';
import initialIcon from '../../assets/images/icons/04.svg';
import dayBg from '../../assets/images/day_bg.png';
import nightBg from '../../assets/images/night_bg.jpg';
import Thunderstorm from '../../assets/audio/Thunderstorm.mp3';
import RainFalling from '../../assets/audio/RainFalling.mp3';
import SpookyWind from '../../assets/audio/SpookyWind.mp3';
import Snow from '../../assets/audio/Snow.mp3';
import BirdsInForest from '../../assets/audio/BirdsInForest.mp3';
import { capitalizeString } from '../../utils/utils';
import { axiosApi } from '../../utils/axios-utils/axios-api';
import { appId } from '../../constants/app-constants';
import moment from 'moment';
import PlayAudio from './PlayAudio';

interface IWeatherCardProps {
  weather?: IWeatherModel;
}

interface SearchData {
  list: Array<{
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    sys: {
      country: string;
    };
  }>;
}

const Weather: React.FC<IWeatherCardProps> = () => {
  const [place, setPlace] = useState('');
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [results, setResults] = useState<SearchData | any>();
  const { actions } = useWeatherSlice();
  const weather = useSelector(weatherSelector);
  // const weatherForecast = useSelector(weatherForecastSelector);
  const dispatch = useDispatch();

  const getCurrentLocationWeather = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const { latitude, longitude } = position.coords;
      setCoordinates({
        ...coordinates,
        latitude: latitude,
        longitude: longitude,
      });
      dispatch(
        actions.setCoords({ lat: latitude, lon: longitude, loading: true }),
      );
    });
  };

  useEffect(() => {
    if ('geolocation' in navigator) {
      getCurrentLocationWeather();
    } else {
      console.log('Coordinates not available');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actions, dispatch]);

  const handlePlaceChange = event => {
    setPlace(event.currentTarget.value);
    const query = `/find?q=${event.currentTarget.value.trim()}&type=like&sort=population&cnt=30&appid=${appId}`;
    axiosApi.get(query).then(response => {
      setResults(response.data);
    });
  };

  const handleSearch = event => {
    event.preventDefault();
    dispatch(actions.setLoading(true));
    dispatch(actions.setLocation(place));
  };

  let LandingImg;
  let soundUrl;

  const weatherMain =
    weather && weather?.weather
      ? weather?.weather[0].main
      : 'Please choose your location or allow this website to access your location.';

  switch (weatherMain) {
    case 'Clear':
      LandingImg = sunFigure;
      soundUrl = BirdsInForest;
      break;

    case 'Clouds':
      LandingImg = sunFigure;
      break;

    case 'Haze':
      LandingImg = cloudyFigure;
      soundUrl = SpookyWind;
      break;

    case 'Thunderstorm':
      LandingImg = thunderFigure;
      soundUrl = Thunderstorm;
      break;

    case 'Rain':
      LandingImg = rainFigure;
      soundUrl = RainFalling;
      break;

    case 'Drizzle':
      LandingImg = rainFigure;
      break;

    case 'Snow':
      LandingImg = snowFigure;
      soundUrl = Snow;
      break;

    default:
      LandingImg = initialFigure;
      soundUrl = '';
      break;
  }

  const icons = require.context(
    '../../assets/images/icons',
    true,
    /\.(png|jpe?g|svg)$/,
  );
  const paths = icons.keys();
  const images = paths.map(path => icons(path));
  let icon = initialIcon;

  const weatherIcon =
    weather && weather?.weather ? weather?.weather[0].icon : '';

  switch (weatherIcon) {
    case '01d':
      icon = images[0].default;
      break;

    case '01n':
      icon = images[1].default;
      break;

    case '02d':
      icon = images[2].default;
      break;

    case '02n':
      icon = images[3].default;
      break;

    case '03d' || '03n' || '04d' || '04n':
      icon = images[4].default;
      break;

    case '09d':
      icon = images[5].default;
      break;

    case '09n':
      icon = images[6].default;
      break;

    case '10d' || '10n':
      icon = images[7].default;
      break;

    case '11d':
      icon = images[8].default;
      break;

    case '11n':
      icon = images[9].default;
      break;

    case '13d':
      icon = images[10].default;
      break;

    case '13n':
      icon = images[11].default;
      break;

    case '50d':
      icon = images[12].default;
      break;

    case '50n':
      icon = images[13].default;
      break;
  }

  let background = dayBg;

  switch (weatherIcon.slice(2)) {
    case 'n':
      background = nightBg;
  }

  return (
    <>
      <div id="main">
        <div className="background">
          <img src={background} alt="Wallpaper" className="img-background" />
        </div>
        <div className="main-grid">
          <div className="app-name">
            <h3 style={{ color: 'white' }}>Weather Earth</h3>
          </div>
          <div className="content">
            <div className="principal">
              <div className="header">
                <form onSubmit={handleSearch}>
                  <div className="extras">
                    <div
                      className="get-location"
                      onClick={getCurrentLocationWeather}
                    >
                      <span className="get-location-button">My Location</span>
                    </div>
                  </div>

                  <div className="input-wrapper">
                    <input
                      placeholder="Search city..."
                      type="text"
                      name="city"
                      value={place}
                      onChange={handlePlaceChange}
                      className="cityInput"
                      autoComplete="off"
                    />

                    <div className="search-results">
                      {results &&
                        results.list.map(result => {
                          const country = result.sys.country;
                          const flag = `https://raw.githubusercontent.com/hjnilsson/country-flags/master/png100px/${country.toLowerCase()}.png`;

                          return (
                            <div
                              key={result.coord.lat}
                              className="result-item"
                              onClick={() =>
                                actions.setCoords({
                                  lat: coordinates.latitude,
                                  lon: coordinates.longitude,
                                  loading: true,
                                })
                              }
                            >
                              <img
                                className="result-flag"
                                src={flag}
                                alt="Flag"
                              />
                              <p>
                                <span className="result-city">
                                  {result.name}
                                </span>
                                , {country}
                              </p>
                            </div>
                          );
                        })}
                    </div>

                    <button type="submit" className="searchButton">
                      <RiSearchLine />
                    </button>
                  </div>
                </form>
              </div>
              <div className="result">
                <PlayAudio soundUrl={soundUrl} />
                <span className="dateTime">
                  {weather?.main ? moment().format('ddd DD, h:mm A') : ''}
                </span>
                {weather?.main ? (
                  <img src={icon} alt="Climate" className="weather-icon" />
                ) : null}
                <h1 className="temperature">
                  {weather?.main?.temp.toFixed(0)}
                  <span>
                    {weather?.main ? 'ºC' : 'Pick a city to see weather data!'}
                  </span>
                </h1>

                <span className="description">
                  {capitalizeString(
                    String(
                      weather && weather.weather
                        ? weather?.weather[0].description
                        : ':(',
                    ),
                  )}
                </span>

                <span className="local">
                  {`${weather && weather.name ? `${weather.name},` : ''} ${
                    weather && weather.sys ? weather?.sys.country : ''
                  }`}
                  &nbsp;&nbsp;
                  {weather && weather.sys && weather?.sys.country !== '-' && (
                    <img
                      src={`https://raw.githubusercontent.com/hjnilsson/country-flags/master/png100px/${weather?.sys.country.toLowerCase()}.png`}
                      alt="country"
                    />
                  )}
                </span>
              </div>

              <div className="other-results">
                <div className="other">
                  Temp <br />
                  <span>
                    {weather &&
                      weather.main &&
                      weather?.main.feels_like.toFixed(1)}{' '}
                    {weather && weather.main ? 'ºC' : '-'}
                  </span>
                </div>
                <div className="other">
                  Temp min <br />
                  <span>
                    {weather &&
                      weather.main &&
                      weather?.main.temp_min.toFixed(1)}{' '}
                    {weather && weather.main ? 'ºC' : '-'}
                  </span>
                </div>
                <div className="other">
                  Temp max <br />
                  <span>
                    {weather &&
                      weather.main &&
                      weather?.main.temp_max.toFixed(1)}{' '}
                    {weather && weather.main ? 'ºC' : '-'}
                  </span>
                </div>
                <div className="other">
                  Pressure <br />
                  <span>
                    {weather && weather.main && weather?.main.pressure}
                    {weather && weather.main ? ' hPa' : '-'}
                  </span>
                </div>
              </div>
            </div>

            <div className="secondary">
              <div className="secondary-results">
                <div className="other-secondary-results">
                  <div className="icon-secondary-results humidity">
                    <RiDropFill />
                  </div>
                  <p>
                    Humidity <br />
                    {weather?.main?.humidity}
                    {weather && weather.main ? '%' : ' -'}
                  </p>
                </div>

                <div className="other-secondary-results">
                  <div className="icon-secondary-results">
                    <WiStrongWind />
                  </div>
                  <p>
                    Wind <br />
                    {weather &&
                      weather.wind &&
                      weather?.wind.speed.toFixed(1)}{' '}
                    {weather && weather.main ? 'm/s' : ' -'}
                  </p>
                </div>

                <div className="other-secondary-results">
                  <div className="icon-secondary-results">
                    <WiCloudy />
                  </div>
                  <p>
                    Clouds <br />
                    {weather && weather.clouds && weather.clouds.all}
                    {weather && weather.main ? '%' : ' -'}
                  </p>
                </div>
              </div>
              <div className="landing-figure">
                <img src={LandingImg} alt="Landing" />
              </div>
              {weather?.name !== '-' && (
                <div className="go-maps">
                  <a
                    href={`https://www.google.com/maps/@${
                      weather && weather.coord && weather?.coord.lat
                    },${weather && weather.coord && weather.coord.lon},12z`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Google Maps
                  </a>
                </div>
              )}
            </div>
          </div>{' '}
          {/*content*/}
          <div className="credits">
            by&nbsp;
            <a
              href="https://github.com/Srivastava295"
              target="_blank"
              rel="noopener noreferrer"
            >
              <strong>Srivastava Bodakunti</strong>
            </a>
          </div>
        </div>
      </div>{' '}
    </>
  );
};

export default Weather;
