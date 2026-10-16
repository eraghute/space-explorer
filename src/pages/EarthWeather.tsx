import { useQuery } from "@tanstack/react-query";
import {
  fetchLondonWeather,
  getWeatherDescription,
  getWeatherIcon,
} from "../api/weatherApi";

function EarthWeather() {
  const {
    data: weather,
    isLoading: isWeatherLoading,
    isFetching: isWeatherFetching,
    isError: isWeatherError,
    error: weatherError,
    refetch: refetchWeather,
  } = useQuery({
    queryKey: ["london-weather"],
    queryFn: fetchLondonWeather,
    // staleTime: 3 * 1000,
    // enabled: false,
  });
  return (
    <div className="container py-4">
      <h1 className="mb-4">Earth Weather</h1>
      <p className="text-secondary">
        Explore current weather conditions and forecasts for locations around
        the world, using data provided by NASA's Earth Science Division.
      </p>
      {/* Current Weather */}
      {isWeatherLoading && <p>Loading London weather...</p>}
      {weather?.current && (
        <div className="container mt-3 weather-card">
          <div>
            <div className="d-flex justify-content-between  align-items-center flex-wrap gap-2">
              <h5 className="mb-0">London Weather</h5>
              <button
                className="btn btn-sm btn-outline-dark refresh-btn"
                onClick={() => refetchWeather()}
                disabled={isWeatherFetching}
              >
                {isWeatherFetching ? "Refreshing..." : "↻ Refresh Weather"}
              </button>
            </div>

            <div className="mt-4">
              <p className="weather-temperature mb-1">
                {weather.current.temperature_2m}°C
              </p>

              <h3 className="weather-condition mb-4">
                <span className="weather-icon me-2">
                  {getWeatherIcon(weather.current.weather_code)}
                </span>
                {getWeatherDescription(weather.current.weather_code)}
              </h3>

              <div className="row g-3">
                <div className="col-12 col-sm-6">
                  <div className="weather-detail">
                    <span className="weather-detail-label">Humidity</span>
                    <p className="mb-0">
                      {weather.current.relative_humidity_2m}%
                    </p>
                  </div>
                </div>

                <div className="col-12 col-sm-6">
                  <div className="weather-detail">
                    <span className="weather-detail-label">Reading time</span>
                    <p className="mb-0">
                      {new Date(weather.current.time).toLocaleString("en-GB", {
                        dateStyle: "medium",
                        timeStyle: "short",
                        timeZone: "Europe/London",
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Hourly forecasts */}

      {weather?.hourly && (
        <section className="mt-4">
          <h2 className="h4 mb-3">Hourly Forecast</h2>

          <div className="hourly-forecast d-flex gap-3 overflow-auto pb-3">
            {weather.hourly.time
              .map((time: string, index: number) => ({
                time,
                temperature: weather.hourly.temperature_2m[index],
                weatherCode: weather.hourly.weather_code[index],
                rainProbability:
                  weather.hourly.precipitation_probability[index],
              }))
              .filter(
                (hour: { time: string }) =>
                  new Date(hour.time).getTime() >= Date.now(),
              )
              .slice(0, 24)
              .map(
                (hour: {
                  time: string;
                  temperature: number;
                  weatherCode: number;
                  rainProbability: number;
                }) => (
                  <div className="hourly-forecast-item" key={hour.time}>
                    <p className="mb-2">
                      {new Date(hour.time).toLocaleTimeString("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                        timeZone: "Europe/London",
                      })}
                    </p>

                    <p className="hourly-temperature mb-2">
                      {Math.round(hour.temperature)}°C
                    </p>

                    <p className="mb-2">
                      <span className="forecast-weather-icon">
                        {getWeatherIcon(hour.weatherCode)}
                      </span>
                    </p>

                    <p className="mb-2">
                      {getWeatherDescription(hour.weatherCode)}
                    </p>

                    <p className="mb-0">☔ {hour.rainProbability ?? 0}%</p>
                  </div>
                ),
              )}
          </div>
        </section>
      )}

      {/* Daily Forecast */}

      {weather?.daily && (
        <section className="mt-5">
          <h2 className="h4 mb-3">10-Day Forecast</h2>

          <div className="daily-forecast">
            {weather.daily.time.map((date: string, index: number) => (
              <div className="daily-forecast-item" key={date}>
                <div className="daily-forecast-date">
                  {new Date(`${date}T12:00:00`).toLocaleDateString("en-GB", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    timeZone: "Europe/London",
                  })}
                </div>

                <div className="daily-forecast-condition">
                  <span className="forecast-weather-icon me-2">
                    {getWeatherIcon(weather.daily.weather_code[index])}
                  </span>
                  {getWeatherDescription(weather.daily.weather_code[index])}
                </div>
                <div className="daily-forecast-temperatures">
                  <span className="daily-high">
                    Max: {Math.round(weather.daily.temperature_2m_max[index])}°
                  </span>
                  <span className="daily-low">
                    Min: {Math.round(weather.daily.temperature_2m_min[index])}°
                  </span>
                </div>

                <div className="daily-forecast-rain">
                  ☔ {weather.daily.precipitation_probability_max[index] ?? 0}%
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {isWeatherError && (
        <div className="container mt-3">
          <div className="alert alert-danger" role="alert">
            {weatherError instanceof Error
              ? weatherError.message
              : "Unable to fetch London weather data."}
          </div>
        </div>
      )}
    </div>
  );
}

export default EarthWeather;
