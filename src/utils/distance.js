export function toRadians(value) {
  return (value * Math.PI) / 180;
}

export function calculateDistanceInKm(pointA, pointB) {
  if (!pointA || !pointB) return 0;

  const earthRadiusKm = 6371;

  const dLat = toRadians(pointB.latitude - pointA.latitude);
  const dLon = toRadians(pointB.longitude - pointA.longitude);

  const lat1 = toRadians(pointA.latitude);
  const lat2 = toRadians(pointB.latitude);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

export function calculateTotalDistanceInKm(points = []) {
  if (!points || points.length < 2) return 0;

  let total = 0;

  for (let i = 1; i < points.length; i += 1) {
    total += calculateDistanceInKm(points[i - 1], points[i]);
  }

  return total;
}