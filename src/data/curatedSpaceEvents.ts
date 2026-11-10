import type { SpaceEvent } from "../interface/spaceEventModel";

const NASA_SOLAR_ECLIPSES =
  "https://eclipse.gsfc.nasa.gov/SEdecade/SEdecade2021.html";
const NASA_LUNAR_ECLIPSES =
  "https://eclipse.gsfc.nasa.gov/LEdecade/LEdecade2021.html";
const NASA_METEOR_SHOWERS =
  "https://science.nasa.gov/solar-system/meteors-meteorites/meteor-showers/";

function eclipse(
  event: Omit<SpaceEvent, "category" | "confidence" | "sourceAttribution" | "sourceUrl">,
  lunar = false,
): SpaceEvent {
  return {
    ...event,
    category: "eclipse",
    confidence: "confirmed",
    sourceUrl: lunar ? NASA_LUNAR_ECLIPSES : NASA_SOLAR_ECLIPSES,
    sourceAttribution: lunar
      ? "Eclipse predictions by Fred Espenak, NASA GSFC"
      : "Eclipse predictions by Fred Espenak, NASA GSFC",
  };
}

function meteorShower(
  id: string,
  title: string,
  startDate: string,
  endDate: string,
  predictionPeriod: string,
  objects: string[],
): SpaceEvent {
  return {
    id,
    title,
    category: "meteor-shower",
    startDate,
    endDate,
    timeDescription: "Peak night, local dates; no single global peak time",
    summary: `Predicted peak night for the ${title}.`,
    whyInteresting:
      "Earth passes through debris left along a comet's orbit, producing a recurring display of meteors.",
    viewingGuidance:
      "If skies are clear, find a dark location with a wide view of the sky and give your eyes time to adjust. No telescope is needed. The number visible varies with weather, light pollution, moonlight, and the radiant's height.",
    visibility:
      "Potentially visible from many locations after dark; the radiant's altitude and local observing conditions determine the view.",
    visibilityScope: "location-dependent",
    objects,
    confidence: "predicted-peak",
    sourceUrl: NASA_METEOR_SHOWERS,
    sourceAttribution: "NASA Science, Meteor Showers",
    predictionPeriod,
  };
}

