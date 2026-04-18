import { sanityClient } from './sanityClient';

export type GarminRun = {
  _id: string;
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  total_elevation_gain: number;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;
  average_cadence: number;
  average_temp: number;
  average_watts: number;
  max_watts: number;
  has_heartrate: boolean;
  average_heartrate: number;
  max_heartrate: number;
  elev_high: number;
  elev_low: number;
  start_latlng: [number, number] | null;
  end_latlng: [number, number] | null;
  map: {
    summary_polyline: string;
  };
};

const RUN_FIELDS = `
  _id,
  "id": activityId,
  "name": title,
  "distance": coalesce(distanceMeters, 0),
  "moving_time": coalesce(movingTimeSeconds, 0),
  "total_elevation_gain": coalesce(elevationGainMeters, 0),
  "sport_type": "Run",
  "start_date_local": startDateLocal,
  "average_speed": coalesce(averageSpeed, 0),
  "max_speed": coalesce(maxSpeed, 0),
  "average_cadence": coalesce(averageCadence, 0),
  "average_temp": coalesce(averageTemp, 0),
  "average_watts": coalesce(averageWatts, 0),
  "max_watts": coalesce(maxWatts, 0),
  "has_heartrate": coalesce(hasHeartrate, false),
  "average_heartrate": coalesce(averageHeartrate, 0),
  "max_heartrate": coalesce(maxHeartrate, 0),
  "elev_high": coalesce(elevHigh, 0),
  "elev_low": coalesce(elevLow, 0),
  "start_latlng": select(
    defined(startLocation.lat) && defined(startLocation.lng) => [startLocation.lat, startLocation.lng],
    null
  ),
  "end_latlng": select(
    defined(endLocation.lat) && defined(endLocation.lng) => [endLocation.lat, endLocation.lng],
    null
  ),
  "map": {
    "summary_polyline": coalesce(summaryPolyline, "")
  }
`;

export async function getRuns(): Promise<GarminRun[]> {
  const query = `*[_type == "run"] | order(startDateLocal desc) {${RUN_FIELDS}}`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 60 } });
}

export async function getRecentRuns(limit = 3): Promise<GarminRun[]> {
  const safeLimit = Number.isFinite(limit) ? Math.max(0, Math.floor(limit)) : 3;
  const query = `*[_type == "run"] | order(startDateLocal desc)[0...${safeLimit}] {${RUN_FIELDS}}`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 60 } });
}

export async function getRunById(id: number): Promise<GarminRun | null> {
  const query = `*[_type == "run" && activityId == $id][0] {${RUN_FIELDS}}`;
  return sanityClient.fetch(query, { id }, { next: { revalidate: 60 } });
}

export async function getRunIds(): Promise<number[]> {
  const query = `*[_type == "run" && defined(activityId)] | order(startDateLocal desc).activityId`;
  return sanityClient.fetch(query, {}, { next: { revalidate: 60 } });
}
