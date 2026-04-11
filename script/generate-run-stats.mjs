import fs from 'node:fs/promises';

const inputPath = new URL('./snapshot_garmin_20260411.json', import.meta.url);
const outputPath = new URL('../web/app/data/garmin-run-stats.json', import.meta.url);

function formatDuration(seconds) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainder = seconds % 60;

  return [hours, minutes, remainder]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

function formatPace(secondsPerKm) {
  const minutes = Math.floor(secondsPerKm / 60);
  const seconds = Math.round(secondsPerKm % 60);

  if (seconds === 60) {
    return `${minutes + 1}:00/km`;
  }

  return `${minutes}:${String(seconds).padStart(2, '0')}/km`;
}

async function main() {
  const contents = await fs.readFile(inputPath, 'utf8');
  const activities = JSON.parse(contents);
  const runs = activities.filter((activity) => activity.sport_type === 'Run');

  const totalRuns = runs.length;
  const totalDistanceMeters = runs.reduce(
    (sum, activity) => sum + (activity.distance ?? 0),
    0,
  );
  const totalTimeSeconds = runs.reduce(
    (sum, activity) => sum + (activity.moving_time ?? 0),
    0,
  );
  const averagePaceSecondsPerKm =
    totalDistanceMeters > 0 ? totalTimeSeconds / (totalDistanceMeters / 1000) : 0;

  const stats = {
    totalRuns,
    totalDistanceMeters: Number(totalDistanceMeters.toFixed(1)),
    totalTimeSeconds,
    averagePaceSecondsPerKm: Number(averagePaceSecondsPerKm.toFixed(2)),
    formatted: {
      totalDistanceKilometers: `${(totalDistanceMeters / 1000).toFixed(2)} km`,
      totalTime: formatDuration(totalTimeSeconds),
      averagePace: formatPace(averagePaceSecondsPerKm),
    },
  };

  await fs.mkdir(new URL('../web/app/data/', import.meta.url), {recursive: true});
  await fs.writeFile(outputPath, `${JSON.stringify(stats, null, 2)}\n`, 'utf8');

  console.log(`Wrote run stats to ${outputPath.pathname}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
