export interface NasaImage {
  date: string;
  title: string;
  explanation: string;
  media_type: "image" | "video";
  hdurl?: string;
  url: string;
  credit?: string;
  alt?: string;
}
