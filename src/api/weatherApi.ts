const WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=51.5074&longitude=-0.1278&current=temperature_2m,relative_humidity_2m,weather_code";

export async function fetchLondonWeather() {
  const response = await fetch(WEATHER_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch London weather");
  }

  return response.json();
}

export function getWeatherDescription(code: number): string {
  const weatherDescriptions: Record<number, string> = {
    0: "Clear sky",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Depositing rime fog",
    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Dense drizzle",
    61: "Slight rain",
    63: "Moderate rain",
    65: "Heavy rain",
    71: "Slight snow",
    73: "Moderate snow",
    75: "Heavy snow",
    80: "Slight rain showers",
    81: "Moderate rain showers",
    82: "Violent rain showers",
    95: "Thunderstorm",
    96: "Thunderstorm with hail",
    99: "Thunderstorm with heavy hail",
  };

  return weatherDescriptions[code] ?? "Unknown conditions";
}
