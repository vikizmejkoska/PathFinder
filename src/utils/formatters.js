export function formatDistance(value) {
  return `${Number(value || 0).toFixed(2)} km`;
}

export function formatDuration(seconds) {
  const totalSeconds = Number(seconds || 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const paddedMinutes = String(minutes).padStart(2, '0');
  const paddedSeconds = String(secs).padStart(2, '0');

  if (hours > 0) {
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
  }

  return `${paddedMinutes}:${paddedSeconds}`;
}

export function formatDate(dateString) {
  if (!dateString) return 'Unknown date';

  const date = new Date(dateString);
  return date.toLocaleString();
}