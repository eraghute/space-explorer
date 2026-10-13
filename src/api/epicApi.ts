import type { EpicImage } from "../interface/epicModel";

const EPIC_URL = "https://epic.gsfc.nasa.gov/api/natural";

export async function fetchEpicImages(): Promise<EpicImage[]> {
  const response = await fetch(EPIC_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch EPIC images");
  }

  return response.json();
}

export function getEpicImageUrl(image: EpicImage): string {
  return `https://api.nasa.gov/EPIC/archive/natural/${image.date.split(" ")[0].replace(/-/g, "/")}/png/${image.image}.png?api_key=DEMO_KEY`;
}
