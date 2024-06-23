import { useState, useEffect } from 'react';
import axios from 'axios';

const api_key = import.meta.env.VITE_SOME_KEY;

const SearchForm = ({ search, handleSearchChange }) => {
  return (
    <div>
      find countries:{' '}
      <input type="text" value={search} onChange={handleSearchChange} />
    </div>
  );
};

const App = () => {
  const [search, setSearch] = useState('');
  const [country, setCountry] = useState(null);
  const [allCountries, setAllCountries] = useState([]);
  const [countryNames, setCountryNames] = useState([]);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then((response) => response.data)
      .then((countriesArray) => {
        setAllCountries(countriesArray.map((elem) => elem.name));
      });
  }, []);

  const handleSearchChange = (event) => {
    const new_search = event.target.value;
    setSearch(new_search);
    axios
      .get(
        'https://studies.cs.helsinki.fi/restcountries' +
          `/api/name/${new_search}`
      )
      .then((response) => {
        setCountry({
          name: response.data.name.common,
          capital: response.data.capital,
          area: response.data.area,
          languages: response.data.languages,
          flags: response.data.flags,
        });
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${response.data.latlng[0]}&lon=${response.data.latlng[1]}&appid=${api_key}&units=metric`
          )
          .then((response) => {
            setWeather({
              temp: response.data.main.temp,
              wind_speed: response.data.wind.speed,
              icon: response.data.weather[0].icon,
            });
          });
      })
      .catch((error) => {
        const new_country_names = allCountries.filter(
          (country) =>
            country.official.toLowerCase().indexOf(new_search) >= 0 ||
            country.common.toLowerCase().indexOf(new_search) >= 0
        );
        setCountryNames(new_country_names);
        if (new_country_names.length === 1) {
          axios
            .get(
              'https://studies.cs.helsinki.fi/restcountries' +
                `/api/name/${new_country_names[0].common}`
            )
            .then((response) => {
              setCountry({
                name: response.data.name.common,
                capital: response.data.capital,
                area: response.data.area,
                languages: response.data.languages,
                flags: response.data.flags,
              });
              axios
                .get(
                  `https://api.openweathermap.org/data/2.5/weather?lat=${response.data.latlng[0]}&lon=${response.data.latlng[1]}&appid=${api_key}&units=metric`
                )
                .then((response) => {
                  console.log(response.data.weather[0].icon);

                  setWeather({
                    temp: response.data.main.temp,
                    wind_speed: response.data.wind.speed,
                    icon: response.data.weather[0].icon,
                  });
                });
            });
        } else {
          console.log('moi moi');
          setCountry(null);
        }
      });
  };

  const showCountry = (name) => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries' + `/api/name/${name}`)
      .then((response) => {
        setCountry({
          name: response.data.name.common,
          capital: response.data.capital,
          area: response.data.area,
          languages: response.data.languages,
          flags: response.data.flags,
        });
        axios
          .get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${response.data.latlng[0]}&lon=${response.data.latlng[1]}&appid=${api_key}&units=metric`
          )
          .then((response) => {
            setWeather({
              temp: response.data.main.temp,
              wind_speed: response.data.wind.speed,
              icon: response.data.weather[0].icon,
            });
          });
      })
      .catch((error) => {
        console.log('moi');
      });
  };

  return (
    <>
      <SearchForm search={search} handleSearchChange={handleSearchChange} />
      {country ? (
        <div>
          <h2>{country.name}</h2>
          <div>capital: {country.capital}</div>
          <div>area: {country.area}</div>
          <div>
            <b>languages:</b>
          </div>
          <ul>
            {Object.values(country.languages).map((el) => (
              <li key={el}>{el}</li>
            ))}
          </ul>
          <img src={country.flags.png} alt={country.flags.alt} />
          {weather ? (
            <>
              <h1>Weather in {country.capital}</h1>
              <div>
                temperature {weather.temp} <b>Celcius</b>
              </div>
              <img
                src={`https://openweathermap.org/img/wn/${weather.icon}.png`}
                alt="weather icon"
              />
              <div>wind {weather.wind_speed} m/s</div>
            </>
          ) : null}
        </div>
      ) : (
        <>
          <ul>
            {countryNames.length > 10
              ? 'Too many matches, specify another filter'
              : countryNames.map((country) => (
                  <div key={country.common}>
                    <li>
                      {country.common + ' '}
                      <button onClick={() => showCountry(country.common)}>
                        show
                      </button>
                    </li>
                  </div>
                ))}
          </ul>
        </>
      )}
    </>
  );
};

export default App;