export const curatedSpaceEvents: SpaceEvent[] = [
  eclipse(
    {
      id: "solar-eclipse-2026-feb-17",
      title: "Annular Solar Eclipse",
      startDate: "2026-02-17",
      time: "12:13:05",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon passes in front of the Sun; an annular eclipse is predicted along a narrow path in Antarctica.",
      whyInteresting:
        "At greatest eclipse the Moon appears smaller than the Sun, leaving a bright ring around its silhouette along the central path.",
      viewingGuidance:
        "Visibility is limited to the regions listed by NASA. Never look at the Sun without certified solar viewing protection; ordinary sunglasses are not safe.",
      visibility: "Partial phases: southern Argentina and Chile, southern Africa, and Antarctica. Annularity: Antarctica.",
      visibilityScope: "regional",
      objects: ["Sun", "Moon", "Earth"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
      details:
        "The listed time is NASA's predicted instant of greatest eclipse in Terrestrial Dynamical Time (TD), not a local contact time. Local circumstances vary across the visibility region.",
    },
  ),
  eclipse(
    {
      id: "lunar-eclipse-2026-mar-03",
      title: "Total Lunar Eclipse",
      startDate: "2026-03-03",
      time: "11:34:52",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "Earth's shadow covers the Moon during the total phase of this lunar eclipse.",
      whyInteresting:
        "During totality, sunlight filtered through Earth's atmosphere can make the Moon appear coppery or red.",
      viewingGuidance:
        "No special eye protection is needed. The eclipse is visible only where the Moon is above the horizon during its phases.",
      visibility: "Eastern Asia, Australia, the Pacific, and the Americas.",
      visibilityScope: "regional",
      objects: ["Moon", "Earth", "Sun"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
      details:
        "NASA lists the instant of greatest eclipse in Terrestrial Dynamical Time (TD). The listed region is broad; local moonrise, moonset, and phase timing affect what an observer can see.",
    },
    true,
  ),
  eclipse(
    {
      id: "solar-eclipse-2026-aug-12",
      title: "Total Solar Eclipse",
      startDate: "2026-08-12",
      time: "17:47:05",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon completely covers the Sun along a narrow path; a partial eclipse is visible across a wider region.",
      whyInteresting:
        "Observers inside the narrow path can experience a brief total eclipse, while surrounding regions see the Sun partly covered.",
      viewingGuidance:
        "Visibility is limited to the regions listed by NASA. Use certified solar viewers for every partial phase; remove them only during totality when fully inside the path.",
      visibility: "Partial phases: northern North America, western Africa, and Europe. Totality: Arctic, Greenland, Iceland, and Spain.",
      visibilityScope: "regional",
      objects: ["Sun", "Moon", "Earth"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
  ),
  eclipse(
    {
      id: "lunar-eclipse-2026-aug-28",
      title: "Partial Lunar Eclipse",
      startDate: "2026-08-28",
      time: "04:14:04",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "Part of the Moon passes through Earth's dark umbral shadow.",
      whyInteresting:
        "A partial lunar eclipse makes Earth's curved shadow visibly cross the lunar surface.",
      viewingGuidance:
        "No special eye protection is needed. The eclipse can be seen where the Moon is above the horizon during its phases.",
      visibility: "Eastern Pacific, the Americas, Europe, and Africa.",
      visibilityScope: "regional",
      objects: ["Moon", "Earth", "Sun"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
    true,
  ),
  meteorShower(
    "meteor-orionids-2026",
    "Orionid Meteor Shower",
    "2026-10-21",
    "2026-10-22",
    "NASA peak-night guidance for 2026",
    ["Orionids", "Comet 1P/Halley"],
  ),
  meteorShower(
    "meteor-leonids-2026",
    "Leonid Meteor Shower",
    "2026-11-16",
    "2026-11-17",
    "NASA peak-night guidance for 2026",
    ["Leonids", "Comet 55P/Tempel-Tuttle"],
  ),
  meteorShower(
    "meteor-geminids-2026",
    "Geminid Meteor Shower",
    "2026-12-13",
    "2026-12-14",
    "NASA peak-night guidance for 2026",
    ["Geminids", "Asteroid 3200 Phaethon"],
  ),
  meteorShower(
    "meteor-quadrantids-2027",
    "Quadrantid Meteor Shower",
    "2027-01-03",
    "2027-01-04",
    "NASA peak-night guidance for 2027",
    ["Quadrantids"],
  ),
  {
    id: "mars-retrograde-2027",
    title: "Mars Begins Retrograde Motion",
    category: "other",
    startDate: "2027-01-10",
    timeDescription: "Date of event; exact instant varies by source convention",
    summary:
      "Mars appears to reverse its usual eastward path against the background stars as Earth's changing viewpoint catches up with it.",
    whyInteresting:
      "Retrograde motion is an apparent perspective effect caused by the relative orbital motion of Earth and Mars, not a reversal of Mars's orbit.",
    viewingGuidance:
      "Mars is described by the source as a morning-sky object at the start of this apparition. Actual visibility depends on location, horizon, and observing conditions.",
    visibility:
      "The apparent motion is globally observable over time, but the planet's visibility in the sky depends on the observer's location and date.",
    visibilityScope: "location-dependent",
    objects: ["Mars", "Earth"],
    confidence: "approximate",
    sourceUrl: "https://in-the-sky.org/news.php?id=20270110_12_100",
    sourceAttribution:
      "In-The-Sky.org; event circumstances computed with JPL DE440",
    predictionPeriod: "2027 Mars apparition",
  },
  eclipse(
    {
      id: "solar-eclipse-2027-feb-06",
      title: "Annular Solar Eclipse",
      startDate: "2027-02-06",
      time: "16:00:47",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon passes in front of the Sun; an annular eclipse is predicted along a narrow path.",
      whyInteresting:
        "At greatest eclipse the Moon appears smaller than the Sun, leaving a bright ring around its silhouette along the central path.",
      viewingGuidance:
        "Visibility is limited to the regions listed by NASA. Never look at the Sun without certified solar viewing protection; ordinary sunglasses are not safe.",
      visibility: "Partial phases: South America, Antarctica, and western and southern Africa. Annularity: Chile, Argentina, and the Atlantic.",
      visibilityScope: "regional",
      objects: ["Sun", "Moon", "Earth"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
      details:
        "The listed time is the predicted instant of greatest eclipse in Terrestrial Time (TT), not a local contact time. Local circumstances vary across the visibility region.",
    },
  ),
  eclipse(
    {
      id: "lunar-eclipse-2027-feb-20",
      title: "Penumbral Lunar Eclipse",
      startDate: "2027-02-20",
      time: "23:14:06",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon passes through Earth's faint outer penumbral shadow.",
      whyInteresting:
        "Penumbral eclipses are subtle: observers may notice a slight shading across the Moon rather than a sharply darkened section.",
      viewingGuidance:
        "No special eye protection is needed. Visibility depends on whether the Moon is above the horizon during the eclipse.",
      visibility: "The Americas, Europe, Africa, and Asia.",
      visibilityScope: "regional",
      objects: ["Moon", "Earth", "Sun"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
    true,
  ),
  meteorShower(
    "meteor-lyrids-2027",
    "Lyrid Meteor Shower",
    "2027-04-22",
    "2027-04-23",
    "NASA peak-night guidance for 2027",
    ["Lyrids", "Comet C/1861 G1 Thatcher"],
  ),
  meteorShower(
    "meteor-eta-aquariids-2027",
    "Eta Aquariid Meteor Shower",
    "2027-05-05",
    "2027-05-06",
    "NASA peak-night guidance for 2027",
    ["Eta Aquariids", "Comet 1P/Halley"],
  ),
  eclipse(
    {
      id: "lunar-eclipse-2027-jul-18",
      title: "Penumbral Lunar Eclipse",
      startDate: "2027-07-18",
      time: "16:04:09",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon passes through Earth's faint outer penumbral shadow.",
      whyInteresting:
        "Penumbral eclipses are subtle: observers may notice a slight shading across the Moon rather than a sharply darkened section.",
      viewingGuidance:
        "No special eye protection is needed. Visibility depends on whether the Moon is above the horizon during the eclipse.",
      visibility: "Eastern Africa, Asia, Australia, and the Pacific.",
      visibilityScope: "regional",
      objects: ["Moon", "Earth", "Sun"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
    true,
  ),
  meteorShower(
    "meteor-perseids-2027",
    "Perseid Meteor Shower",
    "2027-08-12",
    "2027-08-13",
    "NASA peak-night guidance for 2027",
    ["Perseids", "Comet 109P/Swift-Tuttle"],
  ),
  eclipse(
    {
      id: "solar-eclipse-2027-aug-02",
      title: "Total Solar Eclipse",
      startDate: "2027-08-02",
      time: "10:07:49",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon completely covers the Sun along a narrow path; a partial eclipse is visible across a wider region.",
      whyInteresting:
        "The path of totality crosses several countries, while observers outside it may see a partial eclipse.",
      viewingGuidance:
        "Visibility is limited to the regions listed by NASA. Use certified solar viewers for every partial phase; remove them only during totality when fully inside the path.",
      visibility: "Partial phases: Africa, Europe, the Middle East, and western and southern Asia. Totality: Morocco, Spain, Algeria, Libya, Egypt, Saudi Arabia, Yemen, and Somalia.",
      visibilityScope: "regional",
      objects: ["Sun", "Moon", "Earth"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
  ),
  eclipse(
    {
      id: "lunar-eclipse-2027-aug-17",
      title: "Penumbral Lunar Eclipse",
      startDate: "2027-08-17",
      time: "07:14:59",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon passes through Earth's faint outer penumbral shadow.",
      whyInteresting:
        "Penumbral eclipses are subtle: observers may notice a slight shading across the Moon rather than a sharply darkened section.",
      viewingGuidance:
        "No special eye protection is needed. Visibility depends on whether the Moon is above the horizon during the eclipse.",
      visibility: "The Pacific and the Americas.",
      visibilityScope: "regional",
      objects: ["Moon", "Earth", "Sun"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
    true,
  ),
  eclipse(
    {
      id: "solar-eclipse-2028-jan-26",
      title: "Annular Solar Eclipse",
      startDate: "2028-01-26",
      time: "15:08:58",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon passes in front of the Sun; an annular eclipse is predicted along a narrow path.",
      whyInteresting:
        "At greatest eclipse the Moon appears smaller than the Sun, leaving a bright ring around its silhouette along the central path.",
      viewingGuidance:
        "Visibility is limited to the regions listed by NASA. Never look at the Sun without certified solar viewing protection; ordinary sunglasses are not safe.",
      visibility: "Partial phases: eastern North America, Central and South America, western Europe, and northwestern Africa. Annularity: Ecuador, Peru, Brazil, Suriname, Spain, and Portugal.",
      visibilityScope: "regional",
      objects: ["Sun", "Moon", "Earth"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
  ),
  eclipse(
    {
      id: "lunar-eclipse-2028-jan-12",
      title: "Partial Lunar Eclipse",
      startDate: "2028-01-12",
      time: "04:14:13",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "Part of the Moon passes through Earth's dark umbral shadow.",
      whyInteresting:
        "A partial lunar eclipse makes Earth's curved shadow visibly cross the lunar surface.",
      viewingGuidance:
        "No special eye protection is needed. The eclipse can be seen where the Moon is above the horizon during its phases.",
      visibility: "The Americas, Europe, and Africa.",
      visibilityScope: "regional",
      objects: ["Moon", "Earth", "Sun"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
    true,
  ),
  eclipse(
    {
      id: "lunar-eclipse-2028-jul-06",
      title: "Partial Lunar Eclipse",
      startDate: "2028-07-06",
      time: "18:20:57",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "Part of the Moon passes through Earth's dark umbral shadow.",
      whyInteresting:
        "A partial lunar eclipse makes Earth's curved shadow visibly cross the lunar surface.",
      viewingGuidance:
        "No special eye protection is needed. The eclipse can be seen where the Moon is above the horizon during its phases.",
      visibility: "Europe, Africa, Asia, and Australia.",
      visibilityScope: "regional",
      objects: ["Moon", "Earth", "Sun"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
    true,
  ),
  eclipse(
    {
      id: "solar-eclipse-2028-jul-22",
      title: "Total Solar Eclipse",
      startDate: "2028-07-22",
      time: "02:56:39",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "The Moon completely covers the Sun along a narrow path; a partial eclipse is visible across a wider region.",
      whyInteresting:
        "Observers inside the narrow path can experience a brief total eclipse, while surrounding regions see the Sun partly covered.",
      viewingGuidance:
        "Visibility is limited to the regions listed by NASA. Use certified solar viewers for every partial phase; remove them only during totality when fully inside the path.",
      visibility: "Partial phases: Southeast Asia, the East Indies, Australia, and New Zealand. Totality: Australia and New Zealand.",
      visibilityScope: "regional",
      objects: ["Sun", "Moon", "Earth"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
  ),
  eclipse(
    {
      id: "lunar-eclipse-2028-dec-31",
      title: "Total Lunar Eclipse",
      startDate: "2028-12-31",
      time: "16:53:15",
      timeZoneLabel: "TD (Terrestrial Dynamical Time)",
      summary:
        "Earth's shadow covers the Moon during the total phase of this lunar eclipse.",
      whyInteresting:
        "During totality, sunlight filtered through Earth's atmosphere can make the Moon appear coppery or red.",
      viewingGuidance:
        "No special eye protection is needed. The eclipse is visible only where the Moon is above the horizon during its phases.",
      visibility: "Europe, Africa, Asia, Australia, and the Pacific.",
      visibilityScope: "regional",
      objects: ["Moon", "Earth", "Sun"],
      predictionPeriod: "NASA GSFC eclipse predictions, 2021–2030",
    },
    true,
  ),
];
