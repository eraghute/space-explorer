import { useQuery } from "@tanstack/react-query";
import { fetchLondonWeather, getWeatherDescription } from "../api/weatherApi";

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

            <p className="mt-3 mb-1">
              Temperature: {weather.current.temperature_2m}°C
            </p>

            <p className="mt-3 mb-1">
              Humidity: {weather.current.relative_humidity_2m}%
            </p>
            <p className="mt-3 mb-1">
              Condition: {getWeatherDescription(weather.current.weather_code)}
            </p>

            <p className="mt-3 mb-1">
              Reading time:{" "}
              {new Date(weather.current.time).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </p>
          </div>
        </div>
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
