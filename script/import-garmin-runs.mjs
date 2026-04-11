import fs from 'node:fs/promises';
import process from 'node:process';

const PROJECT_ID =
  process.env.SANITY_PROJECT_ID || process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = 'production';
const API_VERSION = '2026-04-11';
const INPUT_PATH = new URL('./snapshot_garmin_20260411.json', import.meta.url);
const DEFAULT_LIMIT = Number.POSITIVE_INFINITY;
const DEFAULT_SKIP = 1;

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function formatLocalDateWithOffset(activity) {
  const raw = activity.start_date_local;

  if (!raw) return activity.start_date;
  if (/[+-]\d{2}:\d{2}$/.test(raw) || raw.endsWith('Z')) return raw;

  const offsetSeconds = Number(activity.utc_offset ?? 0);
  const sign = offsetSeconds >= 0 ? '+' : '-';
  const absolute = Math.abs(offsetSeconds);
  const hours = String(Math.floor(absolute / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((absolute % 3600) / 60)).padStart(2, '0');

  return `${raw.replace(/Z$/, '')}${sign}${hours}:${minutes}`;
}

function toRunDocument(activity) {
  const title = activity.name || `Run ${activity.id}`;
  // const localDate = formatLocalDateWithOffset(activity);

  return {
    // _id: `run.${activity.id}`,
    _type: 'run',
    title,
    slug: {
      _type: 'slug',
      current: slugify(`${title}-${activity.id}`),
    },
    activityId: activity.id,
    startDateLocal: activity.start_date,
    distanceMeters: activity.distance ?? 0,
    movingTimeSeconds: activity.moving_time ?? 0,
    elevationGainMeters: activity.total_elevation_gain ?? 0,
    averageSpeed: activity.average_speed ?? null,
    maxSpeed: activity.max_speed ?? null,
    averageCadence: activity.average_cadence ?? null,
    averageTemp: activity.average_temp ?? null,
    averageWatts: activity.average_watts ?? null,
    maxWatts: activity.max_watts ?? null,
    hasHeartrate: activity.has_heartrate ?? false,
    averageHeartrate: activity.average_heartrate ?? null,
    maxHeartrate: activity.max_heartrate ?? null,
    elevHigh: activity.elev_high ?? null,
    elevLow: activity.elev_low ?? null,
    startLocation:
      Array.isArray(activity.start_latlng) && activity.start_latlng.length === 2
        ? {
            _type: 'geopoint',
            lat: activity.start_latlng[0],
            lng: activity.start_latlng[1],
          }
        : null,
    endLocation:
      Array.isArray(activity.end_latlng) && activity.end_latlng.length === 2
        ? {
            _type: 'geopoint',
            lat: activity.end_latlng[0],
            lng: activity.end_latlng[1],
          }
        : null,
    summaryPolyline: activity.map?.summary_polyline ?? null,
  };
}

async function loadActivities() {
  const contents = await fs.readFile(INPUT_PATH, 'utf8');
  const parsed = JSON.parse(contents);

  if (!Array.isArray(parsed)) {
    throw new Error('Expected snapshot JSON to be an array of activities.');
  }

  return parsed;
}

async function main() {
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!token) {
    throw new Error('Missing SANITY_API_WRITE_TOKEN environment variable.');
  }

  const limit = Number(process.env.RUN_IMPORT_LIMIT ?? DEFAULT_LIMIT);
  const skip = Number(process.env.RUN_IMPORT_SKIP ?? DEFAULT_SKIP);
  const activities = await loadActivities();
  const filteredRuns = activities.filter((activity) => activity.type === 'Run');
  const safeSkip = Math.max(0, Math.floor(skip));
  const safeLimit = Number.isFinite(limit)
    ? Math.max(0, Math.floor(limit))
    : undefined;
  const runs = filteredRuns.slice(
    safeSkip,
    safeLimit === undefined ? undefined : safeSkip + safeLimit,
  );

  if (runs.length === 0) {
    console.log('No activities with type "Run" were found.');
    return;
  }

  const documents = runs.map(toRunDocument);
  const endpoint = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;

  console.log(
    `Importing ${documents.length} run(s) into ${PROJECT_ID}/${DATASET} (skipping first ${safeSkip})...`,
  );

  for (const document of documents) {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        mutations: [{ createOrReplace: document }],
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Sanity mutation failed: ${response.status} ${body}`);
    }

    console.log(`Imported ${document._id}`);
  }
}

main().catch((error) => {
  console.error(error.message);
  process.exitCode = 1;
});
