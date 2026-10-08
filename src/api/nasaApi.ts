import type { NasaImage } from "../interface/nasaModel";

const APOD_URL =
  "https://science.nasa.gov/wp-json/wp/v2/apod-basic/?api_key=DEMO_KEY";

export async function fetchImageByDate(
  selectedDate: string,
): Promise<NasaImage> {
  const response = await fetch(APOD_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch NASA image");
  }

  const data: NasaImage[] = await response.json();
  const image = data.find((item) => item.date === selectedDate);

  if (!image) {
    throw new Error(`No NASA image found for ${selectedDate}`);
  }
  console.log("NASA API function called");
  return image;
}
