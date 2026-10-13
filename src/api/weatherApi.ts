const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,relative_humidity_2m,weather_code";

export async function fetchLondonWeather() {
  const response = await fetch(WEATHER_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch London weather");
  }

  return response.json();
}
