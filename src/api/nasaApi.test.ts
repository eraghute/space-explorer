import { describe, it, expect, vi } from "vitest";
import { fetchImageByDate } from "./nasaApi";

describe("fetchImageByDate", () => {
  const mockResponse = [
    {
      date: "2026-10-16",

      title: "Chasing the International Space Station",
      media_type: "video",
      explanation:
        '<strong>Explanation:</strong> <a href="https://www.nasa.gov/news-release/nasa-science-cargo-launch-on-35th-spacex-resupply-mission-to-station/">Blasting into the predawn sky</a> on Tuesday, October 13, a Falcon 9 rocket and Dragon spacecraft are headed for <a href="https://www.nasa.gov/missions/station/iss-research/observing-our-planet-from-low-earth-orbit/">low Earth orbit</a> in this stunning timelapse video captured from Indian Harbour Beach, Florida. Starting with a launch from Space Launch Complex 40 at Cape Canaveral Space Force Station, Falcon and Dragon are chasing the <a href="https://www.nasa.gov/international-space-station/">International Space Station</a> on NASA\'s 35th Commercial Resupply Services mission. On cue, the space station itself enters the frame from the top. Almost 8 seconds into the 30 second timelapse. the bright streak of the ISS appears heading "down" toward the horizon. The first and second stages of the Falcon 9 are separating as the spectacular exhaust plume jellyfish grows, already catching the light of the rising Sun. The visible sequence of first stage boost back, re-entry, and landing burns begins around 20 seconds into the video. With the second stage following the ISS toward the distant horizon, <a href="https://science.nasa.gov/image-article/apod-2026-march-19-launch-plume-spacex-jellyfish/">the jellyfish plume</a> continues to drift in the predawn sky, even after the successful first stage landing at planet Earth\'s Landing Zone 40.<br><br><strong>Tomorrow\'s picture: </strong>pixels in space',
      credit:
        '<a href="https://www.youtube.com/user/eric72holland">Eric Holland</a>',
      alt: "Video of a rocket launch in dark,  predawn skies as seen from the beach..",
      url: "https://science.nasa.gov/image-article/apod-2026-october-16-chasing-the-international-space-station/",
    },
    {
      date: "2026-10-15",

      title: "The Milky Way over Manhattan",
      media_type: "image",
      explanation:
        '<strong>Explanation:</strong> The <a href="https://science.nasa.gov/image-article/apod-2022-november-12-eclipse-in-the-city/">city lights</a> outshine the stars in the <a href="https://en.wikipedia.org/wiki/The_City_That_Never_Sleeps_(nickname)">City That Never Sleeps</a>. Who would have thought that the <a href="https://science.nasa.gov/image-article/apod-2025-august-2-fireflies-meteors-and-milky-way/">Milky Way</a> could be visible in this sky? This <a href="https://www.instagram.com/p/DeNUSc7u_KQ/">image</a> was taken with a filter that blocks most <a href="https://science.nasa.gov/ems/09_visiblelight/">visible light</a>, capturing instead only light in the near-<a href="https://science.nasa.gov/ems/07_infraredwaves/">infrared</a> region of the <a href="https://science.nasa.gov/ems/01_intro/">electromagnetic spectrum</a> (with lower energy than visible light). The astrophotographer\'s <a href="https://petapixel.com/2026/10/07/photographer-captures-the-milky-way-over-manhattan-despite-the-light-pollution/">clever setup</a> blocks most of the <a href="https://science.nasa.gov/image-article/apod-2026-june-26-milky-way-urban-style/">light pollution</a> from the city: old <a href="https://scienceinschool.org/article/2015/starlight-inside-light-bulb/">incandescent light bulbs</a> and some <a href="https://www.youtube.com/watch?v=ok__l1Acuwg">neon lights</a> are still <a href="https://www.researchgate.net/figure/Spectrum-of-the-near-infrared-band-of-a-neon-lamp-detected-by-a-commercial-spectrometer_fig2_302915423">bright</a> in the near-infrared, but <a href="https://science.nasa.gov/asset/webb/spectrum-of-a-fluorescent-light-bulb-vs-spectrum-of-the-sun/">fluorescent</a> and <a href="https://www.researchgate.net/figure/Emission-spectra-of-different-light-sources-a-incandescent-tungsten-light-bulb-b_fig1_312320039">LED</a> light bulbs are not. Of course, <a href="https://science.nasa.gov/universe/stars/">stars</a> are also bright in the near-infrared! This image is a reminder that we all live <a href="https://iauarchive.eso.org/news/announcements/detail/ann20019/">under the same sky</a>, and astronomy allows all of us to learn more about <a href="https://www.youtube.com/watch?v=uLu1cTKBspI">humanity\'s place in the Cosmos</a>. <br><br><strong>Tomorrow\'s picture: </strong>Chasing the ISS',
      credit:
        '<a href="https://www.instagram.com/frozen.spectrum/">Jason Kurth</a>, <a href="https://www.instagram.com/tmbucksley/?hl=en">Ty Buckley</a>',
      alt: "A black and white view of the Manhattan skyline merges into a night sky with stars and a visible, though faint, Milky Way. Please see explanation for more details.",
      url: "https://science.nasa.gov/image-article/apod-2026-october-15-the-milky-way-over-manhattan/",
    },
  ];
  it("returns image data when the API request succeeds", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      }),
    );

    const result = await fetchImageByDate("2026-10-16");

    expect(result).toEqual(mockResponse[0]);
    expect(result).not.toEqual(mockResponse[1]);
  });

  it("returns error when the API request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
      }),
    );
    await expect(fetchImageByDate("2026-10-16")).rejects.toThrow(
      "Failed to fetch NASA image",
    );
  });

  it("returns error when the API request doesn't have matching record for the expected date", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(mockResponse),
      }),
    );
    await expect(fetchImageByDate("2026-10-06")).rejects.toThrow(
      "No NASA image found for 2026-10-06",
    );
  });
});
