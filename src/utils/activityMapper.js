import { formatDate, formatDistance, formatDuration } from './formatters';

export function mapActivity(raw) {
  return {
    ...raw,
    title: `Activity - ${formatDate(raw.createdAt)}`,
    subtitle: `${formatDistance(raw.distanceKm)} • ${formatDuration(raw.elapsedSeconds)}`,
  };
}